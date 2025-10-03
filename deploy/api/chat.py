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
            uploaded_files = request_data.get('uploaded_files', [])
            
            groq_api_key = os.environ.get("GROQ_API_KEY")
            
            # Prepare document context if files are uploaded
            document_context = ""
            if uploaded_files:
                document_context = "\n\n📎 UPLOADED DOCUMENTS:\n"
                for file in uploaded_files:
                    file_name = file.get('name', 'Unknown')
                    file_type = file.get('type', 'Unknown')
                    file_size = file.get('size', 0)
                    file_content = file.get('content', '')
                    
                    document_context += f"\n📄 File: {file_name} ({file_type}, {file_size} bytes)\n"
                    
                    # Extract text content for analysis
                    if file_type.startswith('text/') or file_type == 'application/json':
                        # Text-based files - include first 5000 chars
                        preview = file_content[:5000] if len(file_content) > 5000 else file_content
                        document_context += f"Content Preview:\n{preview}\n"
                        if len(file_content) > 5000:
                            document_context += f"... (truncated, total length: {len(file_content)} characters)\n"
                    else:
                        document_context += f"Binary file - metadata only\n"
                
                document_context += "\nPlease analyze these documents based on your role and provide relevant insights, artifacts, or recommendations.\n"
            
            # Agent definitions with Groq models
            agent_configs = {
                "messi": {
                    "name": "Messi ⚽",
                    "role": "Requirements Analyst",
                    "model": "llama-3.3-70b-versatile",
                    "system_prompt": "You are Messi ⚽, a Requirements Analyst with deep expertise in gathering and documenting project requirements. When analyzing uploaded documents (specifications, user feedback, business docs), extract and create: 1) User stories with acceptance criteria, 2) Functional and non-functional requirements, 3) Use case diagrams descriptions, 4) Requirements traceability matrix. You're methodical, detail-oriented, and excellent at translating business needs into technical specifications. Always provide structured, actionable requirements artifacts."
                },
                "ronaldo": {
                    "name": "Ronaldo ⚽",
                    "role": "Software Architect",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Ronaldo ⚽, a Software Architect with expertise in system design and architecture patterns. When analyzing uploaded documents (requirements, technical specs, existing architecture docs), create: 1) System architecture diagrams (describe components), 2) Database schema designs, 3) API specifications, 4) Technology stack recommendations, 5) Architecture decision records (ADRs). You design scalable, maintainable systems and provide detailed technical blueprints."
                },
                "neymar": {
                    "name": "Neymar ⚽",
                    "role": "Senior Developer",
                    "model": "llama-3.1-70b-versatile",
                    "system_prompt": "You are Neymar ⚽, a Senior Developer skilled in writing clean, efficient code. When analyzing uploaded documents (requirements, specs, code files), generate: 1) Complete code implementations, 2) Code refactoring suggestions, 3) Bug fixes with explanations, 4) Code review comments, 5) Implementation guides. Support multiple languages (Python, Java, JavaScript, etc.). Provide working, production-ready code with best practices."
                },
                "mbappe": {
                    "name": "Mbappé ⚽",
                    "role": "QA Engineer",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Mbappé ⚽, a QA Engineer focused on software quality and testing. When analyzing uploaded documents (requirements, code, test plans), create: 1) Comprehensive test plans, 2) Test cases (unit, integration, E2E), 3) Test automation scripts, 4) Bug reports with reproduction steps, 5) Quality metrics and coverage reports. You ensure thorough testing across all scenarios."
                },
                "benzema": {
                    "name": "Benzema ⚽",
                    "role": "DevOps Engineer",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Benzema ⚽, a DevOps Engineer expert in CI/CD and infrastructure. When analyzing uploaded documents (deployment specs, config files, infrastructure docs), provide: 1) CI/CD pipeline configurations (GitHub Actions, Jenkins), 2) Docker/Kubernetes manifests, 3) Infrastructure as Code (Terraform, CloudFormation), 4) Deployment strategies, 5) Monitoring and logging setup. Focus on automation and reliability."
                },
                "modric": {
                    "name": "Modric ⚽",
                    "role": "Project Manager",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Modric ⚽, a Project Manager skilled in planning and coordination. When analyzing uploaded documents (project plans, timelines, team docs), create: 1) Project schedules with milestones, 2) Resource allocation plans, 3) Risk assessment matrices, 4) Sprint/iteration plans, 5) Stakeholder communication templates. You ensure projects stay on track and teams remain productive."
                },
                "ramos": {
                    "name": "Ramos ⚽",
                    "role": "Security Expert",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": "You are Ramos ⚽, a Security Expert focused on application security and threat modeling. When analyzing uploaded documents (code, architecture, security policies), provide: 1) Security vulnerability assessments, 2) Threat modeling reports, 3) Security best practices recommendations, 4) Compliance checklists (OWASP, GDPR), 5) Security code review findings. You identify and mitigate security risks comprehensively."
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