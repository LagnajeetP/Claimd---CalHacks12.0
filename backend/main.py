# 10/25/2025
# main.py -- Main Program for Backend

# Import Separate Files
from api.ai import ai
from api.read import read
from api.write import write

# Import Modules
from fastapi import FastAPI
import uvicorn

app = FastAPI()

# REQUEST: 
# RESPONSE: 
# FUNCTIONALITY: 
@app.post("/read")
async def mainAI():
    await ai()

# REQUEST: 
# RESPONSE: 
# FUNCTIONALITY: 
@app.post("/write")
async def mainRead():
    await read()

# REQUEST: 
# RESPONSE: 
# FUNCTIONALITY: 
@app.post("/ai")
async def mainWrite():
    await write()




if __name__ == "__main__":
    # This runs the app when you do `python main.py`
    uvicorn.run(app, host="127.0.0.1", port=8000)
