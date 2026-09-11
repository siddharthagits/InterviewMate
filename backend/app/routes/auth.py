"""
auth.py — InterviewMate Authentication Routes
MongoDB Atlas backed with in-memory fallback when DB is unavailable.
Supports: email/password register & login, social OAuth, Google ID-token OAuth.
"""

import os
import json
import hmac
import hashlib
import secrets
import time
import ssl
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status

from app.database import get_database
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    SocialLoginRequest,
    GoogleLoginRequest,
    OAuthCodeRequest,
    UserResponse,
    SendRegisterOtpRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthMessageResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])

# ── In-memory fallback (used when Atlas is offline) ───────────────────────────
_memory_users: dict[str, dict] = {}
_memory_register_otps: dict[str, dict] = {}  # clean_email -> {"otp": "1234", "expires_at": float}
_memory_reset_otps: dict[str, dict] = {}     # clean_email -> {"otp": "1234", "expires_at": float}

# ── Built-in demo account ─────────────────────────────────────────────────────
DEMO_EMAIL    = "demo@interviewmate.ai"
DEMO_PASSWORD = "password123"
DEMO_USER     = {
    "id":         "usr-demo",
    "name":       "Demo Candidate",
    "email":      DEMO_EMAIL,
    "provider":   "email",
    "created_at": "2025-01-01T00:00:00.000Z",
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def generate_4digit_otp() -> str:
    """Generate a secure 4-digit numeric code (1000-9999)."""
    return f"{secrets.randbelow(9000) + 1000}"


_last_smtp_error: str = ""


def send_email_notification(to_email: str, subject: str, html_content: str, text_content: str = "") -> bool:
    """
    Sends email if SMTP environment variables are configured.
    Dynamically loads backend/.env so credentials are never stale.
    Returns True if sent successfully, False otherwise.
    """
    global _last_smtp_error
    _last_smtp_error = ""

    # Always ensure the freshest .env variables are loaded
    try:
        from dotenv import load_dotenv
        env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
        if os.path.exists(env_path):
            load_dotenv(env_path, override=True)
    except Exception as e:
        print(f"[InterviewMate Email System] env reload warning: {e}")

    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_port_raw = os.getenv("SMTP_PORT", "587").strip()
    smtp_port = int(smtp_port_raw) if smtp_port_raw.isdigit() else 587
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_pass = (os.getenv("SMTP_PASSWORD") or os.getenv("SMTP_PASS") or "").strip()
    sender    = (os.getenv("SMTP_FROM") or smtp_user or "noreply@interviewmate.ai").strip()

    print(f"[InterviewMate Email System] -> Attempting send to: {to_email} | Subject: {subject} | Host: {smtp_host}:{smtp_port} | User: {smtp_user}")

    if not (smtp_host and smtp_user and smtp_pass):
        _last_smtp_error = "SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASSWORD) are not configured in backend/.env"
        print(f"[InterviewMate Email System] Warning: {_last_smtp_error}")
        return False

    try:
        import smtplib
        import email.utils
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"InterviewMate <{sender}>"
        msg["To"] = to_email
        msg["Reply-To"] = sender
        msg["Date"] = email.utils.formatdate(localtime=True)
        domain = smtp_user.split("@")[-1] if "@" in smtp_user else "interviewmate.ai"
        msg["Message-ID"] = email.utils.make_msgid(domain=domain)

        if text_content:
            msg.attach(MIMEText(text_content, "plain", "utf-8"))
        if html_content:
            msg.attach(MIMEText(html_content, "html", "utf-8"))

        context = ssl.create_default_context()
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=15) as server:
                server.login(smtp_user, smtp_pass)
                server.sendmail(sender, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(smtp_user, smtp_pass)
                server.sendmail(sender, [to_email], msg.as_string())

        print(f"[InterviewMate Email System] -> Email successfully sent via SMTP to {to_email}")
        return True
    except Exception as e:
        _last_smtp_error = str(e)
        print(f"[InterviewMate Email System] -> Warning: SMTP send failed ({e})")
        return False


def hash_password(password: str) -> str:
    """PBKDF2-SHA256 with a random salt.  Format: '<hex-salt>$<hex-key>'"""
    salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        200_000,       # NIST-recommended iteration count
    ).hex()
    return f"{salt}${key}"


