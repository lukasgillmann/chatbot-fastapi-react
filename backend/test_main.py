import asyncio
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Set the event loop policy to use SelectorEventLoop on Windows
@pytest.fixture(scope="session", autouse=True)
def set_event_loop_policy():
    if asyncio.get_event_loop_policy().__class__.__name__ == 'WindowsProactorEventLoopPolicy':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

@pytest.mark.asyncio
async def test_send_message_hello():
    response = client.post("/send-message/", json={"from_user": "user", "text": "hello"})
    assert response.status_code == 200
    assert response.json() == {"response": "Hello! How can I help you today?"}

@pytest.mark.asyncio
async def test_send_message_unknown():
    response = client.post("/send-message/", json={"from_user": "user", "text": "something unknown"})
    assert response.status_code == 200
    assert response.json() == {"response": "I don't understand that yet, but I'm learning!"}

@pytest.mark.asyncio
async def test_invalid_message_format():
    response = client.post("/send-message/", json={"from_user": "user"})
    assert response.status_code == 422  # Unprocessable Entity for invalid data
