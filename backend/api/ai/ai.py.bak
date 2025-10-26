import os
import base64
import anthropic
from dotenv import load_dotenv
import re
import json
from datetime import datetime, timezone
import uuid
from bson import Binary
import sys
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from PyPDF2 import PdfMerger


# Add parent directory to path to import connectDB
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from connectDB import db

dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv(dotenv_path)


client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

# Combine PDFs
# form_data:
# firstName
# lastName
# dateOfBirth
# socialSecurityNumber
# streetAddress
# city
# state
# zipCode

async def merge_pdfs(form_data: dict, document_list: list):
    try:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a365d'),
            spaceAfter=30,
            alignment=1
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#2d3748'),
            spaceAfter=12,
            spaceBefore=20
        )
        
        # Title
        story.append(Paragraph("SSDI Application Summary", title_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Application ID and Date
        story.append(Paragraph(f"<b>Submission Date:</b> {datetime.now(timezone.utc).strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Spacer(1, 0.5*inch))
        
        # Personal Information Section
        story.append(Paragraph("Personal Information", heading_style))
        
        personal_data = [
            ["Full Name:", f"{form_data.get('firstName', '')} {form_data.get('lastName', '')}"],
            ["Date of Birth:", form_data.get('dateOfBirth', 'N/A')],
            ["Social Security Number:", form_data.get('socialSecurityNumber', 'N/A')],
        ]

        personal_table = Table(personal_data, colWidths=[2*inch, 4*inch])
        personal_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f7fafc')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        
        story.append(personal_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Address
                # Address Section
        story.append(Paragraph("Address", heading_style))
        
        address_data = [
            ["Street Address:", form_data.get('streetAddress', 'N/A')],
            ["City:", form_data.get('city', 'N/A')],
            ["State:", form_data.get('state', 'N/A')],
            ["ZIP Code:", form_data.get('zipCode', 'N/A')],
        ]
        
        address_table = Table(address_data, colWidths=[2*inch, 4*inch])
        address_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f7fafc')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        
        story.append(address_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Document Information
        story.append(Paragraph("Attached Documents", heading_style))
        story.append(Paragraph(f"• Total Documents: {len(document_list)}", styles['Normal']))

                # Build cover page PDF
        doc.build(story)
        buffer.seek(0)
        cover_page_bytes = buffer.getvalue()
        
        # Merge all PDFs
        merger = PdfMerger()
        
        # Add cover page
        merger.append(BytesIO(cover_page_bytes))
        
        # Add all documents from the list
        for doc_bytes in document_list:
            merger.append(BytesIO(doc_bytes))
        
        # Write to output buffer
        output_buffer = BytesIO()
        merger.write(output_buffer)
        merger.close()
        
        output_buffer.seek(0)
        return output_buffer.getvalue()
    except Exception as e:
        print(f"❌ Error merging PDFs: {e}")
        raise e

        
        

# --------------------------------------------------------
# Load prompt.md content
# --------------------------------------------------------
def load_prompt() -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), "../../prompt.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"⚠️ Could not load prompt.md: {e}")
        return "You are an AI that analyzes medical and income records for SSDI eligibility."

# --------------------------------------------------------
# Store documents in MongoDB GridFS or as Binary
# --------------------------------------------------------
async def store_documents_in_db(combinedDocument, combinedDocumentName):
    """
    Store PDF documents in MongoDB and return document references
    """
    
    try:
        document = ""
        print("MADE IT HERE")
        print(document)
        
        medical_doc = {
            "filename": combinedDocumentName,
            "content_type": "application/pdf",
            "data": Binary(combinedDocument),
            "uploaded_at": datetime.now(timezone.utc),
            "document_type": "medical_records"
        }
        combined_result = await db.documents.insert_one(medical_doc)
        documents = {
            "document_id": str(combined_result),
            "filename": combinedDocumentName,
            "document_type": "combined_document"
        }
        print("MADE IT HERE")
        print(document)
        return document
    
    except Exception as e:
        print(f"❌ Error storing documents: {e}")
        return ""

# --------------------------------------------------------
# Save application to MongoDB
# --------------------------------------------------------
async def save_application_to_db(json_result, document, raw_response):
    """
    Save the SSDI application analysis to MongoDB with required fields
    """
    try:
        # Generate unique application ID
        application_id = str(uuid.uuid4())
        
        # Prepare the document to insert
        application_doc = {
            "application_id": application_id,
            "documents": document,
            "claude_confidence_level": json_result.get("confidence_level", 0),
            "claude_summary": json_result.get("summary", ""),
            "final_decision": json_result.get("recommendation", "UNKNOWN"),
            
            # Additional useful fields from the analysis
            "personal_information": json_result.get("personal_information", {}),
            "assessment_type": json_result.get("assessment_type", ""),
            "assessment_date": json_result.get("assessment_date", ""),
            "phase_1_current_work": json_result.get("phase_1_current_work", {}),
            "phase_2_medical_severity": json_result.get("phase_2_medical_severity", {}),
            "phase_3_listings": json_result.get("phase_3_listings", {}),
            "phase_4_rfc": json_result.get("phase_4_rfc", {}),
            "phase_5_vocational": json_result.get("phase_5_vocational", {}),
            "overall_assessment": json_result.get("overall_assessment", {}),
            "next_steps": json_result.get("next_steps", {}),
            "evidence_summary": json_result.get("evidence_summary", {}),
            
            # Metadata
            "created_at": datetime.now(timezone.utc),
            "raw_claude_response": raw_response,
            "full_analysis": json_result
        }
        
        # Insert into MongoDB
        result = await db.applications.insert_one(application_doc)
        
        print(f"✅ Application saved to MongoDB with ID: {application_id}")
        print(f"   MongoDB _id: {result}")
        
        return application_id
        
    except Exception as e:
        print(f"❌ Error saving application to MongoDB: {e}")
        return None

# SAVE USER TO MONGO
# --------------------------------------------------------
# Create or update a user tied to an application
# --------------------------------------------------------
async def save_or_update_user(name: str, socialSecurityNumber: str, application_id: str):
    """
    Creates a new user if not found, otherwise appends the new application_id
    to their list of applications.
    """
    try:
        # Check if user already exists by SSN
        existing_user = await db.users.find_one({"socialSecurityNumber": socialSecurityNumber})

        if existing_user:
            # Append new application_id if not already in list
            await db.users.update_one(
                {"socialSecurityNumber": socialSecurityNumber},
                {"$addToSet": {"applications": application_id}}  # prevents duplicates
            )
            print(f"✅ Updated existing user: {existing_user['name']} ({socialSecurityNumber})")
            return {
                "success": True,
                "user_id": existing_user["user_id"],
                "updated": True
            }

        else:
            # Create a new user document
            user_doc = {
                "user_id": str(uuid.uuid4()),
                "name": name,
                "socialSecurityNumber": socialSecurityNumber,
                "applications": [application_id],
                "created_at": datetime.now(timezone.utc)
            }

            result = await db.users.insert_one(user_doc)
            print(f"✅ Created new user with ID: {user_doc['user_id']}")
            return {
                "success": True,
                "user_id": user_doc["user_id"],
                "inserted_id": str(result.inserted_id),
                "updated": False
            }

    except Exception as e:
        print(f"❌ Error saving or updating user: {e}")
        return {
            "success": False,
            "error": str(e)
        }



# --------------------------------------------------------
# MAIN AI FUNCTION
# --------------------------------------------------------
async def ai(form_data, medicalRecordsFile, incomeDocumentsFile):
    try:
        # Read file contents
        medical_bytes = await medicalRecordsFile.read()
        income_bytes = await incomeDocumentsFile.read()
        
        # Get filenames
        medical_filename = medicalRecordsFile.filename or "medical_records.pdf"
        income_filename = incomeDocumentsFile.filename or "income_documents.pdf"
        
        # Load prompt
        prompt = load_prompt()
        
        # Encode files to base64
        medical_base64 = base64.standard_b64encode(medical_bytes).decode("utf-8")
        income_base64 = base64.standard_b64encode(income_bytes).decode("utf-8")
        
        # Determine media types
        medical_media_type = medicalRecordsFile.content_type or "application/pdf"
        income_media_type = incomeDocumentsFile.content_type or "application/pdf"
        
        # Create streaming message
        response_text = ""
        
        with client.messages.stream(
            model="claude-sonnet-4-5-20250929",
            max_tokens=8000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "document",
                            "source": {
                                "type": "base64",
                                "media_type": medical_media_type,
                                "data": medical_base64
                            }
                        },
                        {
                            "type": "document",
                            "source": {
                                "type": "base64",
                                "media_type": income_media_type,
                                "data": income_base64
                            }
                        }
                    ]
                }
            ]
        ) as stream:
            for text in stream.text_stream:
                response_text += text
                print(text, end="", flush=True)  # Stream to console
        
        print("\n\n--- PROCESSING COMPLETE ---\n")
        
        # Extract JSON after streaming is complete
        json_match = re.search(r'<START_OUTPUT>(.*?)<END_OUTPUT>', response_text, re.DOTALL)

        if json_match:
            json_str = json_match.group(1).strip()
            
            json_str = re.sub(r'^```json\s*', '', json_str)
            json_str = re.sub(r'\s*```$', '', json_str)
        
            try:
                jsonResult = json.loads(json_str)
                print("✅ JSON parsed successfully")

                # Store documents in MongoDB
                print("\n📄 Storing documents in MongoDB...")
                
                combinedDoc = await merge_pdfs(
                    {"firstName":form_data["firstName"], 
                     "lastName":form_data["lastName"], 
                     "dateOfBirth":form_data["dateOfBirth"], 
                     "socialSecurityNumber":form_data["socialSecurityNumber"], 
                     "streetAddress":form_data["address"], 
                     "city":form_data["city"], 
                     "state":form_data["state"], 
                     "zipCode":form_data["zipCode"]},
                    [medical_bytes, income_bytes])
                
                document = await store_documents_in_db(
                    combinedDoc, "combined_document.pdf"
                )
                
                # Save application to MongoDB
                print("\n💾 Saving application to MongoDB...")
                application_id = await save_application_to_db(
                    jsonResult, 
                    document, 
                    response_text
                )
                
                if application_id:
                    await save_or_update_user(form_data["firstName"]+" "+form_data["lastName"], form_data["socialSecurityNumber"], application_id)
                
                return {
                    "success": True,
                    "application_id": application_id,
                    "result": jsonResult,
                    "document": document,
                    "raw_response": response_text
                }
                
            except json.JSONDecodeError as e:
                print(f"❌ JSON parsing error: {e}")
                return {
                    "success": False,
                    "error": f"Failed to parse JSON response: {str(e)}",
                    "raw_response": response_text
                }
        else:
            print("❌ Could not find <START_OUTPUT> and <END_OUTPUT> tags in response")
            return {
                "success": False,
                "error": "Output tags not found in response",
                "raw_response": response_text
            }
            
    except Exception as e:
        print(f"❌ Error in AI function: {e}")
        return {
            "success": False,
            "error": str(e)
        }