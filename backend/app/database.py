import os

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ReadPreference


_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


def connect_to_mongodb() -> None:
    """Create the MongoDB client when the API starts (sync wrapper)."""
    global _client, _db

    mongodb_url = os.getenv("MONGODB_URL", "").strip()
    db_name = os.getenv("MONGODB_DATABASE", "interviewmate").strip()

    if not mongodb_url:
        print("[DB] WARNING - MONGODB_URL not set. Running with in-memory fallback only.")
        return

    try:
        # Use primaryPreferred so reads work even when primary election is ongoing.
        # Atlas free-tier (M0) can sometimes have no primary available briefly.
        _client = AsyncIOMotorClient(
            mongodb_url,
            serverSelectionTimeoutMS=15000,
            connectTimeoutMS=10000,
            socketTimeoutMS=30000,
            maxPoolSize=10,
            retryWrites=True,
            retryReads=True,
            readPreference="primaryPreferred",
            tls=True,
        )
        _db = _client[db_name]
        print(f"[DB] OK - MongoDB client created. Database: '{db_name}'")
    except Exception as err:
        print(f"[DB] ERROR - Failed to create MongoDB client: {err}")
        _client = None
        _db = None


async def ping_mongodb() -> bool:
    """
    Verify the Atlas connection with a lightweight ping using 'nearest' read preference
    so it works even during primary elections on M0 free-tier clusters.
    """
    global _client, _db
    if _client is None:
        return False
    try:
        # 'ping' runs on any reachable node — doesn't require primary
        await _client.admin.command("ping")
        db_name = os.getenv("MONGODB_DATABASE", "interviewmate")
        _db = _client[db_name]

        # Create unique index on email (idempotent if already exists)
        try:
            await _db.users.create_index("email", unique=True, background=True)
            print("[DB] OK - Unique email index ensured on users collection.")
        except Exception as idx_err:
            print(f"[DB] WARNING - Could not create email index: {idx_err}")

        print("[DB] OK - MongoDB Atlas connected successfully.")
        return True
    except Exception as err:
        print(f"[DB] ERROR - MongoDB ping failed: {err}")
        # Don't null out _client — leave it so request-time retries can still succeed
        _db = None
        return False


def close_mongodb_connection() -> None:
    """Close the MongoDB client when the API stops."""
    global _client, _db
    if _client is not None:
        _client.close()
        _client = None
        _db = None
        print("[DB] MongoDB connection closed.")


def get_database() -> AsyncIOMotorDatabase:
    """
    Return the active database handle.
    On each request we try to re-acquire the db handle if it was lost during
    a transient startup failure (e.g. Atlas primary election).
    """
    global _db
    if _db is None and _client is not None:
        # Client is wired up but ping failed at startup — try again lazily
        db_name = os.getenv("MONGODB_DATABASE", "interviewmate")
        _db = _client[db_name]

    if _db is None:
        raise RuntimeError(
            "MongoDB is not connected. "
            "Ensure MONGODB_URL is set in .env and the server is running."
        )
    return _db
