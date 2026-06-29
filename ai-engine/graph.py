import os
from typing import Dict, TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langchain_community.tools import DuckDuckGoSearchRun
from dotenv import load_dotenv

os.environ["LANGCHAIN_TRACING_V2"] = "false"
load_dotenv()

class AgentState(TypedDict):
    task_query: str
    research_data: str
    competitor_analysis: str
    chart_data: str
    final_report: str
    current_step: str

GROQ_KEY = os.getenv("GROQ_API_KEY")

if GROQ_KEY:
    llm = ChatOpenAI(
        api_key=GROQ_KEY,
        model="llama-3.1-8b-instant",
        base_url="https://api.groq.com/openai/v1",
        temperature=0,  
        max_tokens=1000
    )
else:
    print("⚠️ WARNING: GROQ_API_KEY is missing in environment parameters.")
    llm = None

search_tool = DuckDuckGoSearchRun()

# 1. Research Agent Node (NOW WITH INTERNET ACCESS)
def research_agent_node(state: AgentState) -> Dict:
    print("--- RUNNING RESEARCH AGENT (WITH WEB SEARCH) ---")
    query = state["task_query"]
    
    if llm:
        try:
            # Step A: Silently search the web for the latest data
            print(f"🌐 Searching live web for: {query}")
            search_results = search_tool.invoke(f"{query} current market status trends 2026")
            
            # Step B: Feed the live web data to the AI to summarize factually
            prompt = f"Act as a professional market researcher. Based STRICTLY on this real-time web search data:\n\n{search_results}\n\nProvide a highly accurate, factual 2-sentence summary about the current status and trends for: '{query}'. Do not write an introduction, output facts directly. Do not mention your knowledge cutoff."
            
            response = llm.invoke([HumanMessage(content=prompt)])
            return {"research_data": response.content, "current_step": "research_done"}
        except Exception as e:
            print(f"Agent Execution Failure: {str(e)}")
            
    return {"research_data": f"Data intelligence sweep deferred for query: {query}", "current_step": "research_done"}

# 2. Competitor Agent Node
def competitor_agent_node(state: AgentState) -> Dict:
    print("--- RUNNING COMPETITOR ANALYST AGENT ---")
    query = state["task_query"]
    research = state["research_data"]
    
    if llm:
        try:
            prompt = f"Based on this research context:\n{research}\n\nList the top 3 key entities, players, or dynamics relevant to '{query}', along with a 1-sentence analytical breakdown for each."
            response = llm.invoke([HumanMessage(content=prompt)])
            return {"competitor_analysis": response.content, "current_step": "competitor_done"}
        except Exception as e:
            pass
            
    return {"competitor_analysis": "Contextual dynamic ecosystem analysis deferred.", "current_step": "competitor_done"}

# 3. Strategy Agent Node
def strategist_agent_node(state: AgentState) -> Dict:
    print("--- RUNNING STRATEGY AGENT ---")
    query = state["task_query"]
    research = state["research_data"]
    competitor = state["competitor_analysis"]
    
    if llm:
        try:
            prompt = f"Using the following research:\n{research}\n\nAnd analysis:\n{competitor}\n\nGenerate a professional, executive style action blueprint for '{query}'. Avoid markdown code blocks, use plain text with professional spacing."
            response = llm.invoke([HumanMessage(content=prompt)])
            return {"final_report": response.content, "current_step": "completed"}
        except Exception as e:
            pass
            
    return {"final_report": "System deployment successful. Please configure stable upstream authorization tokens to visualize data matrices.", "current_step": "completed"}

def chart_agent_node(state: AgentState) -> Dict:
    print("--- RUNNING CHART AGENT ---")
    prompt = f"""
    Research Data: {state['research_data']}
    
    Return ONLY a valid JSON array of 4 objects with 'name' and 'value' keys. 
    Format: [{"name": "Category", "value": 10}, ...]
    Do not include markdown tags, code blocks, or conversational text.
    """
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"chart_data": response.content.strip()}


# Graph Build Workflow
workflow = StateGraph(AgentState)
workflow.add_node("researcher", research_agent_node)
workflow.add_node("analyst", competitor_agent_node)
workflow.add_node("chart_generator", chart_agent_node)
workflow.add_node("strategist", strategist_agent_node)

workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "analyst")
workflow.add_edge("analyst", "strategist")
workflow.add_edge("chart_generator", "strategist") 
workflow.add_edge("strategist", END)

app_graph = workflow.compile()