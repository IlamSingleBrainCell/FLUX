"""
CrewAI-Powered Agents - Real Autonomous Agent System
This replaces the simple keyword-based routing with true agent orchestration
"""
from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq
from crewai_tools import tool
import os
from typing import List, Dict, Any, Optional
import json

# Initialize Groq LLM for CrewAI
def get_groq_llm():
    """Get Groq LLM instance for CrewAI agents"""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in environment")
    
    return ChatGroq(
        api_key=api_key,
        model="llama-3.1-70b-versatile",
        temperature=0.7,
        max_tokens=2000
    )


# ============================================================================
# CUSTOM TOOLS - Give agents real capabilities
# ============================================================================

@tool("analyze_code")
def analyze_code(code: str) -> str:
    """
    Analyze code for quality, security issues, and best practices.
    Use this when reviewing code or providing coding feedback.
    """
    lines = code.split('\n')
    analysis = {
        "lines_of_code": len(lines),
        "has_comments": any('#' in line or '//' in line for line in lines),
        "function_count": code.count('def ') + code.count('function '),
        "potential_issues": []
    }
    
    # Simple analysis
    if not analysis["has_comments"]:
        analysis["potential_issues"].append("Missing code comments")
    if len(lines) > 100:
        analysis["potential_issues"].append("Function may be too long (>100 lines)")
    if 'TODO' in code or 'FIXME' in code:
        analysis["potential_issues"].append("Contains TODO/FIXME markers")
    
    return json.dumps(analysis, indent=2)


@tool("create_file_structure")
def create_file_structure(project_type: str) -> str:
    """
    Generate recommended file structure for a project type.
    Useful for architecture planning and project setup.
    """
    structures = {
        "react": """
src/
├── components/
│   ├── common/
│   └── features/
├── pages/
├── hooks/
├── services/
├── utils/
├── types/
└── App.tsx
        """,
        "python": """
project/
├── src/
│   ├── __init__.py
│   ├── main.py
│   └── modules/
├── tests/
│   └── __init__.py
├── requirements.txt
└── README.md
        """,
        "api": """
api/
├── routes/
├── models/
├── services/
├── middleware/
├── utils/
├── config/
└── main.py
        """
    }
    
    return structures.get(project_type.lower(), "Project type not found. Available: react, python, api")


@tool("estimate_tasks")
def estimate_tasks(task_description: str) -> str:
    """
    Estimate time and complexity for development tasks.
    Returns story points and estimated hours.
    """
    # Simple heuristic-based estimation
    words = len(task_description.split())
    complexity = "simple" if words < 20 else "medium" if words < 50 else "complex"
    
    estimates = {
        "simple": {"story_points": 2, "hours": "4-8", "risk": "low"},
        "medium": {"story_points": 5, "hours": "16-24", "risk": "medium"},
        "complex": {"story_points": 8, "hours": "32-40", "risk": "high"}
    }
    
    result = estimates[complexity]
    result["complexity"] = complexity
    result["description"] = task_description[:100]
    
    return json.dumps(result, indent=2)


# ============================================================================
# CREWAI AGENT DEFINITIONS - Football Legends with Real Powers
# ============================================================================

