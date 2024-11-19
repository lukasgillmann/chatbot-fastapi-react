from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL, change if necessary
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define the model for the request body
class Message(BaseModel):
    from_user: str
    text: str

@app.post("/send-message/")
async def send_message(message: Message) -> Dict[str, str]:
    # Simulate bot response
    if "hello" in message.text.lower():
        bot_response = "Hello! How can I help you today?"
    elif message.text.lower() == "create report this month":
        bot_response = "I’ll work on the report and send it your way this month."
    elif message.text.lower() == "call lead":
        bot_response = "I'm scheduling a call with the lead right now."
    else:
        bot_response = "I don't understand that yet, but I'm learning!"
    
    # Return bot response
    return {"response": bot_response}

