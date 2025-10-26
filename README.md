# CalHacks Project

A full-stack application with FastAPI backend and React frontend.

## Requirements

- Python 3.x
- Node.js (for frontend)
- pip
- npm

## Project Structure

```
calhacksy1/
├── backend/
│   ├── api/
│   │   ├── ai/
│   │   ├── read/
│   │   └── write/
│   ├── main.py
│   ├── requirements.txt
│   └── venv/
└── frontend/
    ├── src/
    ├── package.json
    └── node_modules/
```

## Getting Started

Follow these steps to set up and run the application:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd calhacksy1
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables (Backend)

Create a `.env` file in the `backend` directory:

```bash
cd ../backend
echo "CLAUDE_API_KEY=your_claude_api_key_here" > .env
```

### 5. Running the Application

**You need TWO terminals to run both backend and frontend:**

#### Terminal 1 - Backend Server
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```
Backend will be available at: `http://127.0.0.1:8000`

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will be available at: `http://localhost:5173`

### 6. Access the Application

- **Frontend**: Open `http://localhost:5173` in your browser
- **Backend API**: Available at `http://127.0.0.1:8000`
- **API Documentation**: Visit `http://127.0.0.1:8000/docs` for interactive API docs

### Stopping the Servers

- Press `Ctrl+C` in each terminal to stop the respective servers
- Make sure to stop both backend and frontend servers when done

## Admin Authentication Setup

### Environment Variable Configuration

Create a `.env.local` file in the **frontend** directory:

```bash
cd frontend
echo "VITE_ADMIN_SSN=123-00-4572" > .env.local
```

### How Admin Authentication Works

1. **Admin Login**: Use SSN `123-00-4572` with any name
2. **Automatic Redirect**: Admin users are redirected to `/admin` dashboard
3. **Fallback**: If env var not set, defaults to `123-00-4572` for development
4. **Security**: Admin SSN not visible in source code

### Testing Admin Access

1. Go to user dashboard sign-in (`http://localhost:5173/user`)
2. Enter any name and SSN `123-00-4572`
3. Should automatically redirect to admin dashboard
4. Regular users with other SSNs go to user dashboard as normal

### Production Setup

For production, set the environment variable:
```bash
VITE_ADMIN_SSN=your-secure-admin-ssn
```

### Important Notes

- **File location**: `.env.local` goes in the `frontend/` directory
- **Variable name**: Must start with `VITE_` to be accessible in the browser
- **Restart required**: Restart your dev server after creating the file
- **Git ignore**: `.env.local` should be in `.gitignore` (don't commit secrets)
