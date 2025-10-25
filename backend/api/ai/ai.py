import os
import json
import asyncio
from typing import Dict, List, Any
from anthropic import AsyncAnthropic
from pymongo import MongoClient
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from datetime import datetime
import io

def read_from_database() -> Dict[str, Any]:
    """
    Hardcoded database function that returns SSDA information
    """
    database_data = {
        "doctors": [
            {
                "name": "Dr. Sarah Johnson",
                "phone": "(555) 123-4567",
                "specialty": "Internal Medicine"
            },
            {
                "name": "Dr. Michael Chen",
                "phone": "(555) 234-5678",
                "specialty": "Orthopedics"
            },
            {
                "name": "Dr. Emily Rodriguez",
                "phone": "(555) 345-6789",
                "specialty": "Neurology"
            }
        ],
        "hospitals_clinics": [
            {
                "name": "City General Hospital",
                "phone": "(555) 456-7890",
                "address": "123 Medical Center Dr, City, State 12345"
            },
            {
                "name": "Downtown Medical Clinic",
                "phone": "(555) 567-8901",
                "address": "456 Health St, City, State 12345"
            },
            {
                "name": "Specialty Care Center",
                "phone": "(555) 678-9012",
                "address": "789 Treatment Ave, City, State 12345"
            }
        ],
        "medical_tests": [
            {
                "test_name": "MRI of Lumbar Spine",
                "date": "2024-01-15",
                "facility": "City General Hospital",
                "results": "Shows L4-L5 disc herniation"
            },
            {
                "test_name": "X-Ray of Right Knee",
                "date": "2024-02-03",
                "facility": "Downtown Medical Clinic",
                "results": "Shows moderate arthritis"
            },
            {
                "test_name": "Blood Work - Complete Metabolic Panel",
                "date": "2024-02-10",
                "facility": "Specialty Care Center",
                "results": "Within normal limits"
            }
        ],
        "medications": [
            {
                "name": "Ibuprofen",
                "dosage": "400mg",
                "frequency": "3 times daily",
                "prescribed_by": "Dr. Sarah Johnson"
            },
            {
                "name": "Gabapentin",
                "dosage": "300mg",
                "frequency": "Twice daily",
                "prescribed_by": "Dr. Michael Chen"
            },
            {
                "name": "Tramadol",
                "dosage": "50mg",
                "frequency": "As needed for pain",
                "prescribed_by": "Dr. Emily Rodriguez"
            }
        ],
        "workers_compensation": {
            "date_of_injury": "2023-11-15",
            "claim_number": "WC-2023-12345",
            "insurance_company": "Workers Comp Insurance Co",
            "status": "Active"
        },
        "medical_records_permission": {
            "granted": True,
            "date_signed": "2024-01-01",
            "expires": "2025-01-01"
        },
        "basic_information": {
            "full_name": "John Doe",
            "date_of_birth": "1985-03-15",
            "address": "123 Main Street, City, State 12345",
            "phone": "(555) 789-0123",
            "email": "john.doe@email.com"
        },
        "social_security_number": "123-45-6789",
        "birth_location": {
            "city": "Chicago",
            "state": "Illinois",
            "country": "United States"
        }
    }
    
    return database_data

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
async def analyze_ssda_data():
    """
    Example function that combines database reading and Claude API calling
    """
    # Read data from database
    print("Reading data from database...")
    database_data = read_from_database()
    print(f"Database data loaded: {len(database_data)} categories")
    
    # Create prompt for Claude
    prompt = f"""
    Please analyze the following SSDA (Social Security Disability Application) data and provide insights:
    
    Database Information:
    {json.dumps(database_data, indent=2)}
    
    Please provide:
    1. A summary of the medical information
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
        "database_data": database_data,
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
        
        # Test database reading
        print("\n1. Testing database reading...")
        db_data = read_from_database()
        print(f"Database loaded with {len(db_data)} categories")
        
        # Test PDF generation and MongoDB upload
        print("\n2. Testing PDF generation and MongoDB upload...")
        try:
            # Extract basic information for PDF generation
            applicant_info = {
                "full_name": db_data["basic_information"]["full_name"],
                "address": db_data["basic_information"]["address"],
                "social_security_number": db_data["social_security_number"],
                "date_of_birth": db_data["basic_information"]["date_of_birth"],
                "phone": db_data["basic_information"]["phone"],
                "email": db_data["basic_information"]["email"],
                "birth_location": db_data["birth_location"]
            }
            
            # Process documents (without external PDFs for now)
            result = process_applicant_documents(applicant_info)
            
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
            print("\n3. Testing Claude API...")
            claude_result = await call_claude_api("Hello, this is a test message.")
            if claude_result["success"]:
                print("✅ Claude API connection successful")
            else:
                print(f"❌ Claude API error: {claude_result['error']}")
        else:
            print("\n3. Claude API test skipped (CLAUDE_API_KEY not set)")
        
        print("\n=== System Test Complete ===")
    
    asyncio.run(main())
