# 10/25/2025
# main.py -- Main Program for Backend

# Import Separate Files
from api.ai.ai import ai
from api.read.read import read

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

# REQUEST: 
# RESPONSE: 
# FUNCTIONALITY: 
@app.post("/write", response_model=WriteResponse)
async def mainAI(medicalRecordsFile: UploadFile = File(...),
    incomeDocumentsFile: UploadFile = File(...),
    firstName: str = Form(...),
    lastName: str = Form(...),
    address: str = Form(...),
    dateOfBirth: str = Form(...),
    socialSecurityNumber: str = Form(...)
):
        # Read uploaded files as bytes
    medical_pdf_bytes = await medicalRecordsFile.read()
    income_pdf_bytes = await incomeDocumentsFile.read()

    # Call your AI function with all inputs
    result = await ai(
        medical_pdf_bytes=medical_pdf_bytes,
        income_pdf_bytes=income_pdf_bytes,
        first_name=firstName,
        last_name=lastName,
        address=address,
        date_of_birth=dateOfBirth,
        social_security_number=socialSecurityNumber
    )

    return WriteResponse(**result)

<<<<<<<<< Temporary merge branch 1

=========
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
        
        result = await ai(
            form_data,
            medicalRecordsFile,
            incomeDocumentsFile
        )
        if not result:
            return
        
        if result["success"]:
            return {
                "success": True,}
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        print(f"Error in benefit application endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# REQUEST: 
# RESPONSE: 
# FUNCTIONALITY: 
@app.post("/read", response_model=ReadResponse)
async def mainRead(request: ReadRequest):
    result = await read(request.ssn)
    
    return ReadResponse(data=result)


if __name__ == "__main__":
    # This runs the app when you do `python main.py`
  uvicorn.run(app, host="127.0.0.1", port=8000)