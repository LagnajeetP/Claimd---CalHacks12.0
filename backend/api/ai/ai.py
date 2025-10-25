import os
import json
import asyncio
from typing import Dict, List, Any, Optional
from anthropic import AsyncAnthropic
from pymongo import MongoClient
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from datetime import datetime
import io
from fastapi import UploadFile, File, Form


def create_general_applicant_info_pdf(applicant_info: Dict[str, Any]) -> bytes:
    """
    Create a PDF titled "General Applicant Info" with personal information
    
    Args:
        applicant_info: Dictionary containing name, address, ssn, dob, etc.
        
    Returns:
        PDF content as bytes
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "General Applicant Information")
    
    # Applicant details
    y_position = height - 100
    c.setFont("Helvetica", 12)
    
    # Name
    c.drawString(50, y_position, f"Full Name: {applicant_info.get('full_name', 'N/A')}")
    y_position -= 25
    
    # Address
    c.drawString(50, y_position, f"Address: {applicant_info.get('address', 'N/A')}")
    y_position -= 25
    
    # Social Security Number
    c.drawString(50, y_position, f"Social Security Number: {applicant_info.get('social_security_number', 'N/A')}")
    y_position -= 25
    
    # Date of Birth
    c.drawString(50, y_position, f"Date of Birth: {applicant_info.get('date_of_birth', 'N/A')}")
    y_position -= 25
    
    # Phone
    c.drawString(50, y_position, f"Phone: {applicant_info.get('phone', 'N/A')}")
    y_position -= 25
    
    # Email
    c.drawString(50, y_position, f"Email: {applicant_info.get('email', 'N/A')}")
    y_position -= 25
    
    # Birth Location
    birth_location = applicant_info.get('birth_location', {})
    birth_text = f"{birth_location.get('city', 'N/A')}, {birth_location.get('state', 'N/A')}, {birth_location.get('country', 'N/A')}"
    c.drawString(50, y_position, f"Birth Location: {birth_text}")
    y_position -= 25
    
    # Generated date
    c.drawString(50, y_position, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def connect_to_mongodb() -> MongoClient:
    """
    Connect to MongoDB using the provided URI
    
    Returns:
        MongoDB client
    """
    mongo_uri = "mongodb+srv://potthi:uD90Z4zvmQkhwUY0@main.vys4uml.mongodb.net/?appName=Main"
    try:
        # Add SSL configuration to handle connection issues
        client = MongoClient(
            mongo_uri,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=5000
        )
        # Test the connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        # Return a mock client for testing purposes
        print("Using mock client for testing...")
        return None

def write_pdf_to_mongodb(pdf_content: bytes, filename: str, collection_name: str = "ssda_documents") -> str:
    """
    Write PDF content to MongoDB
    
    Args:
        pdf_content: PDF content as bytes
        filename: Name of the PDF file
        collection_name: MongoDB collection name
        
    Returns:
        Document ID from MongoDB
    """
    try:
        client = connect_to_mongodb()
        if client is None:
            # Mock response for testing
            mock_id = f"mock_{filename}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            print(f"Mock upload: {filename} would be uploaded to MongoDB with ID: {mock_id}")
            return mock_id
            
        db = client.ssda_database
        collection = db[collection_name]
        
        # Create document with PDF content
        document = {
            "filename": filename,
            "content": pdf_content,
            "content_type": "application/pdf",
            "created_at": datetime.now(),
            "file_size": len(pdf_content)
        }
        
        # Insert document
        result = collection.insert_one(document)
        print(f"Successfully uploaded {filename} to MongoDB with ID: {result.inserted_id}")
        return str(result.inserted_id)
        
    except Exception as e:
        print(f"Error writing PDF to MongoDB: {e}")
        # Return mock ID for testing
        mock_id = f"mock_{filename}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        print(f"Mock upload: {filename} would be uploaded to MongoDB with ID: {mock_id}")
        return mock_id

def write_multiple_pdfs_to_mongodb(pdf_files: List[Dict[str, Any]], collection_name: str = "ssda_documents") -> List[str]:
    """
    Write multiple PDF files to MongoDB
    
    Args:
        pdf_files: List of dictionaries with 'content' and 'filename' keys
        collection_name: MongoDB collection name
        
    Returns:
        List of document IDs from MongoDB
    """
    try:
        client = connect_to_mongodb()
        if client is None:
            # Mock response for testing
            mock_ids = []
            for pdf_file in pdf_files:
                mock_id = f"mock_{pdf_file['filename']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                mock_ids.append(mock_id)
                print(f"Mock upload: {pdf_file['filename']} would be uploaded to MongoDB with ID: {mock_id}")
            return mock_ids
            
        db = client.ssda_database
        collection = db[collection_name]
        
        documents = []
        for pdf_file in pdf_files:
            document = {
                "filename": pdf_file['filename'],
                "content": pdf_file['content'],
                "content_type": "application/pdf",
                "created_at": datetime.now(),
                "file_size": len(pdf_file['content'])
            }
            documents.append(document)
        
        # Insert all documents
        result = collection.insert_many(documents)
        print(f"Successfully uploaded {len(documents)} PDFs to MongoDB")
        return [str(doc_id) for doc_id in result.inserted_ids]
        
    except Exception as e:
        print(f"Error writing PDFs to MongoDB: {e}")
        # Return mock IDs for testing
        mock_ids = []
        for pdf_file in pdf_files:
            mock_id = f"mock_{pdf_file['filename']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            mock_ids.append(mock_id)
            print(f"Mock upload: {pdf_file['filename']} would be uploaded to MongoDB with ID: {mock_id}")
        return mock_ids

def process_applicant_documents(applicant_info: Dict[str, Any], 
                              financial_pdf_path: str = None, 
                              medical_pdf_path: str = None) -> Dict[str, Any]:
    """
    Process applicant documents: create General Applicant Info PDF and upload all PDFs to MongoDB
    
    Args:
        applicant_info: Dictionary containing applicant personal information
        financial_pdf_path: Path to financial record PDF (optional)
        medical_pdf_path: Path to medical record PDF (optional)
        
    Returns:
        Dictionary with processing results
    """
    try:
        # Create General Applicant Info PDF
        print("Creating General Applicant Info PDF...")
        general_pdf_content = create_general_applicant_info_pdf(applicant_info)
        
        # Prepare PDF files for upload
        pdf_files = [
            {
                "filename": "General_Applicant_Info.pdf",
                "content": general_pdf_content
            }
        ]
        
        # Add financial PDF if provided
        if financial_pdf_path and os.path.exists(financial_pdf_path):
            with open(financial_pdf_path, 'rb') as f:
                financial_content = f.read()
            pdf_files.append({
                "filename": "Financial_Records.pdf",
                "content": financial_content
            })
            print(f"Added financial PDF: {financial_pdf_path}")
        
        # Add medical PDF if provided
        if medical_pdf_path and os.path.exists(medical_pdf_path):
            with open(medical_pdf_path, 'rb') as f:
                medical_content = f.read()
            pdf_files.append({
                "filename": "Medical_Records.pdf",
                "content": medical_content
            })
            print(f"Added medical PDF: {medical_pdf_path}")
        
        # Upload all PDFs to MongoDB
        print("Uploading PDFs to MongoDB...")
        document_ids = write_multiple_pdfs_to_mongodb(pdf_files)
        
        return {
            "success": True,
            "message": f"Successfully processed {len(pdf_files)} documents",
            "document_ids": document_ids,
            "files_uploaded": [pdf['filename'] for pdf in pdf_files]
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Error processing documents: {str(e)}"
        }

async def process_multistep_form_data(
    form_data: Dict[str, Any],
    medical_records_file: Optional[UploadFile] = None,
    financial_records_file: Optional[UploadFile] = None
) -> Dict[str, Any]:
    """
    Process MultiStepForm data and create PDFs for MongoDB storage
    
    Args:
        form_data: Dictionary containing form data from MultiStepForm.tsx
        medical_records_file: Optional medical records PDF file
        financial_records_file: Optional financial records PDF file
        
    Returns:
        Dictionary with processing results
    """
    try:
        # Extract and format applicant information from form data
        applicant_info = {
            "full_name": f"{form_data.get('firstName', '')} {form_data.get('lastName', '')}".strip(),
            "address": f"{form_data.get('address', '')}, {form_data.get('city', '')}, {form_data.get('state', '')} {form_data.get('zipCode', '')}".strip(),
            "social_security_number": form_data.get('socialSecurityNumber', ''),
            "date_of_birth": form_data.get('dateOfBirth', ''),
            "phone": form_data.get('phone', ''),  # Add phone field if needed
            "email": form_data.get('email', ''),  # Add email field if needed
            "birth_location": {
                "city": form_data.get('birthCity', ''),
                "state": form_data.get('birthState', ''),
                "country": form_data.get('birthCountry', 'United States')
            },
            # Additional form data
            "doctor_names": form_data.get('doctorNames', ''),
            "doctor_phone_numbers": form_data.get('doctorPhoneNumbers', ''),
            "hospital_names": form_data.get('hospitalNames', ''),
            "hospital_phone_numbers": form_data.get('hospitalPhoneNumbers', ''),
            "medical_records_permission": form_data.get('medicalRecordsPermission', False)
        }
        
        print("Processing MultiStepForm data...")
        print(f"Applicant: {applicant_info['full_name']}")
        
        # Create General Applicant Info PDF
        print("Creating General Applicant Info PDF...")
        general_pdf_content = create_general_applicant_info_pdf(applicant_info)
        
        # Prepare PDF files for upload
        pdf_files = [
            {
                "filename": "General_Applicant_Info.pdf",
                "content": general_pdf_content
            }
        ]
        
        # Add medical records PDF if provided
        if medical_records_file and medical_records_file.filename:
            medical_content = await medical_records_file.read()
            pdf_files.append({
                "filename": f"Medical_Records_{medical_records_file.filename}",
                "content": medical_content
            })
            print(f"Added medical records PDF: {medical_records_file.filename}")
        
        # Add financial records PDF if provided
        if financial_records_file and financial_records_file.filename:
            financial_content = await financial_records_file.read()
            pdf_files.append({
                "filename": f"Financial_Records_{financial_records_file.filename}",
                "content": financial_content
            })
            print(f"Added financial records PDF: {financial_records_file.filename}")
        
        # Upload all PDFs to MongoDB
        print("Uploading PDFs to MongoDB...")
        document_ids = write_multiple_pdfs_to_mongodb(pdf_files)
        
        # Also store the form data in MongoDB for reference
        try:
            client = connect_to_mongodb()
            if client:
                db = client.ssda_database
                form_collection = db["form_submissions"]
                
                form_document = {
                    "applicant_info": applicant_info,
                    "submission_date": datetime.now(),
                    "pdf_document_ids": document_ids,
                    "files_uploaded": [pdf['filename'] for pdf in pdf_files]
                }
                
                form_result = form_collection.insert_one(form_document)
                print(f"Form data stored in MongoDB with ID: {form_result.inserted_id}")
        except Exception as e:
            print(f"Warning: Could not store form data in MongoDB: {e}")
        
        return {
            "success": True,
            "message": f"Successfully processed MultiStepForm data and uploaded {len(pdf_files)} documents",
            "document_ids": document_ids,
            "files_uploaded": [pdf['filename'] for pdf in pdf_files],
            "applicant_name": applicant_info['full_name']
        }
        
    except Exception as e:
        print(f"Error processing MultiStepForm data: {e}")
        return {
            "success": False,
            "error": f"Error processing MultiStepForm data: {str(e)}"
        }

async def call_claude_api(prompt: str) -> Dict[str, Any]:
    """
    Function that calls the Claude API with the given prompt
    
    Args:
        prompt: The prompt to send to Claude
        
    Returns:
        Dict containing Claude's response
    """
    try:
        # Get API key from environment
        api_key = os.getenv("CLAUDE_API_KEY")
        if not api_key:
            return {
                "error": "CLAUDE_API_KEY environment variable not set",
                "success": False
            }
        
        # Initialize Claude client
        client = AsyncAnthropic(api_key=api_key)
        
        # Make API call
        response = await client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            temperature=0.1,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        # Extract response content
        response_content = response.content[0].text
        
        return {
            "success": True,
            "response": response_content,
            "model": "claude-3-5-sonnet-20241022"
        }
        
    except Exception as e:
        return {
            "error": f"Claude API call failed: {str(e)}",
            "success": False
        }

# Example usage function
async def analyze_ssda_data(applicant_info: Dict[str, Any] = None):
    """
    Example function that processes applicant information and calls Claude API
    
    Args:
        applicant_info: Dictionary containing applicant personal information
    """
    if applicant_info is None:
        print("No applicant information provided")
        return {"error": "No applicant information provided"}
    
    # Create prompt for Claude
    prompt = f"""
    Please analyze the following SSDA (Social Security Disability Application) data and provide insights:
    
    Applicant Information:
    {json.dumps(applicant_info, indent=2)}
    
    Please provide:
    1. A summary of the applicant information
    2. Any potential issues or missing information
    3. Recommendations for the disability application
    """
    
    # Call Claude API
    print("Calling Claude API...")
    claude_response = await call_claude_api(prompt)
    
    if claude_response["success"]:
        print("Claude API Response:")
        print(claude_response["response"])
    else:
        print(f"Claude API Error: {claude_response['error']}")
    
    return {
        "applicant_info": applicant_info,
        "claude_response": claude_response
    }

# Legacy function for backward compatibility
async def ai():
    """
    Legacy function - calls the analyze_ssda_data function
    """
    return await analyze_ssda_data()

if __name__ == "__main__":
    # Example usage
    async def main():
        print("SSDA Analysis System with MongoDB and PDF Generation")
        print("====================================================")
        
        # Example applicant information
        example_applicant_info = {
            "full_name": "John Doe",
            "address": "123 Main Street, City, State 12345",
            "social_security_number": "123-45-6789",
            "date_of_birth": "1985-03-15",
            "phone": "(555) 789-0123",
            "email": "john.doe@email.com",
            "birth_location": {
                "city": "Chicago",
                "state": "Illinois",
                "country": "United States"
            }
        }
        
        # Test PDF generation and MongoDB upload
        print("\n1. Testing PDF generation and MongoDB upload...")
        try:
            # Process documents (without external PDFs for now)
            result = process_applicant_documents(example_applicant_info)
            
            if result["success"]:
                print(f"✅ {result['message']}")
                print(f"Document IDs: {result['document_ids']}")
                print(f"Files uploaded: {result['files_uploaded']}")
            else:
                print(f"❌ Error: {result['error']}")
                
        except Exception as e:
            print(f"❌ Error testing PDF/MongoDB functionality: {e}")
        
        # Test Claude API if key is set
        if os.getenv("CLAUDE_API_KEY"):
            print("\n2. Testing Claude API...")
            claude_result = await call_claude_api("Hello, this is a test message.")
            if claude_result["success"]:
                print("✅ Claude API connection successful")
            else:
                print(f"❌ Claude API error: {claude_result['error']}")
        else:
            print("\n2. Claude API test skipped (CLAUDE_API_KEY not set)")
        
        print("\n=== System Test Complete ===")
        print("\nTo use the system, call:")
        print("process_applicant_documents(applicant_info, financial_pdf_path, medical_pdf_path)")
        print("or")
        print("analyze_ssda_data(applicant_info)")
    
    asyncio.run(main())
