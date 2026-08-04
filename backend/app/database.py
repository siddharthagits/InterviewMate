import os

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase


_client: AsyncIOMotorClient | None = None


def connect_to_mongodb() -> None:
    """Create the MongoDB client when the API starts."""
    global _client

    mongodb_url = os.getenv("MONGODB_URL")
    if not mongodb_url:
        print("MongoDB is not configured. Set MONGODB_URL to enable session history.")
        return

    _client = AsyncIOMotorClient(mongodb_url)


def close_mongodb_connection() -> None:
    """Close the MongoDB client when the API stops."""
    global _client
    if _client is not None:
        _client.close()
        _client = None


def get_database() -> AsyncIOMotorDatabase:
    if _client is None:
        raise RuntimeError("MongoDB is not configured. Set MONGODB_URL and restart the API.")

    return _client[os.getenv("MONGODB_DATABASE", "interviewmate")]
