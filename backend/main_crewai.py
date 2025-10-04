"""
FLUX Main Server with CrewAI Integration
This is the new main entry point with real autonomous agents
"""
import os
import sys
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import Optional, List
import json
from datetime import datetime
import base64

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.crewai_websocket_handler import get_crewai_handler
from agents.crewai_agents import get_crewai_system

# Initialize FastAPI
app = FastAPI(
    title="FLUX - CrewAI Enhanced Multi-Agent System",
    description="Real autonomous agents powered by CrewAI",
    version="4.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize systems
crewai_handler = get_crewai_handler()
crewai_system = get_crewai_system()

print("\n" + "="*80)
print("🚀 FLUX CrewAI System Starting...")
print("="*80)
print("✅ CrewAI agents initialized")
print("✅ WebSocket handler ready")
print("✅ All systems operational")
print("="*80 + "\n")


# ============================================================================
# WEBSOCKET ENDPOINT - Main communication channel
# ============================================================================

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time agent communication
    Enhanced with CrewAI autonomous orchestration
    """
    await crewai_handler.connect(websocket, client_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            message_type = message_data.get("type", "message")
            
            if message_type == "message":
                # User message
                user_message = message_data.get("message", "")
                uploaded_files = message_data.get("uploadedFiles", [])
                
                print(f"\n[MAIN] 📨 Received from {client_id}: {user_message[:100]}")
                
                # Process with CrewAI
                await crewai_handler.process_message(
                    client_id,
                    user_message,
                    uploaded_files
                )
                
            elif message_type == "ping":
                # Heartbeat
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                })
    
    except WebSocketDisconnect:
        await crewai_handler.disconnect(client_id)
        print(f"[MAIN] 👋 Client {client_id} disconnected")
    
    except Exception as e:
        print(f"[MAIN] ❌ WebSocket error for {client_id}: {e}")
        await crewai_handler.disconnect(client_id)


# ============================================================================
# REST API ENDPOINTS - For compatibility
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "operational",
        "system": "FLUX CrewAI",
        "version": "4.0.0",
        "agents": ["messi", "ronaldo", "neymar", "mbappe", "benzema", "modric", "ramos"],
        "features": [
            "Real autonomous agents",
            "CrewAI orchestration",
            "Intelligent task delegation",
            "Tool-equipped agents",
            "Hierarchical collaboration"
        ]
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_connections": len(crewai_handler.active_connections),
        "agents_loaded": len(crewai_system.agents),
        "crewai_version": "0.70.1"
    }


@app.get("/api/agents")
async def get_agents():
    """Get list of available agents"""
    agents_info = {
        "messi": {
            "name": "Messi",
            "role": "Requirements Analyst",
            "avatar": "⚽",
            "capabilities": ["Requirements gathering", "User story creation", "Task estimation"],
            "tools": ["estimate_tasks"]
        },
        "ronaldo": {
            "name": "Ronaldo",
            "role": "Software Architect",
            "avatar": "⚽",
            "capabilities": ["System design", "Architecture patterns", "Tech stack selection"],
            "tools": ["create_file_structure"]
        },
        "neymar": {
            "name": "Neymar",
            "role": "Senior Developer",
            "avatar": "⚽",
            "capabilities": ["Code implementation", "Algorithm design", "Code review"],
            "tools": ["analyze_code"]
        },
        "mbappe": {
            "name": "Mbappé",
            "role": "QA Engineer",
            "avatar": "🧪",
            "capabilities": ["Test planning", "Quality assurance", "Bug detection"],
            "tools": ["analyze_code"]
        },
        "benzema": {
            "name": "Benzema",
            "role": "DevOps Engineer",
            "avatar": "🚀",
            "capabilities": ["CI/CD", "Infrastructure", "Deployment"],
            "tools": ["create_file_structure"]
        },
        "modric": {
            "name": "Modric",
            "role": "Project Manager",
            "avatar": "📊",
            "capabilities": ["Project planning", "Team coordination", "Timeline management"],
            "tools": ["estimate_tasks"]
        },
        "ramos": {
            "name": "Ramos",
            "role": "Security Expert",
            "avatar": "🛡️",
            "capabilities": ["Security analysis", "Vulnerability assessment", "Compliance"],
            "tools": ["analyze_code"]
        }
    }
    
    return {
        "agents": agents_info,
        "total": len(agents_info),
        "framework": "CrewAI",
        "autonomous": True
    }


@app.post("/api/chat")
async def chat_endpoint(
    message: str = Form(...),
    agent: Optional[str] = Form(None)
):
    """
    REST API chat endpoint for testing
    """
    try:
        if agent and agent in crewai_system.agents:
            # Direct agent call
            response = await crewai_system.execute_single_agent(agent, message)
            return {
                "agent": agent,
                "response": response,
                "timestamp": datetime.now().isoformat()
            }
        else:
            # Smart routing
            responses = await crewai_system.smart_route(message)
            return {
                "responses": responses,
                "timestamp": datetime.now().isoformat()
            }
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


# ============================================================================
# STARTUP & SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("\n" + "🚀"*40)
    print("FLUX CrewAI System Online!")
    print("🚀"*40 + "\n")
    print("📡 WebSocket: ws://localhost:8000/ws/{client_id}")
    print("🌐 API Docs: http://localhost:8000/docs")
    print("💚 Health: http://localhost:8000/health")
    print("\n" + "✨"*40)
    print("Ready for autonomous agent collaboration!")
    print("✨"*40 + "\n")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("\n👋 FLUX CrewAI System shutting down...")


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "main_crewai:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
