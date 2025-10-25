# 10/25/2025
# main.py -- Main Program for Backend

# Import Separate Files
from api.ai.ai import ai, process_multistep_form_data
from api.read.read import read

# Import Modules
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REQUEST: 
# RESPONSE: 
# FUNCTIONALITY: 
@app.post("/read")
async def mainAI():
    await ai()

# REQUEST: 
# RESPONSE: 
# FUNCTIONALITY: 
@app.post("/write")
async def mainRead():
    await read()

# REQUEST: 
# RESPONSE: 
# FUNCTIONALITY: 
@app.post("/ai")
async def mainAI():
    return await ai()

# REQUEST: MultiStepForm data with file uploads
# RESPONSE: Processing results with document IDs
# FUNCTIONALITY: Process form data, create PDFs, and store in MongoDB
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
    doctorNames: str = Form(""),
    doctorPhoneNumbers: str = Form(""),
    hospitalNames: str = Form(""),
    hospitalPhoneNumbers: str = Form(""),
    medicalRecordsPermission: bool = Form(False),
    medicalRecordsFile: UploadFile = File(None),
    incomeDocumentsFile: UploadFile = File(None)
):
    try:
        # Prepare form data dictionary
        form_data = {
            "firstName": firstName,
            "lastName": lastName,
            "dateOfBirth": dateOfBirth,
            "address": address,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "socialSecurityNumber": socialSecurityNumber,
            "doctorNames": doctorNames,
            "doctorPhoneNumbers": doctorPhoneNumbers,
            "hospitalNames": hospitalNames,
            "hospitalPhoneNumbers": hospitalPhoneNumbers,
            "medicalRecordsPermission": medicalRecordsPermission
        }
        
        # Process the form data and files
        result = await process_multistep_form_data(
            form_data=form_data,
            medical_records_file=medicalRecordsFile,
            financial_records_file=incomeDocumentsFile
        )
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "document_ids": result["document_ids"],
                "files_uploaded": result["files_uploaded"],
                "applicant_name": result["applicant_name"]
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        print(f"Error in benefit application endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    # This runs the app when you do `python main.py`
    uvicorn.run(app, host="127.0.0.1", port=8000)