def verify_password(password: str, hashed_str: str) -> bool:
    """Constant-time comparison to prevent timing attacks."""
    try:
        salt, key = hashed_str.split("$", 1)
        computed = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt),
            200_000,
        ).hex()
        return hmac.compare_digest(key, computed)
    except Exception:
        return False


def serialize_user(doc: dict) -> dict:
    """Convert a MongoDB document (or in-memory dict) to a UserResponse-compatible dict."""
    return {
        "id":         str(doc.get("_id", doc.get("id", ""))),
        "name":       doc.get("name", "User"),
        "email":      doc.get("email", ""),
        "picture":    doc.get("picture", None),
        "provider":   doc.get("provider", "email"),
        "created_at": doc.get("created_at", _now()),
        "last_login": doc.get("last_login", None),
    }


def _db_available() -> bool:
    """Quick non-async check whether MongoDB is wired up."""
    try:
        get_database()
        return True
    except RuntimeError:
        return False


def verify_google_id_token(id_token: str) -> dict:
    """Verify a Google OAuth ID token via Google's tokeninfo endpoint."""
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "InterviewMate-Auth/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status != 200:
                raise ValueError("Google token verification failed")
            data = json.loads(resp.read().decode("utf-8"))

            expected_aud = os.getenv("GOOGLE_CLIENT_ID") or os.getenv("VITE_GOOGLE_CLIENT_ID", "")
            if expected_aud and data.get("aud") != expected_aud:
                print(f"[Auth] Warning: Google token aud mismatch ({data.get('aud')} vs {expected_aud})")

            return data
    except urllib.error.HTTPError as e:
        raise ValueError(f"Invalid Google ID token: {e.reason}")
    except Exception as e:
        raise ValueError(f"Could not verify Google token: {e}")


# ── Register ─────────────────────────────────────────────────────────────────

