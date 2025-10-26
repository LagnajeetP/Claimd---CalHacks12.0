# connectDB.py
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.env"))
load_dotenv(dotenv_path)

# Get MongoDB URI from environment
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "Main"

if not MONGO_URI:
    print("❌ MONGO_URI not found in environment variables!")
    print(f"   Looking for .env at: {dotenv_path}")
    raise ValueError("MONGO_URI is required but not found in .env file")

# Create global Mongo client
client = AsyncIOMotorClient(MONGO_URI)

# Access specific database
db = client[DB_NAME]

print("✅ MongoDB connection initialized (global client)")
print(f"   Database: {DB_NAME}")