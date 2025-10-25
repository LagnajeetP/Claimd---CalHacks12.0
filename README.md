# OUR PROJECT NAME

## Requirements

- Python 3.x
- pip

## Project Structure

The backend contains the main application code, organized as follows:

```
backend/
├── api/
│   ├── ai/
│   ├── read/
│   └── write/
├── main.py
├── requirements.txt
└── .env
```

## Getting Started

Follow these steps to set up and run the app:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Set Up a Python Virtual Environment (Recommended)

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python -m venv venv
```

### 3. Activate the Virtual Environment

- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```

### 4. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

- Inside the `backend` directory, create a file named `.env`.
- Add your Claude API key:
  ```
  CLAUDE_API_KEY=your_claude_api_key_here
  ```

### 6. Run the Application

```bash
python main.py
```