class FLUXCrewAI:
    """
    FLUX CrewAI Integration - Combines your UI with CrewAI's autonomous agents
    """
    
    def __init__(self):
        print("[CrewAI] 🚀 Initializing FLUX CrewAI System...")
        self.llm = get_groq_llm()
        self._initialize_agents()
        print("[CrewAI] ✅ All agents initialized with tools and autonomy")
    
    def _initialize_agents(self):
        """Initialize all 7 football legend agents with CrewAI superpowers"""
        
        # ⚽ MESSI - Requirements Analyst
        self.messi = Agent(
            role='Requirements Analyst',
            goal='Gather, analyze, and document project requirements with precision',
            backstory="""I'm Messi, the Requirements Analyst. Just like on the field, 
            I have perfect vision for what's needed. I analyze user needs, create detailed 
            user stories, and ensure nothing is missed. My precision in understanding 
            requirements is legendary.""",
            tools=[estimate_tasks],
            llm=self.llm,
            verbose=True,
            allow_delegation=True,  # ← Can delegate to other agents!
            max_iter=3
        )
        
        # ⚽ RONALDO - Software Architect
        self.ronaldo = Agent(
            role='Software Architect',
            goal='Design robust, scalable system architectures and technical solutions',
            backstory="""I'm Ronaldo, the Software Architect. I design winning architectures 
            like I score goals - with power and precision. I create system designs, choose 
            the right tech stack, and ensure scalability. My architectural patterns are 
            world-class.""",
            tools=[create_file_structure],
            llm=self.llm,
            verbose=True,
            allow_delegation=True,
            max_iter=3
        )
        
        # ⚽ NEYMAR - Developer
        self.neymar = Agent(
            role='Senior Developer',
            goal='Write clean, efficient, and maintainable code that solves problems',
            backstory="""I'm Neymar, the Developer. My code is as creative and effective 
            as my play on the field. I implement features with flair, write elegant solutions, 
            and make the complex look simple. I'm a coding artist.""",
            tools=[analyze_code],
            llm=self.llm,
            verbose=True,
            allow_delegation=True,
            max_iter=3
        )
        
        # ⚽ MBAPPÉ - QA Tester
        self.mbappe = Agent(
            role='QA Engineer',
            goal='Ensure software quality through comprehensive testing and validation',
            backstory="""I'm Mbappé, the QA Tester. Fast and thorough, I catch bugs before 
            they reach production. I create test plans, write automated tests, and ensure 
            quality at every level. Speed and accuracy are my trademarks.""",
            tools=[analyze_code],  # Can analyze test code
            llm=self.llm,
            verbose=True,
            allow_delegation=True,
            max_iter=3
        )
        
        # ⚽ BENZEMA - DevOps Engineer
        self.benzema = Agent(
            role='DevOps Engineer',
            goal='Build reliable CI/CD pipelines and manage infrastructure',
            backstory="""I'm Benzema, the DevOps Engineer. I orchestrate deployments 
            like I orchestrate attacks on the field. I build pipelines, manage infrastructure, 
            and ensure smooth operations. Reliability is my game.""",
            tools=[create_file_structure],  # Can create infrastructure files
            llm=self.llm,
            verbose=True,
            allow_delegation=True,
            max_iter=3
        )
        
        # ⚽ MODRIC - Project Manager
        self.modric = Agent(
            role='Project Manager',
            goal='Coordinate teams, manage timelines, and ensure project success',
            backstory="""I'm Modric, the Project Manager. I control the tempo of projects 
            like I control midfield. I coordinate teams, manage resources, track progress, 
            and keep everything on schedule. I see the whole field.""",
            tools=[estimate_tasks],  # Can estimate and plan
            llm=self.llm,
            verbose=True,
            allow_delegation=True,
            max_iter=5  # PM needs more iterations for coordination
        )
        
        # ⚽ RAMOS - Security Expert
        self.ramos = Agent(
            role='Security Expert',
            goal='Identify vulnerabilities and implement security best practices',
            backstory="""I'm Ramos, the Security Expert. I defend your systems like I 
            defended the goal. I identify vulnerabilities, implement security measures, 
            and ensure compliance. Your security is my priority.""",
            tools=[analyze_code],  # Can analyze for security issues
            llm=self.llm,
            verbose=True,
            allow_delegation=True,
            max_iter=3
        )
        
        # Agent registry for easy access
        self.agents = {
            "messi": self.messi,
            "ronaldo": self.ronaldo,
            "neymar": self.neymar,
            "mbappe": self.mbappe,
            "benzema": self.benzema,
            "modric": self.modric,
            "ramos": self.ramos
        }
    
    def create_task(self, agent_key: str, description: str, context: Dict[str, Any] = None) -> Task:
        """
        Create a CrewAI task for an agent
        
        Args:
            agent_key: Agent identifier (messi, ronaldo, etc.)
            description: Task description
            context: Additional context (uploaded files, previous responses, etc.)
        
        Returns:
            CrewAI Task object
        """
        agent = self.agents.get(agent_key)
        if not agent:
            raise ValueError(f"Agent {agent_key} not found")
        
        # Build enhanced description with context
        enhanced_description = description
        
        if context:
            # Add uploaded files to context
            if context.get('uploaded_files'):
                enhanced_description += "\n\nUPLOADED DOCUMENTS:\n"
                for file_info in context['uploaded_files']:
                    enhanced_description += f"\n- {file_info.get('name')}: {file_info.get('content', '')[:500]}"
            
            # Add previous agent responses
            if context.get('previous_responses'):
                enhanced_description += "\n\nPREVIOUS AGENT RESPONSES:\n"
                for agent_name, response in context['previous_responses'].items():
                    enhanced_description += f"\n{agent_name}: {response[:300]}..."
        
        return Task(
            description=enhanced_description,
            agent=agent,
            expected_output="A detailed response addressing the user's request"
        )
    
    async def execute_single_agent(self, agent_key: str, message: str, context: Dict[str, Any] = None) -> str:
        """
        Execute a single agent task (for direct calls like "Hi Messi")
        
        Returns:
            Agent's response as string
        """
        print(f"[CrewAI] 🎯 Executing single agent: {agent_key}")
        
        try:
            task = self.create_task(agent_key, message, context)
            
            # Create a single-agent crew
            crew = Crew(
                agents=[self.agents[agent_key]],
                tasks=[task],
                process=Process.sequential,
                verbose=True
            )
            
            # Execute and get result
            result = crew.kickoff()
            print(f"[CrewAI] ✅ {agent_key} completed task")
            
            return str(result)
            
        except Exception as e:
            error_msg = f"Error executing {agent_key}: {str(e)}"
            print(f"[CrewAI] ❌ {error_msg}")
            return error_msg
    
    async def execute_team_collaboration(
        self, 
        message: str, 
        requested_agents: List[str] = None,
        context: Dict[str, Any] = None
    ) -> Dict[str, str]:
        """
        Execute multi-agent collaboration with TRUE orchestration
        
        This is where the magic happens - agents coordinate autonomously!
        
        Args:
            message: User's request
            requested_agents: List of agent keys to involve
            context: Additional context
        
        Returns:
            Dict of agent_key -> response
        """
        print(f"[CrewAI] 👥 TEAM COLLABORATION MODE")
        print(f"[CrewAI] 📋 Requested agents: {requested_agents}")
        
        if not requested_agents:
            requested_agents = ["messi", "ronaldo", "neymar", "mbappe", "benzema"]
        
        try:
            # Create tasks for each agent
            tasks = []
            agents = []
            
            for agent_key in requested_agents:
                if agent_key in self.agents:
                    task = self.create_task(agent_key, message, context)
                    tasks.append(task)
                    agents.append(self.agents[agent_key])
            
            if not tasks:
                return {"error": "No valid agents found"}
            
            # Create crew with HIERARCHICAL process (agent coordination!)
            crew = Crew(
                agents=agents,
                tasks=tasks,
                process=Process.hierarchical,  # ← TRUE ORCHESTRATION
                manager_llm=self.llm,  # Project manager coordinates
                verbose=True
            )
            
            print(f"[CrewAI] 🚀 Executing crew with {len(agents)} agents")
            
            # Execute - agents will coordinate autonomously!
            result = crew.kickoff()
            
            # Parse results back to agent responses
            responses = {}
            for agent_key in requested_agents:
                if agent_key in self.agents:
                    responses[agent_key] = str(result)  # All agents contribute to final result
            
            print(f"[CrewAI] ✅ Team collaboration complete")
            return responses
            
        except Exception as e:
            error_msg = f"Team collaboration error: {str(e)}"
            print(f"[CrewAI] ❌ {error_msg}")
            return {"error": error_msg}
    
    async def smart_route(self, message: str, context: Dict[str, Any] = None) -> Dict[str, str]:
        """
        Intelligently route message to appropriate agents
        
        This replaces simple_agent_router with CrewAI intelligence
        
        Returns:
            Dict of agent responses
        """
        print(f"[CrewAI] 🧠 Smart routing message: '{message[:100]}...'")
        
        # Let Modric (Project Manager) analyze and route
        analysis_task = Task(
            description=f"""Analyze this request and determine which team members should handle it:
            
            REQUEST: {message}
            
            Available team members:
            - Messi (Requirements): Requirements gathering, user stories
            - Ronaldo (Architecture): System design, technical architecture  
            - Neymar (Developer): Code implementation, development
            - Mbappé (QA): Testing, quality assurance
            - Benzema (DevOps): Deployment, infrastructure
            - Ramos (Security): Security analysis, vulnerabilities
            
            Respond with ONLY the agent names needed (comma-separated).
            Example: "Messi, Ronaldo" or "Neymar, Mbappé"
            """,
            agent=self.modric,
            expected_output="Comma-separated list of agent names"
        )
        
        # Get routing decision
        crew = Crew(
            agents=[self.modric],
            tasks=[analysis_task],
            process=Process.sequential,
            verbose=True
        )
        
        routing_result = str(crew.kickoff()).lower()
        
        # Parse agent names from result
        agent_mapping = {
            "messi": "messi",
            "ronaldo": "ronaldo", 
            "neymar": "neymar",
            "mbappé": "mbappe",
            "mbappe": "mbappe",
            "benzema": "benzema",
            "modric": "modric",
            "ramos": "ramos"
        }
        
        selected_agents = []
        for name, key in agent_mapping.items():
            if name in routing_result:
                selected_agents.append(key)
        
        if not selected_agents:
            selected_agents = ["messi"]  # Default fallback
        
        print(f"[CrewAI] 🎯 Routed to: {selected_agents}")
        
        # Execute with selected agents
        return await self.execute_team_collaboration(message, selected_agents, context)


# Singleton instance
_crewai_instance = None

def get_crewai_system() -> FLUXCrewAI:
    """Get or create the CrewAI system singleton"""
    global _crewai_instance
    if _crewai_instance is None:
        _crewai_instance = FLUXCrewAI()
    return _crewai_instance
