"""
CrewAI WebSocket Handler - Integrates CrewAI with existing WebSocket system
This replaces simple_websocket_handler.py while maintaining API compatibility
"""
import asyncio
import json
from typing import Dict, Any, Optional
from fastapi import WebSocket
from datetime import datetime

from agents.crewai_agents import get_crewai_system


class CrewAIWebSocketHandler:
    """
    Enhanced WebSocket handler powered by CrewAI
    Maintains compatibility with existing frontend while adding real agent orchestration
    """
    
    def __init__(self):
        print("[WS-CrewAI] 🚀 Initializing CrewAI WebSocket Handler")
        self.active_connections: Dict[str, WebSocket] = {}
        self.crewai = get_crewai_system()
        print("[WS-CrewAI] ✅ Handler ready with CrewAI backend")
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Accept WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        print(f"[WS-CrewAI] ✅ Client {client_id} connected ({len(self.active_connections)} active)")
        
        # Send welcome message
        await self.send_system_message(
            client_id,
            "🚀 Connected to FLUX CrewAI System - Real autonomous agents ready!"
        )
    
    async def disconnect(self, client_id: str):
        """Remove WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            print(f"[WS-CrewAI] 👋 Client {client_id} disconnected ({len(self.active_connections)} active)")
    
    async def send_system_message(self, client_id: str, message: str):
        """Send system message to client"""
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_json({
                "type": "system",
                "message": message,
                "timestamp": datetime.now().isoformat()
            })
    
    async def send_agent_response(
        self, 
        client_id: str, 
        agent_key: str, 
        response: str,
        agent_name: str = None
    ):
        """Send agent response to client"""
        if client_id in self.active_connections:
            # Map agent keys to display names
            agent_names = {
                "messi": "Messi",
                "ronaldo": "Ronaldo",
                "neymar": "Neymar",
                "mbappe": "Mbappé",
                "benzema": "Benzema",
                "modric": "Modric",
                "ramos": "Ramos"
            }
            
            await self.active_connections[client_id].send_json({
                "type": "agent_response",
                "agent": agent_key,
                "agent_name": agent_name or agent_names.get(agent_key, agent_key),
                "message": response,
                "timestamp": datetime.now().isoformat()
            })
    
    async def send_typing_indicator(
        self, 
        client_id: str, 
        agent_key: str, 
        is_typing: bool
    ):
        """Send typing indicator"""
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_json({
                "type": "typing",
                "agent": agent_key,
                "typing": is_typing,
                "timestamp": datetime.now().isoformat()
            })
    
    def detect_direct_call(self, message: str) -> Optional[str]:
        """
        Detect if message is a direct call to specific agent
        
        Returns:
            Agent key if direct call detected, None otherwise
        """
        message_lower = message.lower().strip()
        
        # Check for direct greetings
        import re
        patterns = [
            r'\b(hi|hello|hey|greetings)\s+(messi|ronaldo|neymar|mbappe|mbappé|benzema|modric|ramos)\b',
            r'\b(messi|ronaldo|neymar|mbappe|mbappé|benzema|modric|ramos)[,:\s]',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, message_lower)
            if match:
                name = match.group(2) if match.lastindex >= 2 else match.group(1)
                name = name.replace('é', 'e')  # Normalize
                
                if name in ["messi", "ronaldo", "neymar", "mbappe", "benzema", "modric", "ramos"]:
                    return name
        
        return None
    
    def detect_team_call(self, message: str) -> bool:
        """Check if message is calling the whole team"""
        message_lower = message.lower().strip()
        team_keywords = ['everyone', 'everybody', 'team', 'all agents', 'all of you', 'entire team']
        
        return any(keyword in message_lower for keyword in team_keywords)
    
    async def process_message(
        self, 
        client_id: str, 
        message: str,
        uploaded_files: list = None
    ) -> Dict[str, str]:
        """
        Process user message with CrewAI intelligence
        
        This is the main entry point that replaces simple routing
        
        Args:
            client_id: WebSocket client identifier
            message: User's message
            uploaded_files: Optional list of uploaded file data
        
        Returns:
            Dict of agent_key -> response
        """
        print(f"\n{'='*80}")
        print(f"[WS-CrewAI] 📨 Processing message from {client_id}")
        print(f"[WS-CrewAI] 💬 Message: '{message[:100]}...'")
        print(f"{'='*80}\n")
        
        context = {
            "uploaded_files": uploaded_files or [],
            "client_id": client_id
        }
        
        try:
            # Step 1: Check for direct agent call
            direct_agent = self.detect_direct_call(message)
            
            if direct_agent:
                print(f"[WS-CrewAI] 🎯 DIRECT CALL to {direct_agent}")
                
                # Send typing indicator
                await self.send_typing_indicator(client_id, direct_agent, True)
                
                # Execute single agent with CrewAI
                response = await self.crewai.execute_single_agent(
                    direct_agent, 
                    message, 
                    context
                )
                
                # Send response
                await self.send_typing_indicator(client_id, direct_agent, False)
                await self.send_agent_response(client_id, direct_agent, response)
                
                return {direct_agent: response}
            
            # Step 2: Check for team call
            if self.detect_team_call(message):
                print(f"[WS-CrewAI] 👥 TEAM COLLABORATION MODE")
                
                # All agents
                all_agents = ["messi", "ronaldo", "neymar", "mbappe", "benzema"]
                
                # Send typing indicators
                for agent in all_agents:
                    await self.send_typing_indicator(client_id, agent, True)
                
                # Execute team collaboration with CrewAI orchestration
                responses = await self.crewai.execute_team_collaboration(
                    message,
                    all_agents,
                    context
                )
                
                # Send responses
                for agent in all_agents:
                    await self.send_typing_indicator(client_id, agent, False)
                    if agent in responses:
                        await self.send_agent_response(client_id, agent, responses[agent])
                
                return responses
            
            # Step 3: Smart routing - Let CrewAI decide
            print(f"[WS-CrewAI] 🧠 SMART ROUTING with CrewAI")
            
            # Send typing indicator for Modric (he'll analyze)
            await self.send_typing_indicator(client_id, "modric", True)
            
            # CrewAI intelligently routes the request
            responses = await self.crewai.smart_route(message, context)
            
            await self.send_typing_indicator(client_id, "modric", False)
            
            # Send all agent responses
            for agent_key, response in responses.items():
                if agent_key != "error":
                    await self.send_agent_response(client_id, agent_key, response)
            
            return responses
            
        except Exception as e:
            error_msg = f"Error processing message: {str(e)}"
            print(f"[WS-CrewAI] ❌ {error_msg}")
            
            await self.send_system_message(client_id, f"❌ {error_msg}")
            return {"error": error_msg}
    
    async def broadcast(self, message: Dict[str, Any], exclude: str = None):
        """Broadcast message to all connected clients except excluded"""
        disconnected = []
        
        for client_id, websocket in self.active_connections.items():
            if client_id != exclude:
                try:
                    await websocket.send_json(message)
                except Exception as e:
                    print(f"[WS-CrewAI] ❌ Error broadcasting to {client_id}: {e}")
                    disconnected.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected:
            await self.disconnect(client_id)


# Singleton instance
_handler_instance = None

def get_crewai_handler() -> CrewAIWebSocketHandler:
    """Get or create the CrewAI WebSocket handler singleton"""
    global _handler_instance
    if _handler_instance is None:
        _handler_instance = CrewAIWebSocketHandler()
    return _handler_instance
