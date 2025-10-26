import os
from bson import ObjectId
from dotenv import load_dotenv
from datetime import datetime, timezone
from typing import Any, Dict
from connectDB import db
import base64
from bson import Binary


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
        
        docs = app["documents"]
        doc_id = docs["document_id"]
        print(doc_id)
                
        doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
        
        if not doc:
            return {"success": False, "application": bson_to_json(app)} 
        
        app["document"] = base64.b64encode(doc["data"]).decode("utf-8")

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

async def get_document_data(document_ref: Dict[str, Any]):
    try:
        if not document_ref or "document_id" not in document_ref:
            return None
        
        document_id = document_ref["document_id"]
        doc = await db.documents.find_one({"_id": ObjectId(document_id)})
        
        if not doc:
            return None

        return doc.get["data"]
    except Exception as e:
        print(f"ERROR FETCHING DOCUMENT DATA: {e}")
        return None

async def read_applications_by_user_ssn(ssn: str):
    """
    Get all applications for a specific user by their SSN
    """
    print(f"Fetching applications for user with SSN: {ssn}")
    try:
        # First find the user by SSN
        user = await db.users.find_one({"socialSecurityNumber": ssn})
        
        if not user:
            return {"success": False, "error": f"No user found with SSN {ssn}"}
        
        # Get all application IDs for this user
        application_ids = user.get("applications", [])
        
        if not application_ids:
            return {
                "success": True, 
                "applications": [],
                "user": bson_to_json(user),
                "application_count": 0
            }
        
        # Find all applications for this user
        cursor = db.applications.find({"application_id": {"$in": application_ids}})
        applications = []
        
        async for app in cursor:
            app_json = bson_to_json(app)
            
            document_ref = app.get("documents")
            document_data = await get_document_data(document_ref)
            
            app_json["document_full"] = document_data
            
            applications.append(app_json)

        response_data = {
            "success": True,
            "applications": applications,
            "user": bson_to_json(user),
            "application_count": len(applications)
        }

        return response_data

    except Exception as e:
        print(f"❌ Error in read_applications_by_user_ssn(): {e}")
        return {"success": False, "error": str(e)}


async def update_application_status(application_id: str, status: str, admin_notes: str = ""):
    """
    Update the status of an application (approve/deny)
    """
    print(f"Updating application {application_id} status to: {status}")
    try:
        # Validate status
        valid_statuses = ["APPROVED", "DENIED", "PENDING", "UNDER_REVIEW"]
        if status.upper() not in valid_statuses:
            return {"success": False, "error": f"Invalid status. Must be one of: {valid_statuses}"}
        
        # Update the application
        result = await db.applications.update_one(
            {"application_id": application_id},
            {
                "$set": {
                    "admin_status": status.upper(),
                    "admin_notes": admin_notes,
                    "status_updated_at": datetime.now(timezone.utc)
                }
            }
        )
        
        if result.matched_count == 0:
            return {"success": False, "error": f"No application found with ID {application_id}"}
        
        print(f"✅ Application {application_id} status updated to {status}")
        return {"success": True, "message": f"Application status updated to {status}"}

    except Exception as e:
        print(f"❌ Error updating application status: {e}")
        return {"success": False, "error": str(e)}


async def read_all_users():
    """
    Get all users with basic info (no full application data)
    """
    try:
        print("Fetching all users")
        
        users_cursor = db.users.find({})
        users = []
        
        async for user in users_cursor:
            users.append({
                "user_id": user.get("user_id"),
                "name": user.get("name"),
                "ssn": user.get("socialSecurityNumber"),
                "application_count": len(user.get("applications", []))
            })
        
        return {"success": True, "users": users, "count": len(users)}
    
    except Exception as e:
        print(f"❌ Error in read_all_users(): {e}")
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

