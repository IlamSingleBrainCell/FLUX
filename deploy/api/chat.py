from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

class handler(BaseHTTPRequestHandler):
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
            
            groq_api_key = os.environ.get("GROQ_API_KEY")
            
            # Agent definitions with Groq models
            agent_configs = {
                "messi": {
                    "name": "Messi ⚽",
                    "role": "Requirements Analyst",
                    "model": "llama-3.3-70b-versatile",
                    "system_prompt": "You are Messi ⚽, a Requirements Analyst with deep expertise in gathering and documenting project requirements. You create clear user stories, functional requirements, and help stakeholders articulate their needs. You're methodical, detail-oriented, and excellent at translating business needs into technical specifications. Provide comprehensive, well-structured requirements analysis."
                },
                "ronaldo": {
                    "name": "Ronaldo ⚽",
                    "role": "Software Architect",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Ronaldo ⚽, a Software Architect with expertise in system design, architecture patterns, and technical decision-making. You design scalable, maintainable systems, choose appropriate technologies, and create architectural diagrams. You're strategic, experienced, and focused on long-term technical vision. Provide detailed architecture guidance."
                },
                "neymar": {
                    "name": "Neymar ⚽",
                    "role": "Senior Developer",
                    "model": "llama-3.1-70b-versatile",
                    "system_prompt": "You are Neymar ⚽, a Senior Developer skilled in writing clean, efficient code across multiple languages and frameworks. You implement features, debug issues, optimize performance, and follow best practices. You're creative, solution-oriented, and passionate about code quality. Provide working code examples and detailed implementation guidance."
                },
                "mbappe": {
                    "name": "Mbappé ⚽",
                    "role": "QA Engineer",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Mbappé ⚽, a QA Engineer focused on software quality, testing strategies, and bug prevention. You create test plans, write test cases, perform various testing types, and ensure quality standards. You're thorough, analytical, and committed to delivering bug-free software. Provide comprehensive testing strategies."
                },
                "benzema": {
                    "name": "Benzema ⚽",
                    "role": "DevOps Engineer",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Benzema ⚽, a DevOps Engineer expert in CI/CD, infrastructure, deployment, and automation. You handle cloud platforms, containerization, monitoring, and delivery pipelines. You're practical, automation-focused, and ensure smooth deployments. Provide detailed DevOps solutions."
                },
                "modric": {
                    "name": "Modric ⚽",
                    "role": "Project Manager",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Modric ⚽, a Project Manager skilled in planning, coordination, and team leadership. You manage timelines, resources, risks, and ensure project success. You're organized, communicative, and focused on delivery. Provide project management guidance."
                },
                "ramos": {
                    "name": "Ramos ⚽",
                    "role": "Security Expert",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Ramos ⚽, a Security Expert focused on application security, threat modeling, and security best practices. You identify vulnerabilities, implement security measures, and ensure compliance. You're vigilant, knowledgeable, and prioritize security. Provide security-focused guidance."
                }
            }
            
            # Detect which agents should respond
            responding_agents = []
            message_lower = message.lower()
            
            # Check for specific agent mentions
            if "messi" in message_lower or "requirement" in message_lower:
                responding_agents.append("messi")
            if "ronaldo" in message_lower or "architect" in message_lower:
                responding_agents.append("ronaldo")
            if "neymar" in message_lower or "developer" in message_lower or "code" in message_lower:
                responding_agents.append("neymar")
            if "mbappe" in message_lower or "mbappé" in message_lower or "qa" in message_lower or "test" in message_lower:
                responding_agents.append("mbappe")
            if "benzema" in message_lower or "devops" in message_lower or "deploy" in message_lower:
                responding_agents.append("benzema")
            if "modric" in message_lower or "project manager" in message_lower or "planning" in message_lower:
                responding_agents.append("modric")
            if "ramos" in message_lower or "security" in message_lower:
                responding_agents.append("ramos")
            
            # Check for team/everyone calls
            if "team" in message_lower or "everyone" in message_lower or "all" in message_lower:
                responding_agents = ["messi", "ronaldo", "neymar", "mbappe", "benzema", "modric", "ramos"]
            
            # Default to Modric if no specific agent mentioned
            if not responding_agents:
                responding_agents = ["modric"]
            
            responses = []
            
            if groq_api_key:
                try:
                    from groq import Groq
                    client = Groq(api_key=groq_api_key)
                    
                    for agent_key in responding_agents:
                        agent_config = agent_configs.get(agent_key)
                        if not agent_config:
                            continue
                        
                        try:
                            chat_completion = client.chat.completions.create(
                                messages=[
                                    {"role": "system", "content": agent_config["system_prompt"]},
                                    {"role": "user", "content": message}
                                ],
                                model=agent_config["model"],
                                max_tokens=500,
                                temperature=0.7
                            )
                            
                            ai_response = chat_completion.choices[0].message.content
                            
                            responses.append({
                                "agent": agent_key,
                                "agent_name": f"{agent_config['name']} ({agent_config['role']})",
                                "message": ai_response,
                                "timestamp": datetime.utcnow().isoformat() + "Z"
                            })
                        except Exception as agent_error:
                            responses.append({
                                "agent": agent_key,
                                "agent_name": f"{agent_config['name']} ({agent_config['role']})",
                                "message": f"I encountered an error processing your request: {str(agent_error)}",
                                "timestamp": datetime.utcnow().isoformat() + "Z",
                                "error": str(agent_error)
                            })
                    
                    response_data = {
                        "responses": responses,
                        "groq_configured": True,
                        "agents_responded": len(responses)
                    }
                except ImportError:
                    response_data = {
                        "error": "Groq library not installed",
                        "responses": [{
                            "agent": "system",
                            "message": "Groq Python library is not installed in this environment. Please install it: pip install groq",
                            "timestamp": datetime.utcnow().isoformat() + "Z"
                        }],
                        "groq_configured": False
                    }
                except Exception as e:
                    response_data = {
                        "error": str(e),
                        "responses": [{
                            "agent": "system",
                            "message": f"Error connecting to Groq API: {str(e)}",
                            "timestamp": datetime.utcnow().isoformat() + "Z"
                        }],
                        "groq_configured": True
                    }
            else:
                response_data = {
                    "error": "GROQ_API_KEY not configured",
                    "responses": [{
                        "agent": "system",
                        "message": "GROQ_API_KEY environment variable is not set in Vercel. Please add it in your Vercel project settings.",
                        "timestamp": datetime.utcnow().isoformat() + "Z"
                    }],
                    "groq_configured": False
                }
            
            self.wfile.write(json.dumps(response_data, indent=2).encode())
            
        except Exception as e:
            error_response = {
                "error": str(e),
                "message": "Error processing POST request",
                "timestamp": datetime.utcnow().isoformat() + "Z"
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