# api/ai/ai.py

import os
import base64
import anthropic
from dotenv import load_dotenv
import re
import json

dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv(dotenv_path)

print("MADE IT HERE")
print(os.getenv("CLAUDE_API_KEY"))
client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

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
# MAIN AI FUNCTION
# --------------------------------------------------------
async def ai(form_data, medicalRecordsFile, incomeDocumentsFile):
    # Read file contents
    medical_bytes = await medicalRecordsFile.read()
    income_bytes = await incomeDocumentsFile.read()
    
    # Load prompt
    prompt = load_prompt()
    
    # Encode files to base64
    medical_base64 = base64.standard_b64encode(medical_bytes).decode("utf-8")
    income_base64 = base64.standard_b64encode(income_bytes).decode("utf-8")
    
    # Determine media types
    medical_media_type = medicalRecordsFile.content_type or "application/pdf"
    income_media_type = incomeDocumentsFile.content_type or "application/pdf"
    
    # Create message - prompt is the ONLY text, files are just attached
    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=8000,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt  # Your prompt.md is the ONLY text
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
    )
    
    # Handle response - filter out thinking blocks
    response_text = ""
    for block in message.content:
        if block.type == "text":
            response_text += block.text
    
    print(response_text)
    
    json_match = re.search(r'<START_OUTPUT>(.*?)<END_OUTPUT>', response_text, re.DOTALL)
    json_result = ""

    if json_match:
        json_str = json_match.group(1).strip()
        
        json_str = re.sub(r'^```json\s*', '', json_str)
        json_str = re.sub(r'\s*```$', '', json_str)
    
        try:
            jsonResult = json.loads(json_str)
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {e}")
            print(f"Raw JSON string: {json_str[:500]}...")  # Print first 500 chars for debugging
            return {
                "error": "Failed to parse JSON response",
                "raw_response": response_text
            }
    else:
        print("❌ Could not find <START_OUTPUT> and <END_OUTPUT> tags in response")
        return {
            "error": "Output tags not found in response",
            "raw_response": response_text
        }

    print(json_result)
    
    