from fastapi import FastAPI,HTTPException
from api.main import BreachProtocolSolver
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
solver = BreachProtocolSolver()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}



class Target(BaseModel):
    sequence: List[str]
    points: int

class BreachProtocolInput(BaseModel):
    matrix: List[List[str]]
    targets: List[Target]
    buffer: int
    rowCount: int
    colCount: int

@app.post("/api/breach_protocol_solve")
def solve(data: BreachProtocolInput):
    try:
        result = solver.breach_protocol_solve(data.matrix, data.targets, data.buffer, data.rowCount, data.colCount)
        return {"result": result["results"], "runtime": result["runtime"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))