@router.post("/register/send-otp", response_model=AuthMessageResponse)
async def send_register_otp(payload: SendRegisterOtpRequest):
    """
    Generate and send a 4-digit verification code to the user's email before registration.
    """
    clean_email = payload.email.strip().lower()

    # Check if user already exists in DB
    try:
        db = get_database()
        if await db.users.find_one({"email": clean_email}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists. Please sign in instead.",
            )
    except HTTPException:
        raise
    except Exception:
        pass

    if clean_email in _memory_users or clean_email == DEMO_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    otp = generate_4digit_otp()
    expires_at = time.time() + 15 * 60  # 15 minutes

    # Save to MongoDB
    try:
        db = get_database()
        await db.email_verifications.update_one(
            {"email": clean_email},
            {"$set": {"email": clean_email, "otp": otp, "expires_at": expires_at}},
            upsert=True,
        )
    except Exception as e:
        print(f"[Auth] MongoDB email_verifications write note: {e}")

    _memory_register_otps[clean_email] = {"otp": otp, "expires_at": expires_at}
    print(f"[Auth] Registration 4-digit OTP generated for {clean_email}: {otp}")

    html_msg = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:24px;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <div style="max-width:500px;background:#ffffff;border-radius:16px;padding:36px 32px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;text-align:left;">
              <div style="margin-bottom:20px;">
                <span style="font-size:22px;font-weight:800;color:#7c3aed;letter-spacing:-0.5px;">InterviewMate</span>
              </div>
              <h1 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Verify Your Email</h1>
              <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px 0;">
                Thank you for creating an account with InterviewMate! Enter the following 4-digit code to complete your registration:
              </p>
              <div style="background:#f1f5f9;border:2px dashed #cbd5e1;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px 0;">
                <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#6d28d9;font-family:monospace;">{otp}</span>
              </div>
              <p style="font-size:13px;color:#64748b;line-height:1.5;margin:0 0 20px 0;">
                This code will expire in <strong>15 minutes</strong>. If you did not create an InterviewMate account, please disregard this message.
              </p>
              <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0 16px 0;" />
              <p style="font-size:12px;color:#94a3b8;margin:0;">
                &copy; InterviewMate AI. All rights reserved.
              </p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """
    text_msg = f"Your InterviewMate verification code is: {otp}. Valid for 15 minutes."
    sent = send_email_notification(clean_email, "InterviewMate - Verify Your Email", html_msg, text_msg)

    # If SMTP is configured and sending failed, let the caller know
    if not sent and os.getenv("SMTP_USER"):
        err_detail = _last_smtp_error or "SMTP connection or authentication failed"
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to send verification email to {clean_email} ({err_detail}). Please verify your email address or try again.",
        )

    return AuthMessageResponse(
        message="A 4-digit verification code has been sent to your email.",
        email=clean_email,
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegisterRequest):
    """
    Create a new email/password account.
    Primary:  MongoDB Atlas (users collection, unique email index)
    Fallback: In-memory dict when Atlas is unreachable
    """
    clean_email = payload.email.strip().lower()
    clean_name  = payload.name.strip()
    pw_hash     = hash_password(payload.password)
    now         = _now()

    # If 4-digit OTP was provided, verify it
    if payload.otp:
        clean_otp = payload.otp.strip()
        record = _memory_register_otps.get(clean_email)
        if not record:
            try:
                db = get_database()
                record = await db.email_verifications.find_one({"email": clean_email})
            except Exception:
                pass

        if not record or str(record.get("otp", "")).strip() != clean_otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid 4-digit verification code. Please check and try again.",
            )
        if time.time() > record.get("expires_at", 0):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code has expired. Please request a new code.",
            )

    # ── MongoDB primary path ──────────────────────────────────────────────────
    try:
        db = get_database()

        # Check for duplicate email
        if await db.users.find_one({"email": clean_email}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists. Please sign in instead.",
            )

        new_user = {
            "name":          clean_name,
            "email":         clean_email,
            "password_hash": pw_hash,
            "provider":      "email",
            "picture":       None,
            "created_at":    now,
            "last_login":    now,
        }
        result = await db.users.insert_one(new_user)
        new_user["_id"] = result.inserted_id

        # Mirror to memory cache for fast repeated reads
        _memory_users[clean_email] = {**new_user, "id": str(result.inserted_id)}

        # Clear used OTP
        _memory_register_otps.pop(clean_email, None)
        try:
            await db.email_verifications.delete_one({"email": clean_email})
        except Exception:
            pass

        print(f"[Auth] OK - Registered new user in MongoDB: {clean_email}")
        return serialize_user(new_user)

    except HTTPException:
        raise  # re-raise FastAPI validation errors as-is

    except RuntimeError:
        # MongoDB not configured -> fall through to in-memory
        pass

    except Exception as err:
        print(f"[Auth] WARNING - MongoDB register error ({err}) - falling back to memory")

    # ── In-memory fallback ────────────────────────────────────────────────────
    if clean_email in _memory_users:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    mem_user = {
        "id":          f"usr-{int(datetime.now().timestamp() * 1000)}",
        "name":        clean_name,
        "email":       clean_email,
        "password_hash": pw_hash,
        "provider":    "email",
        "picture":     None,
        "created_at":  now,
        "last_login":  now,
    }
    _memory_users[clean_email] = mem_user
    _memory_register_otps.pop(clean_email, None)
    print(f"[Auth] WARNING - Registered user in memory (MongoDB unavailable): {clean_email}")
    return serialize_user(mem_user)


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=UserResponse)
async def login(payload: UserLoginRequest):
    """
    Authenticate with email + password.
    Fast-path: built-in demo credentials bypass DB entirely.
    Primary:   MongoDB Atlas lookup + bcrypt-style password verify
    Fallback:  In-memory users dict
    """
    clean_email = payload.email.strip().lower()
    now         = _now()

    # ── Demo fast-path ────────────────────────────────────────────────────────
    if clean_email == DEMO_EMAIL and payload.password in (DEMO_PASSWORD, "demo123"):
        return serialize_user({**DEMO_USER, "last_login": now})

    # ── MongoDB primary path ──────────────────────────────────────────────────
    user = None
    db_available = False
    try:
        db = get_database()
        db_available = True
        user = await db.users.find_one({"email": clean_email})
    except RuntimeError:
        pass  # MongoDB not configured
    except Exception as err:
        print(f"[Auth] WARNING - MongoDB login query error ({err}) - checking memory cache")

    # ── In-memory fallback lookup ─────────────────────────────────────────────
    if user is None:
        user = _memory_users.get(clean_email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email. Please create an account first.",
        )

    # ── Password verification ─────────────────────────────────────────────────
    stored_hash = user.get("password_hash")
    if not stored_hash:
        provider = user.get("provider", "Google")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This account was registered via {provider}. Please sign in with {provider}.",
        )

    if not verify_password(payload.password, stored_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please check your credentials and try again.",
        )

    # ── Update last_login in Atlas ────────────────────────────────────────────
    if db_available and "_id" in user:
        try:
            db = get_database()
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"last_login": now}},
            )
        except Exception:
            pass  # non-critical

    user["last_login"] = now
    print(f"[Auth] OK - Login success: {clean_email}")
    return serialize_user(user)


# ── Social Login ──────────────────────────────────────────────────────────────

@router.post("/social", response_model=UserResponse)
async def social_login(payload: SocialLoginRequest):
    """
    Upsert a user via social OAuth (Google / GitHub / LinkedIn / X).
    Creates a new account if the email is not yet registered.
    """
    clean_email = payload.email.strip().lower()
    clean_name  = (payload.name or "").strip() or clean_email.split("@")[0]
    provider    = (payload.provider or "Google").strip()
    now         = _now()

    # ── MongoDB primary path ──────────────────────────────────────────────────
    try:
        db = get_database()
        user = await db.users.find_one({"email": clean_email})

        if user:
            # Existing user — update login timestamp & provider if needed
            updates: dict = {"last_login": now}
            if clean_name and not user.get("name"):
                updates["name"] = clean_name
            if not user.get("provider") or user.get("provider") == "email":
                updates["provider"] = provider
            if payload.picture:
                updates["picture"] = payload.picture

            await db.users.update_one({"_id": user["_id"]}, {"$set": updates})
            user.update(updates)
        else:
            # New social user
            new_user = {
                "name":          clean_name,
                "email":         clean_email,
                "password_hash": None,
                "provider":      provider,
                "picture":       payload.picture,
                "created_at":    now,
                "last_login":    now,
            }
            result = await db.users.insert_one(new_user)
            new_user["_id"] = result.inserted_id
            user = new_user

        _memory_users[clean_email] = {**user, "id": str(user.get("_id", user.get("id", "")))}
        print(f"[Auth] OK - Social login ({provider}): {clean_email}")
        return serialize_user(user)

    except RuntimeError:
        pass  # MongoDB not configured
    except Exception as err:
        print(f"[Auth] WARNING - MongoDB social login error ({err}) - falling back to memory")

    # ── In-memory fallback ────────────────────────────────────────────────────
    existing = _memory_users.get(clean_email)
    if existing:
        existing.update({"last_login": now, "provider": provider})
        if clean_name:
            existing["name"] = clean_name
        if payload.picture:
            existing["picture"] = payload.picture
        return serialize_user(existing)

    mem_user = {
        "id":       f"usr-{int(datetime.now().timestamp() * 1000)}",
        "name":     clean_name,
        "email":    clean_email,
        "provider": provider,
        "picture":  payload.picture,
        "created_at": now,
        "last_login": now,
    }
    _memory_users[clean_email] = mem_user
    return serialize_user(mem_user)


# ── Google OAuth (ID-token flow) ──────────────────────────────────────────────

@router.post("/google", response_model=UserResponse)
async def google_auth(payload: GoogleLoginRequest):
    """
    Verify a Google ID-token directly with Google's public endpoint,
    then upsert the user in MongoDB / in-memory.
    """
    try:
        google_data = verify_google_id_token(payload.credential)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    clean_email = (google_data.get("email") or "").strip().lower()
    clean_name  = (google_data.get("name")  or "").strip() or clean_email.split("@")[0]
    picture     = google_data.get("picture")
    google_id   = google_data.get("sub")
    now         = _now()

    if not clean_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account did not provide an email address.",
        )

    # Delegate to social_login logic via constructing a SocialLoginRequest-like payload
    from app.schemas.auth import SocialLoginRequest as SLR  # local import to avoid circular
    return await social_login(
        SLR(name=clean_name, email=clean_email, provider="Google", picture=picture)
    )


# ── GitHub & LinkedIn OAuth Code Exchange ─────────────────────────────────────

def exchange_github_code(code: str, redirect_uri: str | None = None) -> dict:
    client_id = os.getenv("GITHUB_CLIENT_ID") or os.getenv("VITE_GITHUB_CLIENT_ID", "")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET", "")
    if not client_id or not client_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub OAuth is not configured on the server. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env or use Instant Account access.",
        )

    token_url = "https://github.com/login/oauth/access_token"
    post_data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": code,
    }
    if redirect_uri:
        post_data["redirect_uri"] = redirect_uri

    req = urllib.request.Request(
        token_url,
        data=json.dumps(post_data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "InterviewMate-Auth/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            token_data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"GitHub token exchange failed: {e}")

    access_token = token_data.get("access_token")
    if not access_token:
        err_msg = token_data.get("error_description") or token_data.get("error") or "No access token returned by GitHub"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"GitHub authorization failed: {err_msg}")

    # Fetch user profile
    user_req = urllib.request.Request(
        "https://api.github.com/user",
        headers={
            "Authorization": f"Bearer {access_token}",
            "User-Agent": "InterviewMate-Auth/1.0",
            "Accept": "application/vnd.github+json",
        },
    )
    try:
        with urllib.request.urlopen(user_req, timeout=12) as resp:
            profile = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to fetch GitHub profile: {e}")

    email = profile.get("email")
    if not email:
        try:
            emails_req = urllib.request.Request(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "User-Agent": "InterviewMate-Auth/1.0",
                    "Accept": "application/vnd.github+json",
                },
            )
            with urllib.request.urlopen(emails_req, timeout=12) as resp:
                emails = json.loads(resp.read().decode("utf-8"))
                for item in emails:
                    if item.get("primary") and item.get("verified"):
                        email = item.get("email")
                        break
                if not email and emails:
                    email = emails[0].get("email")
        except Exception:
            pass

    if not email:
        login_handle = profile.get("login") or "github_user"
        email = f"{login_handle.lower()}@users.noreply.github.com"

    return {
        "name": profile.get("name") or profile.get("login") or "GitHub User",
        "email": email,
        "picture": profile.get("avatar_url"),
        "provider": "GitHub",
    }


def exchange_linkedin_code(code: str, redirect_uri: str | None = None) -> dict:
    client_id = os.getenv("LINKEDIN_CLIENT_ID") or os.getenv("VITE_LINKEDIN_CLIENT_ID", "")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET", "")
    if not client_id or not client_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="LinkedIn OAuth is not configured on the server. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in backend/.env or use Instant Account access.",
        )

    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    post_data = urllib.parse.urlencode({
        "grant_type": "authorization_code",
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri or "http://localhost:5173/login",
    }).encode("utf-8")

    req = urllib.request.Request(
        token_url,
        data=post_data,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "InterviewMate-Auth/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            token_data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"LinkedIn token exchange failed: {e}")

    access_token = token_data.get("access_token")
    if not access_token:
        err_msg = token_data.get("error_description") or token_data.get("error") or "No access token returned by LinkedIn"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"LinkedIn authorization failed: {err_msg}")

    # OpenID Connect userinfo endpoint
    user_req = urllib.request.Request(
        "https://api.linkedin.com/v2/userinfo",
        headers={
            "Authorization": f"Bearer {access_token}",
            "User-Agent": "InterviewMate-Auth/1.0",
        },
    )
    try:
        with urllib.request.urlopen(user_req, timeout=12) as resp:
            profile = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to fetch LinkedIn user info: {e}")

    name = profile.get("name")
    if not name:
        name = f"{profile.get('given_name', '')} {profile.get('family_name', '')}".strip() or "LinkedIn User"

    email = profile.get("email")
    if not email:
        sub = profile.get("sub") or "user"
        email = f"{sub}@linkedin.com"

    return {
        "name": name,
        "email": email,
        "picture": profile.get("picture"),
        "provider": "LinkedIn",
    }


@router.post("/oauth/github", response_model=UserResponse)
async def github_oauth_login(payload: OAuthCodeRequest):
    """Exchange a GitHub OAuth authorization code and log in / register the user."""
    profile = exchange_github_code(payload.code, payload.redirect_uri)
    return await social_login(
        SocialLoginRequest(
            name=profile["name"],
            email=profile["email"],
            provider="GitHub",
            picture=profile.get("picture"),
        )
    )


@router.post("/oauth/linkedin", response_model=UserResponse)
async def linkedin_oauth_login(payload: OAuthCodeRequest):
    """Exchange a LinkedIn OAuth authorization code and log in / register the user."""
    profile = exchange_linkedin_code(payload.code, payload.redirect_uri)
    return await social_login(
        SocialLoginRequest(
            name=profile["name"],
            email=profile["email"],
            provider="LinkedIn",
            picture=profile.get("picture"),
        )
    )


# ── Get current user ──────────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: str):
    """Fetch a user by MongoDB ObjectId, custom id field, or email."""
    now = _now()

    # Demo shortcut
    if user_id.strip().lower() in (DEMO_EMAIL, "usr-demo"):
        return serialize_user({**DEMO_USER, "last_login": now})

    user = None

    # ── MongoDB primary path ──────────────────────────────────────────────────
    try:
        db = get_database()
        query: dict = {}
        uid = user_id.strip()

        if ObjectId.is_valid(uid):
            query = {"$or": [{"_id": ObjectId(uid)}, {"id": uid}, {"email": uid.lower()}]}
        else:
            query = {"$or": [{"id": uid}, {"email": uid.lower()}]}

        user = await db.users.find_one(query)
    except RuntimeError:
        pass
    except Exception as err:
        print(f"[Auth] WARNING - MongoDB /me error ({err})")

    # ── In-memory fallback ────────────────────────────────────────────────────
    if user is None:
        uid_lower = user_id.strip().lower()
        user = _memory_users.get(uid_lower)
        if not user:
            for u in _memory_users.values():
                if u.get("id") == user_id.strip():
                    user = u
                    break

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    return serialize_user(user)


# ── Forgot & Reset Password ───────────────────────────────────────────────────

@router.post("/forgot-password", response_model=AuthMessageResponse)
async def forgot_password(payload: ForgotPasswordRequest):
    """
    Send a 4-digit OTP code to the user's email to reset their password.
    """
    clean_email = payload.email.strip().lower()

    # Lookup user
    user = None
    try:
        db = get_database()
        user = await db.users.find_one({"email": clean_email})
    except Exception:
        pass

    if user is None:
        user = _memory_users.get(clean_email)
    if clean_email == DEMO_EMAIL:
        user = DEMO_USER

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address. Please check your email or create an account.",
        )

    provider = user.get("provider", "email")
    if provider not in ("email", None) and not user.get("password_hash"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This account is linked with {provider}. Please sign in using {provider}.",
        )

    otp = generate_4digit_otp()
    expires_at = time.time() + 15 * 60  # 15 minutes

    try:
        db = get_database()
        await db.password_resets.update_one(
            {"email": clean_email},
            {"$set": {"email": clean_email, "otp": otp, "expires_at": expires_at}},
            upsert=True,
        )
    except Exception as e:
        print(f"[Auth] MongoDB password_resets write note: {e}")

    _memory_reset_otps[clean_email] = {"otp": otp, "expires_at": expires_at}
    print(f"[Auth] Password reset 4-digit OTP generated for {clean_email}: {otp}")

    html_msg = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:24px;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <div style="max-width:500px;background:#ffffff;border-radius:16px;padding:36px 32px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;text-align:left;">
              <div style="margin-bottom:20px;">
                <span style="font-size:22px;font-weight:800;color:#7c3aed;letter-spacing:-0.5px;">InterviewMate</span>
              </div>
              <h1 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Reset Your Password</h1>
              <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px 0;">
                We received a request to reset your InterviewMate password. Use the following 4-digit code to complete the reset:
              </p>
              <div style="background:#f1f5f9;border:2px dashed #cbd5e1;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px 0;">
                <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#6d28d9;font-family:monospace;">{otp}</span>
              </div>
              <p style="font-size:13px;color:#64748b;line-height:1.5;margin:0 0 20px 0;">
                This code will expire in <strong>15 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0 16px 0;" />
              <p style="font-size:12px;color:#94a3b8;margin:0;">
                &copy; InterviewMate AI. All rights reserved.
              </p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """
    text_msg = f"Your InterviewMate password reset code is: {otp}. Valid for 15 minutes."
    sent = send_email_notification(clean_email, "InterviewMate - Password Reset Code", html_msg, text_msg)

    # If SMTP is configured and sending failed, notify caller
    if not sent and os.getenv("SMTP_USER"):
        err_detail = _last_smtp_error or "SMTP connection or authentication failed"
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to send reset code to {clean_email} ({err_detail}). Please verify your email address or try again.",
        )

    return AuthMessageResponse(
        message="A 4-digit password reset code has been sent to your email.",
        email=clean_email,
    )


