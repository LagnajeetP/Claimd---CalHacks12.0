#!/usr/bin/env python3
"""
Test script to test the document upload functionality
"""
import requests
import json
import os

def test_benefit_application_upload():
    """Test the /api/benefit-application endpoint"""
    
    # Test data
    form_data = {
        'firstName': 'John',
        'lastName': 'Doe',
        'dateOfBirth': '1985-03-15',
        'address': '123 Main Street',
        'city': 'Springfield',
        'state': 'IL',
        'zipCode': '62701',
        'socialSecurityNumber': '123-45-6789',
        'doctorNames': 'Dr. Smith, Dr. Johnson',
        'doctorPhoneNumbers': '(555) 123-4567, (555) 234-5678',
        'hospitalNames': 'City Hospital, Medical Center',
        'hospitalPhoneNumbers': '(555) 987-6543, (555) 876-5432',
        'medicalRecordsPermission': 'true'
    }
    
    # Create test PDF files
    test_medical_pdf = create_test_pdf("Medical Records Test")
    test_financial_pdf = create_test_pdf("Financial Records Test")
    
    # Prepare files for upload
    files = {
        'medicalRecordsFile': ('medical_test.pdf', test_medical_pdf, 'application/pdf'),
        'incomeDocumentsFile': ('financial_test.pdf', test_financial_pdf, 'application/pdf')
    }
    
    print("Testing benefit application upload...")
    print(f"Form data: {json.dumps(form_data, indent=2)}")
    
    try:
        # Make the request
        response = requests.post(
            'http://localhost:8000/api/benefit-application',
            data=form_data,
            files=files,
            timeout=30
        )
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✅ SUCCESS!")
            print(f"Response: {json.dumps(result, indent=2)}")
        else:
            print(f"\n❌ ERROR!")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ REQUEST ERROR: {e}")
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}")

def create_test_pdf(content):
    """Create a simple test PDF content"""
    # This is a minimal PDF structure for testing
    pdf_content = f"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
({content}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF"""
    return pdf_content.encode('utf-8')

if __name__ == "__main__":
    test_benefit_application_upload()
