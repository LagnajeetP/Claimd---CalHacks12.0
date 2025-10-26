# 10/25/2025
# main.py -- Main Program for Backend

# Import Separate Files
from api.ai.ai import ai
from api.read.read import read, read_application_by_id, read_all_applications

from fastapi.middleware.cors import CORSMiddleware

# Import Modules
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import uvicorn
from pydantic import BaseModel
from typing import Any, Dict

# RESPONSE/REQUEST SCHEMAS
class ReadRequest(BaseModel):
    ssn: str  # specifically expect an SSN string

class ReadResponse(BaseModel):
    data: Dict[str, Any]

class WriteResponse(BaseModel):
    decision: str
    confidence: float
    confidence_label: str
    summary: str
    recommendation: str
    ssdi_amount: float

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REQUEST: MultiStepForm data with file uploads
# RESPONSE: Processing results with MongoDB document IDs
# FUNCTIONALITY: Process form data and upload to MongoDB with ordered fields
@app.post("/api/benefit-application")
async def handle_benefit_application(
    firstName: str = Form(...),
    lastName: str = Form(...),
    dateOfBirth: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    zipCode: str = Form(...),
    socialSecurityNumber: str = Form(...),
    medicalRecordsFile: UploadFile = File(None),
    incomeDocumentsFile: UploadFile = File(None)
):
    try:
        form_data = {
            "firstName": firstName,
            "lastName": lastName,
            "dateOfBirth": dateOfBirth,
            "address": address,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "socialSecurityNumber": socialSecurityNumber,
        }
        
        # Call AI function
        result = await ai(
            form_data,
            medicalRecordsFile,
            incomeDocumentsFile
        )
        
        # Check if AI processing was successful
        if not result or not result.get("success"):
            error_msg = result.get("error", "Unknown error") if result else "No response from AI"
            raise HTTPException(status_code=500, detail=error_msg)
        
        # Extract the JSON result from AI analysis
        json_result = result.get("result", {})
        application_id = result.get("application_id")
        
        return {
            "success": True,
            "message": "Application processed successfully",
            "application_id": application_id,
            "analysis": json_result,
            "applicant": {
                "name": f"{firstName} {lastName}",
                "ssn": socialSecurityNumber
            }
        }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in benefit application endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# REQUEST: SSN to look up
# RESPONSE: Data from database
# FUNCTIONALITY: Read existing application data
@app.post("/api/read", response_model=ReadResponse)
async def mainRead():
    result = await read()
    
    return ReadResponse(data=result)

# REQUEST: Get all applications for admin dashboard
# RESPONSE: All applications from database
# FUNCTIONALITY: Read all applications for admin dashboard
@app.get("/api/applications")
async def getAllApplications():
    result = await read_all_applications()
    return ReadResponse(data=result)

# REQUEST: Application ID to look up
# RESPONSE: Application data from database
# FUNCTIONALITY: Read a single application by ID
@app.get("/api/application/{application_id}")
async def getApplicationById(application_id: str):
    result = await read_application_by_id(application_id)
    
    if not result.get("success"):
        raise HTTPException(status_code=404, detail=result.get("error", "Application not found"))
    
    return ReadResponse(data=result)


if __name__ == "__main__":
    # This runs the app when you do `python main.py`
    uvicorn.run(app, host="127.0.0.1", port=8000)