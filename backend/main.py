# 10/25/2025
# main.py -- Main Program for Backend

# Import Separate Files
from api.ai.ai import ai
from api.read.read import read

# Import Modules
from fastapi import FastAPI, UploadFile, File, Form
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
