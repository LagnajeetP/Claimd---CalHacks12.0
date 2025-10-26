import os
from bson import ObjectId
from dotenv import load_dotenv
from datetime import datetime
from typing import Any, Dict
from connectDB import db

# Load environment
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv(dotenv_path)

# --------------------------------------------------------
# Utility: Convert MongoDB BSON → JSON-safe
# --------------------------------------------------------
def bson_to_json(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively converts MongoDB BSON types (ObjectId, datetime) into JSON-safe types."""
    if not doc:
        return {}

    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, list):
            result[key] = [bson_to_json(v) if isinstance(v, dict) else v for v in value]
        elif isinstance(value, dict):
            result[key] = bson_to_json(value)
        else:
            result[key] = value
    return result


# --------------------------------------------------------
# Main read function
# --------------------------------------------------------
async def read(ssn: str):
    """
    Given an SSN, find the user and return:
      - user info (name, SSN, etc.)
      - list of all applications (full data)
    """
    print(ssn)
    try:
        # Look up user
        user = await db.users.find_one({"socialSecurityNumber": ssn})
        if not user:
            return {"success": False, "error": f"No user found with socialSecurityNumber {ssn}"}

        # Collect all applications for this user
        app_ids = user.get("applications", [])
        applications = []

        for app_id in app_ids:
            app = await db.applications.find_one({"application_id": app_id})
            if app:
                applications.append(bson_to_json(app))

        # Combine results
        response_data = {
            "success": True,
            "user": bson_to_json(user),
            "applications": applications,
            "application_count": len(applications)
        }

        return response_data

    except Exception as e:
        print(f"❌ Error in read(): {e}")
        return {"success": False, "error": str(e)}
