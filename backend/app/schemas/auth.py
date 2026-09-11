import re
from typing import Optional
from pydantic import BaseModel, Field, field_validator


EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

# ── Disposable / throwaway email domain blocklist ────────────────────────────
DISPOSABLE_DOMAINS = {
    # MailinatorGroup
    "mailinator.com", "trashmail.com", "guerrillamail.com", "guerrillamail.net",
    "guerrillamail.de", "guerrillamail.org", "guerrillamail.biz", "guerrillamail.info",
    "spam4.me", "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf",
    "nospam.ze.tc", "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf",
    "moncourrier.fr.nf", "monemail.fr.nf", "monmail.fr.nf",
    # Temp-mail services
    "tempmail.com", "temp-mail.org", "temp-mail.io", "throwam.com", "throwam.net",
    "fakeinbox.com", "dispostable.com", "maildrop.cc", "mailnull.com",
    "spamgourmet.com", "spamgourmet.net", "spamgourmet.org",
    "trashmail.at", "trashmail.io", "trashmail.me", "trashmail.net",
    "trashmail.xyz", "trashmailer.com",
    # 10 minute mail & variants
    "10minutemail.com", "10minutemail.net", "10minutemail.org", "10minutemail.de",
    "10minutemail.co.uk", "10minutemail.pl", "10minutemail.be", "10minutemail.cf",
    "10minutemail.ga", "10minutemail.gq", "10minutemail.ml", "10minutemail.tk",
    "10minutemail.us", "10minemail.com", "10mail.org",
    "20minutemail.com", "20minutemail.it",
    # GuerrillaMail family
    "sharklasers.com", "guerrillamailblock.com", "grr.la", "guerrillamail.info",
    "spam4.me", "jourrapide.com", "antispam24.de", "discard.email",
    # Other common throwaway services
    "getairmail.com", "filzmail.com", "throwam.com", "emailondeck.com",
    "emailsensei.com", "emailtemporal.org", "emailthe.net", "emailwarden.com",
    "fastmail.cn", "fux0ringduh.com", "get1mail.com", "getonemail.com",
    "gishpuppy.com", "haltospam.com", "inoutmail.eu", "jetable.com",
    "jetable.net", "jetable.org", "junk.to", "klzlk.com",
    "kurzepost.de", "lifebyfood.com", "link2mail.net", "litedrop.com",
    "lol.ovpn.to", "lookugly.com", "lopl.co.cc", "lortemail.dk",
    "lr78.com", "lucky.royalmail.store", "maildrop.cc",
    "mailexpire.com", "mailfreeonline.com", "mailguard.me", "mailimate.com",
    "mailme.ir", "mailme24.com", "mailmetrash.com", "mailmoat.com",
    "mailnew.com", "mailnull.com", "mailpick.biz", "mailrock.biz",
    "mailscrap.com", "mailshell.com", "mailsiphon.com", "mailslite.com",
    "mailzilla.com", "mbx.cc", "meltmail.com", "messagebeamer.de",
    "mezimages.net", "ministry-of-silly-walks.de", "mintemail.com",
    "moncourrier.fr.nf", "monemail.fr.nf", "monmail.fr.nf",
    "mt2009.com", "mt2014.com", "mytrashmail.com", "nabuma.com",
    "netzidiot.de", "nevermail.de", "no-spam.ws", "nobulk.com",
    "noclickemail.com", "nodezine.com", "noicd.com", "nokiamail.com",
    "nospam.ze.tc", "nospam4.us", "nospamfor.us", "nospammail.net",
    "notmailinator.com", "nowhere.org", "nowmymail.com",
    "nurfuerspam.de", "nus.edu.sg",
    "objectmail.com", "obobbo.com", "oneoffemail.com", "onewaymail.com",
    "online.ms", "opentrash.com", "ordinaryamerican.net",
    "owlpic.com", "pimpedupmyspace.com", "pookmail.com",
    "proxymail.eu", "putthisinyourspamdatabase.com",
    "qq.com",  # China-based, commonly used for fake accounts
    "rcpt.at", "recode.me", "recursor.net", "regbypass.com",
    "rejectmail.com", "rklips.com", "rmqkr.net",
    "rofl.routers.biz", "rppkn.com", "rstarmail.com", "rtrtr.com",
    "s0ny.net", "safe-mail.gq", "safetymail.info", "safetypost.de",
    "sandelf.de", "saynotospams.com", "schafmail.de", "schrott-email.de",
    "secretemail.de", "serasah.com", "sharedmailbox.org",
    "shieldemail.com", "shiftmail.com", "shitmail.de", "shitmail.org",
    "shitware.nl", "skeefmail.com", "slapsfromlastnight.com",
    "slipry.net", "smellfear.com", "snakemail.com", "sneakemail.com",
    "snkmail.com", "sofimail.com", "sofort-mail.de",
    "soodonims.com", "spam.la", "spam.su", "spamavert.com",
    "spambob.com", "spambob.net", "spambob.org", "spambog.com",
    "spambog.de", "spambog.ru", "spambox.info", "spambox.irishspringrealty.com",
    "spambox.us", "spamcannon.com", "spamcannon.net", "spamcero.com",
    "spamcon.org", "spamcorptastic.com", "spamcowboy.com",
    "spamcowboy.net", "spamcowboy.org", "spamday.com", "spamex.com",
    "spamfree.eu", "spamfree24.de", "spamfree24.eu", "spamfree24.info",
    "spamfree24.net", "spamfree24.org", "spamgoes.in", "spamherelots.com",
    "spamherelots.com", "spamhereplease.com", "spamhole.com",
    "spamify.com", "spaminator.de", "spamkill.info", "spaml.com",
    "spaml.de", "spammotel.com", "spamobox.com", "spamoff.de",
    "spamslicer.com", "spamspot.com", "spamthis.co.uk", "spamthisplease.com",
    "spamtrail.com", "spamtrap.ro", "speed.1s.fr", "suremail.info",
    "svk.jp", "sweetxxx.de", "tagmymedia.com", "teewars.org",
    "teleworm.com", "tempalias.com", "tempe-mail.com", "tempemail.biz",
    "tempemail.com", "tempemail.net", "tempinbox.co.uk", "tempinbox.com",
    "tempmail.de", "tempmail.eu", "tempmail.it", "tempmail2.com",
    "tempr.email", "tempthe.net", "thankyou2010.com", "thisisnotmyrealemail.com",
    "throwam.com", "tilien.com", "tittbit.in", "tmail.com",
    "tmailinator.com", "toiea.com", "toomail.biz", "topranklist.de",
    "tradermail.info", "trash-mail.at", "trash-mail.cf",
    "trash-mail.de", "trash-mail.ga", "trash-mail.gq", "trash-mail.io",
    "trash-mail.ml", "trash-mail.net", "trash-mail.tk",
    "trash2009.com", "trashemail.de", "trashmail.at",
    "trashmail.com", "trashmail.de", "trashmail.io",
    "trashmail.me", "trashmail.net", "trashmail.org", "trashmail.xyz",
    "trashmailer.com", "trashmailer.info", "trg.pw", "ttttt.pk",
    "turual.com", "twinmail.de", "tyldd.com",
    "uggsrock.com", "upliftnow.com", "uroid.com", "us.af",
    "venompen.com", "viditag.com", "viewcastmedia.com",
    "viewcastmedia.net", "viewcastmedia.org", "vomoto.com",
    "vubby.com", "walala.org", "walkmail.net", "wasteland.rfc822.org",
    "webemail.me", "webm4il.info", "weg-werf-email.de",
    "wegwerfadresse.de", "wegwerfemail.com", "wegwerfemail.de",
    "wegwerfemail.net", "wegwerfemail.org", "wegwerfmail.de",
    "wegwerfmail.net", "wegwerfmail.org", "wegwerfmails.de",
    "whatpaas.com", "whipmail.com", "whopy.com", "wilemail.com",
    "willselfdestruct.com", "winemaven.info", "wronghead.com",
    "wuzupmail.net", "www.e4ward.com", "wwwnew.eu",
    "xagloo.co", "xagloo.com", "xemaps.com", "xents.com",
    "xmaily.com", "xoxy.net", "xyzzy.nl",
    "yep.it", "yogamaven.com", "yomail.info",
    "yopmail.com", "yopmail.fr", "yopmail.gq",
    "yopmail.net", "youmail.ga", "ypmail.webarnak.fr.eu.org",
    "yuurok.com", "z1p.biz", "za.com", "zehnminuten.de",
    "zehnminutenmail.de", "zippymail.info", "zoaxe.com",
    "zoemail.net", "zoemail.org", "zomg.info",
}


