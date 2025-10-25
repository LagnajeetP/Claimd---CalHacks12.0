import os
import json
import asyncio
from typing import Dict, List, Any
from anthropic import AsyncAnthropic

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
        print("SSDA Analysis System")
        print("===================")
        
        # Check if API key is set
        if not os.getenv("CLAUDE_API_KEY"):
            print("ERROR: CLAUDE_API_KEY environment variable not set")
            print("Please set your Claude API key: export CLAUDE_API_KEY='your-key-here'")
            return
        
        # Run analysis
        result = await analyze_ssda_data()
        print("\nAnalysis complete!")
    
    asyncio.run(main())
