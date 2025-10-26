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
# Read single application by ID
# --------------------------------------------------------
async def read_application_by_id(application_id: str):
    """
    Given an application_id, find and return the full application data
    """
    print(f"Fetching application: {application_id}")
    try:
        app = await db.applications.find_one({"application_id": application_id})
        if not app:
            return {"success": False, "error": f"No application found with application_id {application_id}"}

        return {"success": True, "application": bson_to_json(app)}

    except Exception as e:
        print(f"❌ Error in read_application_by_id(): {e}")
        return {"success": False, "error": str(e)}


# --------------------------------------------------------
# Main read function
# --------------------------------------------------------
async def read_all_applications():
    """
    Get all applications from the database for admin dashboard
    """
    print("Fetching all applications")
    try:
        # Find all applications
        cursor = db.applications.find({})
        applications = []
        
        async for app in cursor:
            applications.append(bson_to_json(app))

        response_data = {
            "success": True,
            "applications": applications,
            "application_count": len(applications)
        }

        return response_data

    except Exception as e:
        print(f"❌ Error in read_all_applications(): {e}")
        return {"success": False, "error": str(e)}


async def read():
    """
    Get all users and all their applications (full data)
    """
    try:
        print("Fetching all users with their applications")

        users_cursor = db.users.find({})
        users_with_apps = []

        async for user in users_cursor:
            # Extract application IDs for this user
            app_ids = user.get("applications", [])
            applications = []

            # Fetch each application by ID
            for app_id in app_ids:
                app = await db.applications.find_one({"application_id": app_id})
                if app:
                    applications.append(bson_to_json(app))

            # Add user + their applications to list
            users_with_apps.append({
                **bson_to_json(user),
                "applications_full": applications,
                "application_count": len(applications)
            })

        # Final response
        return {
            "success": True,
            "total_users": len(users_with_apps),
            "users": users_with_apps
        }

    except Exception as e:
        print(f"❌ Error in read(): {e}")
        return {"success": False, "error": str(e)}

