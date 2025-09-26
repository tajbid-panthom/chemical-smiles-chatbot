from fastapi import FastAPI
from pydantic import BaseModel
from llm_service import run_llm
app = FastAPI()

class Prompt(BaseModel):
    text: str
    
@app.get("/api/hello")
def read_root():
    return {"message": "Hello from Python!"}

@app.post("/api/llm")
def generate(prompt: Prompt):
    response = run_llm(prompt.text)
    return {"response": response}