@router.post("/reset-password", response_model=AuthMessageResponse)
async def reset_password(payload: ResetPasswordRequest):
    """
    Verify the 4-digit OTP and reset the user's password.
    """
    clean_email = payload.email.strip().lower()
    clean_otp   = payload.otp.strip()

    # Demo account protection
    if clean_email == DEMO_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The demo candidate account password cannot be modified.",
        )

    # Verify OTP against memory or MongoDB
    record = _memory_reset_otps.get(clean_email)
    if not record:
        try:
            db = get_database()
            record = await db.password_resets.find_one({"email": clean_email})
        except Exception:
            pass

    if not record or str(record.get("otp", "")).strip() != clean_otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 4-digit reset code. Please check and try again.",
        )

    if time.time() > record.get("expires_at", 0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset code has expired. Please request a new code.",
        )

    new_hash = hash_password(payload.new_password)
    now      = _now()
    updated  = False

    # Update in MongoDB Atlas
    try:
        db = get_database()
        res = await db.users.update_one(
            {"email": clean_email},
            {"$set": {"password_hash": new_hash, "updated_at": now}},
        )
        if res.matched_count > 0:
            updated = True
    except Exception as e:
        print(f"[Auth] MongoDB reset-password error ({e})")

    # Update in-memory fallback
    if clean_email in _memory_users:
        _memory_users[clean_email]["password_hash"] = new_hash
        updated = True

    # Clear OTP
    _memory_reset_otps.pop(clean_email, None)
    try:
        db = get_database()
        await db.password_resets.delete_one({"email": clean_email})
    except Exception:
        pass

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found. Password could not be updated.",
        )

    print(f"[Auth] OK - Password reset successful for: {clean_email}")
    return AuthMessageResponse(
        message="Password has been successfully reset! You can now sign in with your new password.",
        email=clean_email,
    )

