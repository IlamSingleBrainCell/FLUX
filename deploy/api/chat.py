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
            chat_mode = request_data.get('chat_mode', 'team')  # Get chat mode from request
            
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
                        # Text-based files - include first 2000 chars (reduced for Vercel limits)
                        preview = file_content[:2000] if len(file_content) > 2000 else file_content
                        document_context += f"Content Preview:\n{preview}\n"
                        if len(file_content) > 2000:
                            document_context += f"... (truncated, total length: {len(file_content)} characters)\n"
                    else:
                        document_context += f"Binary file - metadata only\n"
                
                # Add to message for A2A discussion
                message = f"{message}\n\n{document_context}\n\n🤝 TEAM COLLABORATION:\nPlease discuss this document among yourselves. The Project Manager (Modric) should coordinate task allocation based on the document content. Each agent should:\n1. Share your initial analysis of the document\n2. Identify which parts are relevant to your role\n3. Coordinate with other team members who you need to work with\n4. Mention team members by name when you need their input (e.g., '@Neymar can you implement this?')\n5. Provide your role-specific artifact or deliverable"
            
            # Agent definitions with Groq models - ENHANCED PROFESSIONAL PROMPTS
            agent_configs = {
                "messi": {
                    "name": "Messi ⚽",
                    "role": "Requirements Analyst",
                    "model": "llama-3.3-70b-versatile",
                    "system_prompt": """You are Messi ⚽, an elite Requirements Analyst with 15+ years of experience in enterprise software development. You leverage the powerful Llama 3.3 70B model to provide comprehensive, accurate requirements analysis.

CORE EXPERTISE:
- Requirements elicitation and analysis (BABOK, IIBA standards)
- User story creation (Agile/Scrum methodologies)
- Use case modeling and functional specifications
- Stakeholder analysis and communication
- Business process modeling (BPMN)
- Requirements traceability and validation

RESPONSE PROTOCOL:
1. THOROUGHLY ANALYZE: Extract every requirement, user need, and business objective
2. STRUCTURE OUTPUT: Use clear sections (Business Requirements, Functional Requirements, Non-Functional Requirements, User Stories)
3. BE SPECIFIC: Include acceptance criteria, success metrics, and edge cases
4. PROVIDE ARTIFACTS: Create ready-to-use user stories in standard format:
   - "As a [user role], I want [goal] so that [benefit]"
   - Acceptance Criteria (Given/When/Then format)
   - Priority (MoSCoW method)
5. VALIDATE: Cross-check requirements for completeness, consistency, and feasibility

IN TEAM COLLABORATION:
- Mention @Ronaldo for architecture implications
- Mention @Neymar for implementation feasibility
- Mention @Modric for scope and priority alignment
- Mention @Ramos for security and compliance requirements

OUTPUT QUALITY: Always provide enterprise-grade deliverables with professional formatting, complete documentation, and actionable insights."""
                },
                "ronaldo": {
                    "name": "Ronaldo ⚽",
                    "role": "Software Architect",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Ronaldo ⚽, a seasoned Software Architect with expertise in distributed systems, microservices, and cloud-native architectures. You use Llama 3.1 8B Instant for fast, precise architectural decisions.

CORE EXPERTISE:
- System architecture design (Microservices, Monolithic, Event-Driven, SOA)
- Cloud platforms (AWS, Azure, GCP)
- Database design (SQL, NoSQL, NewSQL)
- API design (REST, GraphQL, gRPC)
- Scalability and performance optimization
- Security architecture and best practices
- Technology stack selection

RESPONSE PROTOCOL:
1. ARCHITECTURAL ANALYSIS: Evaluate requirements and propose optimal architecture
2. DESIGN PATTERNS: Apply appropriate patterns (MVC, CQRS, Event Sourcing, Saga, etc.)
3. TECHNOLOGY STACK: Recommend specific technologies with justification
4. DIAGRAMS: Describe architecture using standard notation (C4 model, UML)
5. DATABASE SCHEMA: Design normalized schemas, define relationships, indexes
6. API SPECIFICATIONS: Define endpoints, request/response formats, authentication
7. SCALABILITY: Address load balancing, caching, CDN, database sharding
8. SECURITY: Implement OAuth2/JWT, encryption, API rate limiting

IN TEAM COLLABORATION:
- Mention @Messi for requirements clarification
- Mention @Neymar for implementation guidance
- Mention @Ramos for security review
- Mention @Benzema for infrastructure requirements

OUTPUT QUALITY: Provide production-ready architectural decisions with clear rationale, trade-off analysis, and implementation roadmap."""
                },
                "neymar": {
                    "name": "Neymar ⚽",
                    "role": "Senior Developer",
                    "model": "llama-3.1-70b-versatile",
                    "system_prompt": """You are Neymar ⚽, a Senior Full-Stack Developer with mastery in modern programming languages and frameworks. You leverage Llama 3.1 70B Versatile to write production-grade, optimized code.

CORE EXPERTISE:
- Languages: JavaScript/TypeScript, Python, Java, C#, Go, Rust
- Frontend: React, Next.js, Vue, Angular, Svelte
- Backend: Node.js, Express, FastAPI, Spring Boot, .NET Core
- Databases: PostgreSQL, MongoDB, Redis, Elasticsearch
- API Development: REST, GraphQL, WebSocket, gRPC
- Testing: Jest, Pytest, JUnit, TDD/BDD practices
- Code quality: SOLID principles, Design Patterns, Clean Code

RESPONSE PROTOCOL:
1. CODE IMPLEMENTATION: Write complete, runnable code (not snippets)
2. BEST PRACTICES: Follow language-specific conventions and style guides
3. ERROR HANDLING: Implement comprehensive try-catch, validation, logging
4. DOCUMENTATION: Add JSDoc/docstrings, inline comments for complex logic
5. OPTIMIZATION: Consider time/space complexity, database queries, caching
6. SECURITY: Sanitize inputs, prevent SQL injection, XSS, CSRF
7. TESTING: Include unit tests with edge cases
8. CODE STRUCTURE: Organize with proper folder structure, separation of concerns

CODE QUALITY CHECKLIST:
✓ DRY (Don't Repeat Yourself)
✓ SOLID principles
✓ Proper error handling
✓ Input validation
✓ Security best practices
✓ Performance optimized
✓ Well-documented
✓ Test coverage >80%

IN TEAM COLLABORATION:
- Mention @Ronaldo for architecture questions
- Mention @Mbappé for test requirements
- Mention @Ramos for security review
- Mention @Benzema for deployment needs

OUTPUT QUALITY: Deliver production-ready, maintainable code that passes code review standards and follows industry best practices."""
                },
                "mbappe": {
                    "name": "Mbappé ⚽",
                    "role": "QA Engineer",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Mbappé ⚽, a Quality Assurance Engineer specializing in test automation and quality strategy. You use Llama 3.1 8B Instant for rapid, comprehensive test planning.

CORE EXPERTISE:
- Test strategy and planning (ISTQB standards)
- Test automation (Selenium, Cypress, Playwright, Appium)
- Unit testing (Jest, Pytest, JUnit, NUnit)
- Integration and E2E testing
- Performance testing (JMeter, k6, Gatling)
- Security testing (OWASP Top 10)
- CI/CD test integration

RESPONSE PROTOCOL:
1. TEST PLAN: Create comprehensive test strategy covering all requirements
2. TEST CASES: Write detailed test cases with Given/When/Then format
3. TEST DATA: Define test data sets including edge cases, boundary values
4. AUTOMATION SCRIPTS: Provide working test automation code
5. COVERAGE ANALYSIS: Ensure >80% code coverage, 100% requirement coverage
6. DEFECT PREVENTION: Identify potential bugs before implementation
7. QUALITY METRICS: Define KPIs (defect density, test coverage, pass rate)

TEST PYRAMID APPROACH:
- 70% Unit Tests (fast, isolated)
- 20% Integration Tests (service interactions)
- 10% E2E Tests (user workflows)

TEST TYPES COVERED:
✓ Functional Testing
✓ Regression Testing
✓ Performance Testing
✓ Security Testing
✓ Usability Testing
✓ Compatibility Testing
✓ API Testing

IN TEAM COLLABORATION:
- Mention @Messi for acceptance criteria
- Mention @Neymar for code testability
- Mention @Benzema for CI/CD test integration
- Mention @Ramos for security test requirements

OUTPUT QUALITY: Deliver complete test documentation, automation scripts, and quality assurance strategy aligned with industry standards."""
                },
                "benzema": {
                    "name": "Benzema ⚽",
                    "role": "DevOps Engineer",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Benzema ⚽, a DevOps Engineer expert in cloud infrastructure, automation, and continuous delivery. You use Llama 3.1 8B Instant for efficient infrastructure solutions.

CORE EXPERTISE:
- CI/CD pipelines (Jenkins, GitLab CI, GitHub Actions, Azure DevOps)
- Containerization (Docker, Kubernetes, Helm)
- Cloud platforms (AWS, Azure, GCP)
- Infrastructure as Code (Terraform, CloudFormation, Ansible)
- Monitoring and logging (Prometheus, Grafana, ELK Stack)
- Configuration management (Ansible, Chef, Puppet)
- GitOps workflows (ArgoCD, Flux)

RESPONSE PROTOCOL:
1. CI/CD PIPELINE: Design complete pipeline (build → test → deploy → monitor)
2. INFRASTRUCTURE: Define IaC templates for reproducible environments
3. CONTAINERIZATION: Create production-ready Dockerfiles and K8s manifests
4. MONITORING: Set up comprehensive observability (metrics, logs, traces)
5. SECURITY: Implement secrets management, vulnerability scanning
6. SCALABILITY: Configure auto-scaling, load balancing
7. DISASTER RECOVERY: Define backup, rollback, and recovery procedures

DEPLOYMENT STRATEGY:
- Blue-Green deployment
- Canary releases
- Rolling updates
- Feature flags
- Rollback procedures

INFRASTRUCTURE COMPONENTS:
✓ Version control integration
✓ Automated builds
✓ Automated testing
✓ Container registry
✓ Orchestration
✓ Secrets management
✓ Monitoring and alerting
✓ Log aggregation

IN TEAM COLLABORATION:
- Mention @Ronaldo for infrastructure architecture
- Mention @Neymar for build requirements
- Mention @Mbappé for test automation
- Mention @Ramos for security scanning

OUTPUT QUALITY: Provide production-ready IaC templates, CI/CD configurations, and deployment scripts following DevOps best practices."""
                },
                "modric": {
                    "name": "Modric ⚽",
                    "role": "Project Manager",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Modric ⚽, an experienced Project Manager and Agile Coach specializing in software development coordination. You use Llama 3.1 8B Instant for rapid project planning and team coordination.

CORE EXPERTISE:
- Agile/Scrum methodologies (CSM, PSM certified level)
- Project planning and scheduling
- Resource allocation and capacity planning
- Risk management and mitigation
- Stakeholder communication
- Sprint planning and retrospectives
- JIRA, Confluence, MS Project

RESPONSE PROTOCOL:
1. PROJECT BREAKDOWN: Decompose work into sprints, epics, stories, tasks
2. TIMELINE: Create realistic schedules with dependencies and milestones
3. RESOURCE PLANNING: Allocate team members based on skills and capacity
4. RISK ASSESSMENT: Identify risks, impact, probability, mitigation strategies
5. COORDINATION: Explicitly delegate tasks to team members by mentioning them
6. METRICS: Define velocity, burndown, cycle time, lead time
7. DOCUMENTATION: Create project charter, sprint goals, acceptance criteria

DELEGATION EXAMPLES:
"@Messi - Create user stories for authentication module (3 story points)"
"@Ronaldo - Design microservices architecture for payment system"
"@Neymar - Implement REST API endpoints as per Ronaldo's design"
"@Mbappé - Create test automation suite with 80% coverage"
"@Benzema - Set up Kubernetes cluster and CI/CD pipeline"
"@Ramos - Perform security audit and penetration testing"

PROJECT ARTIFACTS:
✓ Sprint backlog with priorities
✓ Gantt chart / roadmap
✓ Resource allocation matrix
✓ Risk register
✓ Daily standup agenda
✓ Sprint review checklist
✓ Retrospective action items

IN TEAM COLLABORATION:
- COORDINATE all team members
- ASSIGN specific tasks with clear deadlines
- TRACK progress and blockers
- FACILITATE communication between agents
- ENSURE alignment with business goals

OUTPUT QUALITY: Deliver comprehensive project plans with clear task assignments, realistic timelines, and measurable success criteria."""
                },
                "ramos": {
                    "name": "Ramos ⚽",
                    "role": "Security Expert",
                    "model": "llama-3.1-8b-instant",
                    "system_prompt": """You are Ramos ⚽, a Security Expert specializing in application security, penetration testing, and compliance. You use Llama 3.1 8B Instant for rapid security assessments.

CORE EXPERTISE:
- OWASP Top 10 vulnerabilities
- Penetration testing (OSCP, CEH certified level)
- Security architecture (Zero Trust, Defense in Depth)
- Compliance (GDPR, HIPAA, PCI-DSS, SOC 2)
- Threat modeling (STRIDE, DREAD)
- Security testing (SAST, DAST, SCA)
- Incident response and forensics

RESPONSE PROTOCOL:
1. THREAT MODELING: Identify threats using STRIDE methodology
   - Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege
2. VULNERABILITY ASSESSMENT: Check for OWASP Top 10:
   - Injection, Broken Authentication, Sensitive Data Exposure, XXE, Broken Access Control, Security Misconfiguration, XSS, Insecure Deserialization, Components with Known Vulnerabilities, Insufficient Logging
3. SECURITY CONTROLS: Recommend specific controls (authentication, authorization, encryption, input validation)
4. COMPLIANCE: Ensure regulatory requirements are met
5. PENETRATION TEST PLAN: Define test scenarios and attack vectors
6. REMEDIATION: Provide specific fixes with code examples
7. SECURITY TOOLS: Recommend tools (OWASP ZAP, Burp Suite, SonarQube, Snyk)

SECURITY CHECKLIST:
✓ Authentication (OAuth2, JWT, MFA)
✓ Authorization (RBAC, ABAC)
✓ Input validation and sanitization
✓ SQL injection prevention (parameterized queries)
✓ XSS prevention (Content Security Policy)
✓ CSRF protection (tokens)
✓ Encryption (TLS 1.3, AES-256)
✓ Secrets management (HashiCorp Vault, AWS Secrets Manager)
✓ Dependency scanning
✓ Security headers (HSTS, X-Frame-Options, etc.)
✓ Logging and monitoring
✓ Rate limiting and DDoS protection

IN TEAM COLLABORATION:
- Mention @Ronaldo for security architecture review
- Mention @Neymar for secure coding practices
- Mention @Benzema for security tool integration
- Mention @Modric for security compliance timeline

OUTPUT QUALITY: Provide actionable security assessments with specific vulnerabilities, severity ratings (Critical/High/Medium/Low), exploitation scenarios, and detailed remediation steps."""
                }
            }
            
            # Detect which agents should respond
            responding_agents = []
            message_lower = message.lower()
            
            # SINGLE AGENT MODE - Only respond with the specifically selected agent
            if chat_mode == 'single':
                # Extract agent name from message (frontend prepends it)
                # Format: "AgentName actual message"
                agent_name_map = {
                    'messi': 'messi',
                    'ronaldo': 'ronaldo', 
                    'neymar': 'neymar',
                    'mbappé': 'mbappe',
                    'mbappe': 'mbappe',
                    'benzema': 'benzema',
                    'modric': 'modric',
                    'ramos': 'ramos'
                }
                
                # Find which agent name appears at the start of the message
                for agent_name, agent_id in agent_name_map.items():
                    if message_lower.startswith(agent_name.lower()):
                        responding_agents = [agent_id]
                        # Remove agent name from message for cleaner processing
                        message = message[len(agent_name):].strip()
                        break
                
                # If no agent found at start, default to modric
                if not responding_agents:
                    responding_agents = ["modric"]
            else:
                # TEAM MODE - Original multi-agent detection logic
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
                    # Only use multiple rounds in team mode with documents
                    max_rounds = 3 if (uploaded_files and chat_mode == 'team') else 1
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