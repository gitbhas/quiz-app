from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
import uuid
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the JSON file where quiz results will be stored
RESULTS_FILE = "quiz_results.json"

# Create the results file if it doesn't exist
if not os.path.exists(RESULTS_FILE):
    with open(RESULTS_FILE, "w") as f:
        json.dump([], f)

# Models
class QuizResult(BaseModel):
    score: int
    totalQuestions: int
    userId: str
    answers: dict

class QuizResultResponse(BaseModel):
    id: str
    score: int
    totalQuestions: int
    userId: str
    answers: dict
    timestamp: str

# Helper functions
def read_results():
    with open(RESULTS_FILE, "r") as f:
        return json.load(f)

def write_results(results):
    with open(RESULTS_FILE, "w") as f:
        json.dump(results, f, indent=2)

# Routes
@app.post("/api/quiz/save", response_model=dict)
async def save_quiz_result(result: QuizResult):
    try:
        results = read_results()
        
        # Create a new result with ID and timestamp
        new_result = {
            "id": str(uuid.uuid4()),
            "score": result.score,
            "totalQuestions": result.totalQuestions,
            "userId": result.userId,
            "answers": result.answers,
            "timestamp": datetime.now().isoformat()
        }
        
        results.append(new_result)
        write_results(results)
        
        return {"success": True, "id": new_result["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save quiz result: {str(e)}")

@app.get("/api/quiz/results", response_model=List[QuizResultResponse])
async def get_quiz_results(userId: Optional[str] = None):
    try:
        results = read_results()
        
        # Filter results by userId if provided
        if userId:
            results = [r for r in results if r.get("userId") == userId]
            
        # Sort by timestamp (newest first)
        results.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quiz results: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)