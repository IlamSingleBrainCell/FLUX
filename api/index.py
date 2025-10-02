# FLUX Multi-Agent System API - Vercel Deployment
from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.parse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL path
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Enable CORS
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Get GROQ API key
        groq_api_key = os.environ.get("GROQ_API_KEY")
        groq_client = None
        
        # Try to initialize Groq client
        if groq_api_key:
            try:
                from groq import Groq
                groq_client = Groq(api_key=groq_api_key)
            except ImportError:
                groq_client = None
            except Exception as e:
                groq_client = None
        
        # Response data
        response_data = {
            "message": "FLUX Multi-Agent System API",
            "status": "running",
            "path": path,
            "method": "GET",
            "groq_configured": groq_api_key is not None,
            "groq_client_ready": groq_client is not None,
            "groq_key_length": len(groq_api_key) if groq_api_key else 0,
            "debug": {
                "email_used": "ilamvazhuthi.pro@gmail.com",
                "environment": os.environ.get("VERCEL_ENV", "unknown"),
                "vercel": os.environ.get("VERCEL", "false")
            }
        }
        
        # Handle different endpoints
        if path.endswith('/health'):
            response_data.update({
                "endpoint": "health",
                "timestamp": "2025-10-01T00:00:00Z",
                "healthy": True
            })
        elif path.endswith('/agents'):
            response_data.update({
                "endpoint": "agents",
                "agents": {
                    "messi": {"name": "Messi ⚽ (Requirements Analyst)", "status": "online"},
                    "ronaldo": {"name": "Ronaldo ⚽ (Software Architect)", "status": "online"},
                    "neymar": {"name": "Neymar ⚽ (Developer)", "status": "online"},
                    "mbappe": {"name": "Mbappé ⚽ (QA Tester)", "status": "online"},
                    "benzema": {"name": "Benzema ⚽ (DevOps Engineer)", "status": "online"}
                }
            })
        else:
            response_data.update({
                "endpoint": "root",
                "available_endpoints": ["/api/", "/api/health", "/api/agents", "/api/chat"]
            })
        
        # Send response
        self.wfile.write(json.dumps(response_data, indent=2).encode())
        
    def do_POST(self):
        # Handle POST requests (for chat)
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        try:
            request_data = json.loads(post_data.decode())
            message = request_data.get('message', '')
            
            # Multi-agent chat system
            groq_api_key = os.environ.get("GROQ_API_KEY")
            
            # Agent definitions - Football Team ⚽
            agents = {
                "requirements_analyst": "You are Messi ⚽, a Requirements Analyst. Analyze project needs and document requirements clearly.",
                "software_architect": "You are Ronaldo ⚽, a Software Architect. Design system architecture and provide technical guidance.",
                "developer": "You are Neymar ⚽, a Senior Developer. Write code, solve technical problems, and implement features.",
                "qa_tester": "You are Mbappé ⚽, a QA Engineer. Test software, find bugs, and ensure quality standards.",
                "devops_engineer": "You are Benzema ⚽, a DevOps Engineer. Handle deployment, infrastructure, and automation."
            }
            
            # Detect which agent to respond as based on message
            responding_agent = "requirements_analyst"  # default
            agent_name = "Messi ⚽"
            
            message_lower = message.lower()
            if "ronaldo" in message_lower or "architect" in message_lower:
                responding_agent = "software_architect"
                agent_name = "Ronaldo ⚽"
            elif "neymar" in message_lower or "developer" in message_lower:
                responding_agent = "developer" 
                agent_name = "Neymar ⚽"
            elif "mbappe" in message_lower or "mbappé" in message_lower or "qa" in message_lower or "test" in message_lower:
                responding_agent = "qa_tester"
                agent_name = "Mbappé ⚽"
            elif "benzema" in message_lower or "devops" in message_lower or "deploy" in message_lower:
                responding_agent = "devops_engineer"
                agent_name = "Benzema ⚽"
            elif "messi" in message_lower or "requirement" in message_lower:
                responding_agent = "requirements_analyst"
                agent_name = "Messi ⚽"
            
            if groq_api_key and message:
                try:
                    from groq import Groq
                    client = Groq(api_key=groq_api_key)
                    
                    system_prompt = agents[responding_agent]
                    
                    chat_completion = client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": message}
                        ],
                        model="llama3-8b-8192",
                        max_tokens=200
                    )
                    
                    ai_response = chat_completion.choices[0].message.content
                    
                    response_data = {
                        "responses": [{
                            "agent": responding_agent,
                            "message": f"Hi! I'm {agent_name}. {ai_response}",
                            "timestamp": "2025-10-03T00:00:00Z"
                        }],
                        "groq_configured": True
                    }
                except Exception as e:
                    response_data = {
                        "responses": [{
                            "agent": responding_agent, 
                            "message": f"Hello! I'm {agent_name}. I received your message: '{message}'. GROQ API integration encountered an error: {str(e)}",
                            "timestamp": "2025-10-03T00:00:00Z"
                        }],
                        "groq_configured": True,
                        "error": str(e)
                    }
            else:
                response_data = {
                    "responses": [{
                        "agent": responding_agent,
                        "message": f"Hello! I'm {agent_name}. I received your message: '{message}'. GROQ API key is not configured in Vercel environment.",
                        "timestamp": "2025-10-03T00:00:00Z"
                    }],
                    "groq_configured": False
                }
            
            self.wfile.write(json.dumps(response_data, indent=2).encode())
            
        except Exception as e:
            error_response = {
                "error": str(e),
                "message": "Error processing POST request"
            }
            self.wfile.write(json.dumps(error_response, indent=2).encode())
            
    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(b'')