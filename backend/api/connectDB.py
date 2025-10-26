# connectDB.py
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Optional: load from environment variables for security
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "Main"

# Create global Mongo client
client = AsyncIOMotorClient(MONGO_URI)

# Access specific database
db = client[DB_NAME]

print("✅ MongoDB connection initialized (global client)")
