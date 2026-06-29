from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from graph import app_graph
import uvicorn
from langgraph.checkpoint.memory import MemorySaver

app = FastAPI(title="MarketPulse AI Engine", version="1.0.0")

memory = MemorySaver()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    query: str

@app.post("/api/v1/analyze")
async def trigger_analysis(payload: ResearchRequest):
    if not payload.query:
        raise HTTPException(status_code=400, detail="Query string cannot be empty")
        
    try:
        # Stateful Execution using local memory
        initial_state = {
            "task_query": payload.query,
            "research_data": "",
            "competitor_analysis": "",
            "chart_data": "[]",
            "final_report": "",
            "current_step": "started"
        }
        
        print(f"Triggering workflow for query: {payload.query}")
        
        # State saving with thread_id
        result = app_graph.invoke(
            initial_state,
            config={"configurable": {"thread_id": "session_default"},
                    "checkpointer": memory
                    } 
            
        )
        
        return {
    "success": True,
    "query": payload.query,
    "report": result.get("final_report", "No report generated"), 
    "metadata": {
        "research_summary": result.get("research_data", ""),
        "competitor_summary": result.get("competitor_analysis", ""),
        "chart_data": result.get("chart_data", "[]")
    },
    "triggered_by": "System User"
}
        
    except Exception as e:
        print(f"Error in execution loop: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Engine Error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)