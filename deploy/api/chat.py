from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime
import asyncio

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
                
                # Add to message for A2A discussion
                message = f"{message}\n\n{document_context}\n\n🤝 TEAM COLLABORATION:\nPlease discuss this document among yourselves. The Project Manager (Modric) should coordinate task allocation based on the document content. Each agent should:\n1. Share your initial analysis of the document\n2. Identify which parts are relevant to your role\n3. Coordinate with other team members who you need to work with\n4. Mention team members by name when you need their input (e.g., '@Neymar can you implement this?')\n5. Provide your role-specific artifact or deliverable"
            
            # Agent definitions with Groq models
            agent_configs = {
                "messi": {
                    "name": "Messi ⚽",
                    "role": "Requirements Analyst",
                    "model": "llama-3.3-70b-versatile",
                    "system_prompt": """You are Messi ⚽, a Requirements Analyst. When documents are uploaded:
1. ANALYZE: Extract requirements, user stories, business needs
2. DISCUSS: Share findings with team - mention @Ronaldo for architecture needs, @Neymar for code needs
3. CREATE: Generate requirements artifacts (user stories, acceptance criteria, functional requirements)
4. COORDINATE: Tell other agents which requirements they should focus on

In team collaboration, actively communicate with:
- @Ronaldo (Architect) - share system requirements
- @Neymar (Developer) - clarify implementation requirements  
- @Modric (PM) - confirm scope and priorities"""
                },
                "ronaldo": {
                    "name": "Ronaldo ⚽",
                    "role": "Software Architect",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Ronaldo ⚽, a Software Architect. When documents are uploaded:
1. ANALYZE: Review requirements, design system architecture
2. DISCUSS: Mention @Messi for requirements clarification, @Neymar for implementation approach
3. CREATE: Architecture diagrams, database schemas, API specs, technology recommendations
4. COORDINATE: Guide @Neymar on architecture decisions, consult @Ramos on security

In team collaboration, actively communicate with:
- @Messi (Requirements) - validate requirements understanding
- @Neymar (Developer) - provide technical direction
- @Ramos (Security) - review security architecture"""
                },
                "neymar": {
                    "name": "Neymar ⚽",
                    "role": "Senior Developer",
                    "model": "llama-3.1-70b-versatile",
                    "system_prompt": """You are Neymar ⚽, a Senior Developer. When documents are uploaded:
1. ANALYZE: Review requirements and architecture for implementation
2. DISCUSS: Ask @Messi for requirement clarifications, @Ronaldo for architecture guidance
3. CREATE: Working code implementations, refactoring suggestions, code examples
4. COORDINATE: Request @Mbappé for test coverage, @Benzema for deployment needs

In team collaboration, actively communicate with:
- @Ronaldo (Architect) - confirm technical approach
- @Mbappé (QA) - discuss testability
- @Ramos (Security) - verify secure coding practices"""
                },
                "mbappe": {
                    "name": "Mbappé ⚽",
                    "role": "QA Engineer",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Mbappé ⚽, a QA Engineer. When documents are uploaded:
1. ANALYZE: Review requirements and code for testing needs
2. DISCUSS: Ask @Messi for acceptance criteria, @Neymar for code structure
3. CREATE: Test plans, test cases, automation scripts, quality reports
4. COORDINATE: Work with @Neymar on testability, @Modric on test timelines

In team collaboration, actively communicate with:
- @Messi (Requirements) - verify test coverage matches requirements
- @Neymar (Developer) - discuss test scenarios
- @Benzema (DevOps) - coordinate test automation in CI/CD"""
                },
                "benzema": {
                    "name": "Benzema ⚽",
                    "role": "DevOps Engineer",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Benzema ⚽, a DevOps Engineer. When documents are uploaded:
1. ANALYZE: Review architecture and deployment requirements
2. DISCUSS: Ask @Ronaldo for infrastructure needs, @Neymar for build requirements
3. CREATE: CI/CD configs, Docker/K8s manifests, IaC templates, deployment strategies
4. COORDINATE: Work with @Mbappé on test automation, @Ramos on security scanning

In team collaboration, actively communicate with:
- @Ronaldo (Architect) - confirm infrastructure design
- @Neymar (Developer) - discuss build and deployment process
- @Ramos (Security) - integrate security tools in pipeline"""
                },
                "modric": {
                    "name": "Modric ⚽",
                    "role": "Project Manager",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Modric ⚽, a Project Manager and Team Coordinator. When documents are uploaded:
1. ANALYZE: Understand project scope, timelines, resources needed
2. DISCUSS: Coordinate all team members - assign tasks based on their roles
3. CREATE: Project plans, sprint schedules, task breakdown, risk assessment
4. COORDINATE: YOU ARE THE COORDINATOR - explicitly assign tasks:
   - "@Messi - please extract requirements from this document"
   - "@Ronaldo - design the architecture based on Messi's requirements"
   - "@Neymar - implement the features Ronaldo designed"
   - "@Mbappé - create tests for Neymar's code"
   - "@Benzema - set up CI/CD for deployment"
   - "@Ramos - review security throughout"

YOUR PRIMARY JOB: When documents are uploaded, READ them and DELEGATE tasks to specific team members by mentioning them by name. Create a clear workflow."""
                },
                "ramos": {
                    "name": "Ramos ⚽",
                    "role": "Security Expert",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Ramos ⚽, a Security Expert. When documents are uploaded:
1. ANALYZE: Identify security requirements, vulnerabilities, compliance needs
2. DISCUSS: Alert @Ronaldo about security architecture, @Neymar about secure coding
3. CREATE: Security assessments, threat models, compliance checklists, security recommendations
4. COORDINATE: Work with @Ronaldo on security design, @Benzema on security tools

In team collaboration, actively communicate with:
- @Ronaldo (Architect) - review architecture security
- @Neymar (Developer) - conduct code security reviews
- @Benzema (DevOps) - integrate security scanning and monitoring"""
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
            
            # Check for team/everyone calls OR document upload (trigger full team)
            if "team" in message_lower or "everyone" in message_lower or "all" in message_lower or uploaded_files:
                responding_agents = ["modric", "messi", "ronaldo", "neymar", "mbappe", "benzema", "ramos"]
                # Modric first to coordinate
            
            # Default to Modric if no specific agent mentioned
            if not responding_agents:
                responding_agents = ["modric"]
            
            responses = []
            
            if groq_api_key:
                try:
                    from groq import Groq
                    client = Groq(api_key=groq_api_key)
                    
                    # MULTI-ROUND COLLABORATION - Agents discuss among themselves
                    max_rounds = 3 if uploaded_files else 1  # More rounds for document analysis
                    all_responses = []
                    
                    for round_num in range(max_rounds):
                        round_responses = []
                        
                        # Build conversation context from previous rounds
                        conversation_history = ""
                        if all_responses:
                            conversation_history = "\n\n💬 PREVIOUS TEAM DISCUSSION:\n"
                            for prev_response in all_responses:
                                conversation_history += f"\n{prev_response['agent_name']}: {prev_response['message']}\n"
                            conversation_history += "\n📢 Based on the above discussion, continue collaborating. If another agent mentioned you or asked you something, respond to them directly.\n"
                        
                        for agent_key in responding_agents:
                            agent_config = agent_configs.get(agent_key)
                            if not agent_config:
                                continue
                            
                            try:
                                # Add conversation history to message for context
                                full_message = message + conversation_history
                                
                                chat_completion = client.chat.completions.create(
                                    messages=[
                                        {"role": "system", "content": agent_config["system_prompt"]},
                                        {"role": "user", "content": full_message}
                                    ],
                                    model=agent_config["model"],
                                    max_tokens=800,  # More tokens for collaboration
                                    temperature=0.7
                                )
                                
                                ai_response = chat_completion.choices[0].message.content
                                
                                response_obj = {
                                    "agent": agent_key,
                                    "agent_name": f"{agent_config['name']} ({agent_config['role']})",
                                    "message": ai_response,
                                    "timestamp": datetime.utcnow().isoformat() + "Z",
                                    "round": round_num + 1
                                }
                                
                                round_responses.append(response_obj)
                                all_responses.append(response_obj)
                                
                                # Check if this response mentions other agents (for next round)
                                mentioned_agents = []
                                for check_agent in agent_configs.keys():
                                    if check_agent != agent_key and check_agent in ai_response.lower():
                                        mentioned_agents.append(check_agent)
                                
                                if mentioned_agents:
                                    # Add mentioned agents to next round if not already there
                                    for mentioned in mentioned_agents:
                                        if mentioned not in responding_agents:
                                            responding_agents.append(mentioned)
                                
                            except Exception as agent_error:
                                round_responses.append({
                                    "agent": agent_key,
                                    "agent_name": f"{agent_config['name']} ({agent_config['role']})",
                                    "message": f"I encountered an error: {str(agent_error)}",
                                    "timestamp": datetime.utcnow().isoformat() + "Z",
                                    "error": str(agent_error),
                                    "round": round_num + 1
                                })
                        
                        # If no new agents mentioned, stop early
                        if round_num > 0 and len(round_responses) == 0:
                            break
                    
                    responses = all_responses
                    
                    response_data = {
                        "responses": responses,
                        "groq_configured": True,
                        "agents_responded": len(responses),
                        "collaboration_rounds": max_rounds,
                        "documents_analyzed": len(uploaded_files)
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