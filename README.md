readme_content = """# MarketPulse-ai

**MarketPulse-ai** is an enterprise-grade, agentic research platform designed to provide automated market analysis and competitive intelligence.

---

## Tech Stack

The project follows a clean microservices-based monorepo architecture:

* **/ai-engine**: Python-based FastAPI service running intelligent LangGraph agents.
* **/apps-backend**: Node.js core service handling database operations, authentication, and API gateway routing.
* **/apps-frontend**: React.js/Vite dashboard for visualization and user interaction.

---

## 🚀 Getting Started

### 1. Environment Setup

You need to configure `.env` files in each service folder:

* **/ai-engine/.env**: Add `GROQ_API_KEY` .

---

### 2. Run the Services

#### A. AI Engine (Python)
```bash
cd ai-engine
python -m venv venv
# On Windows, use: venv\\Scripts\\activate
# On macOS/Linux, use: source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
#### B. Backend (Node.js)
```bash
cd apps-backend
npm install
node gateway.js
```
C. Frontend (React)
```Bash
cd apps-frontend
npm install
npm run dev
```




