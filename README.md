# OUR PROJECT NAME

## Running the app

Follow these steps to set up and run the app:

1. **Create a Python virtual environment** (recommended):

   ```bash
   # 1. Clone the repository (if you have not already):

   ```bash
   git clone <repository-url>
   ```

   # 2. Navigate to the backend directory:

   ```bash
   cd backend

   # 3. Create a virtual environment
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment**:

   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:

   - Create a file named `.env` inside the `backend` directory.
   - Add your Claude API key to this file:
     ```
     CLAUDE_API_KEY=your_claude_api_key_here
     ```

5. **Run the app**:

   ```bash
   python main.py
   ```

# Requirements
- Python 3.x
- pip