class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=3, max_length=150)
    password: str = Field(..., min_length=8, max_length=100)
    otp: Optional[str] = Field(default=None, max_length=10)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        domain = clean.split("@", 1)[-1]
        if domain in DISPOSABLE_DOMAINS:
            raise ValueError(
                "Disposable or temporary email addresses are not allowed. "
                "Please use a real email address."
            )
        return clean

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        clean = v.strip()
        if len(clean) < 2:
            raise ValueError("Name must be at least 2 characters")
        return clean

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[a-zA-Z]", v):
            raise ValueError("Password must contain at least one letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        return v


class UserLoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=150)
    password: str = Field(..., min_length=1)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        return clean


class SocialLoginRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=150)
    provider: str = Field(default="Google", max_length=50)
    picture: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        return clean

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Name is required")
        return clean


class GoogleLoginRequest(BaseModel):
    credential: str = Field(..., min_length=10)


class OAuthCodeRequest(BaseModel):
    code: str = Field(..., min_length=1)
    redirect_uri: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    picture: Optional[str] = None
    provider: Optional[str] = "email"
    created_at: str
    last_login: Optional[str] = None


class SendRegisterOtpRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=150)
    name: Optional[str] = Field(default=None, max_length=100)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        domain = clean.split("@", 1)[-1]
        if domain in DISPOSABLE_DOMAINS:
            raise ValueError(
                "Disposable or temporary email addresses are not allowed. "
                "Please use a real email address."
            )
        return clean


class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=150)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        return clean


class ResetPasswordRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=150)
    otp: str = Field(..., min_length=4, max_length=10)
    new_password: str = Field(..., min_length=8, max_length=100)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        return clean

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, v: str) -> str:
        clean = v.strip()
        if not re.match(r"^\d{4}$", clean):
            raise ValueError("Verification code must be a 4-digit code")
        return clean

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[a-zA-Z]", v):
            raise ValueError("Password must contain at least one letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        return v


class AuthMessageResponse(BaseModel):
    message: str
    email: Optional[str] = None


