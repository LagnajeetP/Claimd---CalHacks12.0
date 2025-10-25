from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/benefit-application")
async def submit_benefit_application(
    # Personal Information
    firstName: str = Form(...),
    lastName: str = Form(...),
    dateOfBirth: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    zipCode: str = Form(...),
    socialSecurityNumber: str = Form(...),
    
    # Medical Information
    doctorNames: str = Form(...),
    hospitalNames: str = Form(...),
    medicalRecordsPermission: bool = Form(...),
    medicalRecordsFile: Optional[UploadFile] = File(None),
    
    # Financial Information
    incomeDocumentsFile: Optional[UploadFile] = File(None)
):
    """
    Submit a Social Security benefit application.
    This endpoint receives all form data including file uploads.
    """
    try:
        # Process the form data
        application_data = {
            "personal_info": {
                "first_name": firstName,
                "last_name": lastName,
                "date_of_birth": dateOfBirth,
                "address": address,
                "city": city,
                "state": state,
                "zip_code": zipCode,
                "social_security_number": socialSecurityNumber
            },
            "medical_info": {
                "doctor_names": doctorNames,
                "hospital_names": hospitalNames,
                "medical_records_permission": medicalRecordsPermission,
                "medical_records_file_name": medicalRecordsFile.filename if medicalRecordsFile else None
            },
            "financial_info": {
                "income_documents_file_name": incomeDocumentsFile.filename if incomeDocumentsFile else None
            }
        }
        
        # Save uploaded files (if any)
        if medicalRecordsFile:
            # Save medical records file
            with open(f"uploads/medical_records_{firstName}_{lastName}.pdf", "wb") as buffer:
                content = await medicalRecordsFile.read()
                buffer.write(content)
        
        if incomeDocumentsFile:
            # Save income documents file
            with open(f"uploads/income_docs_{firstName}_{lastName}.pdf", "wb") as buffer:
                content = await incomeDocumentsFile.read()
                buffer.write(content)
        
        # Here you would typically:
        # 1. Save to database
        # 2. Process with AI
        # 3. Send to SSA systems
        # 4. Send confirmation email
        
        print(f"Application submitted for {firstName} {lastName}")
        print(f"Application data: {json.dumps(application_data, indent=2)}")
        
        return {
            "success": True,
            "message": "Application submitted successfully",
            "application_id": f"APP_{firstName}_{lastName}_{dateOfBirth.replace('-', '')}",
            "estimated_processing_time": "1-2 days"
        }
        
    except Exception as e:
        print(f"Error processing application: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process application")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "BenefitFlow API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
