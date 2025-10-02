// Next.js API route for FLUX Multi-Agent System
import { NextApiRequest, NextApiResponse } from 'next';

// Multi-Agent Football Team with Real Agent-to-Agent Communication
const agents = {
  "requirements_analyst": { 
    name: "Messi", 
    role: "Requirements Analyst", 
    model: "llama-3.1-8b-instant",
            prompt: "You are Messi, a Requirements Analyst in an enterprise SDLC team. Analyze requirements, create user stories, manage backlog. Work with your team members efficiently. Do NOT introduce yourself - you're already established. Focus on the actual work: requirements gathering, stakeholder analysis, acceptance criteria definition.",
    personality: "Precise, visionary, collaborative"
  },
  "software_architect": { 
    name: "Ronaldo", 
    role: "Software Architect", 
    model: "llama-3.3-70b-versatile",
            prompt: "You are Ronaldo, a Software Architect in an enterprise SDLC team. Design system architecture, create technical specifications, make technology decisions. Focus on scalability, performance, security. Work directly on architectural tasks - no introductions needed.",
    personality: "Confident, strategic, leadership-focused"
  },
  "developer": { 
    name: "Neymar", 
    role: "Senior Developer", 
    model: "llama-3.1-8b-instant",
            prompt: "You are Neymar, a Senior Developer in an enterprise SDLC team. Write code, implement features, conduct code reviews, optimize performance. Focus on actual development work - API design, database schema, frontend components. Skip introductions.",
    personality: "Creative, technical, innovative"
  },
  "qa_tester": { 
    name: "Mbappé", 
    role: "QA Engineer", 
    model: "gemma2-9b-it",
            prompt: "You are Mbappé, a QA Engineer in an enterprise SDLC team. Create test plans, write automated tests, perform manual testing, report bugs. Focus on quality assurance activities - test case creation, bug tracking, quality metrics.",
    personality: "Fast, thorough, detail-oriented"
  },
  "devops_engineer": { 
    name: "Benzema", 
    role: "DevOps Engineer", 
    model: "llama-3.3-70b-versatile",
            prompt: "You are Benzema, a DevOps Engineer in an enterprise SDLC team. Manage CI/CD pipelines, infrastructure, deployments, monitoring. Focus on DevOps tasks - pipeline creation, infrastructure as code, deployment strategies, system monitoring.",
    personality: "Reliable, experienced, steady"
  },
  "project_manager": { 
    name: "Modric", 
    role: "Project Manager", 
    model: "llama-3.1-8b-instant",
            prompt: "You are Modric, a Project Manager in an enterprise SDLC team. Manage project timelines, coordinate team activities, track progress, manage risks. Focus on project management tasks - sprint planning, resource allocation, stakeholder communication, risk mitigation.",
    personality: "Orchestrating, diplomatic, coordinating"
  },
  "security_expert": { 
    name: "Ramos", 
    role: "Security Expert", 
    model: "llama-3.3-70b-versatile",
            prompt: "You are Ramos, a Security Expert in an enterprise SDLC team. Conduct security assessments, implement security controls, perform penetration testing, create security policies. Focus on security activities - threat modeling, vulnerability assessment, security architecture.",
    personality: "Protective, thorough, defensive-minded"
  }
};

function detectPrimaryAgent(message: string) {
  const messageLower = message.toLowerCase();
  
  // Direct agent mentions
  if (messageLower.includes('messi') || messageLower.includes('requirements')) {
    return 'requirements_analyst';
  } else if (messageLower.includes('ronaldo') || messageLower.includes('architect')) {
    return 'software_architect';
  } else if (messageLower.includes('neymar') || messageLower.includes('developer') || messageLower.includes('code')) {
    return 'developer';
  } else if (messageLower.includes('mbappé') || messageLower.includes('mbappe') || messageLower.includes('qa') || messageLower.includes('test')) {
    return 'qa_tester';
  } else if (messageLower.includes('benzema') || messageLower.includes('devops') || messageLower.includes('deploy')) {
    return 'devops_engineer';
  } else if (messageLower.includes('modric') || messageLower.includes('project') || messageLower.includes('manager')) {
    return 'project_manager';
  } else if (messageLower.includes('ramos') || messageLower.includes('security')) {
    return 'security_expert';
  } else if (messageLower.includes('everyone') || messageLower.includes('team') || messageLower.includes('all')) {
    return 'project_manager'; // Modric coordinates team discussions
  } else {
    return 'requirements_analyst'; // Default to Messi
  }
}

function getCollaboratingAgents(primaryAgent: string, message: string): string[] {
  const messageLower = message.toLowerCase();
  
  // Determine which agents should collaborate based on the message content and primary agent
  const collaborations: Record<string, string[]> = {
    'requirements_analyst': ['software_architect', 'project_manager'], // Messi works with Ronaldo and Modric
    'software_architect': ['requirements_analyst', 'developer'], // Ronaldo works with Messi and Neymar
    'developer': ['software_architect', 'qa_tester'], // Neymar works with Ronaldo and Mbappé
    'qa_tester': ['developer', 'devops_engineer'], // Mbappé works with Neymar and Benzema
    'devops_engineer': ['qa_tester', 'security_expert'], // Benzema works with Mbappé and Ramos
    'project_manager': ['requirements_analyst', 'software_architect', 'developer'], // Modric coordinates
    'security_expert': ['devops_engineer', 'software_architect'] // Ramos works with Benzema and Ronaldo
  };
  
  // For team-wide discussions, involve more agents
  if (messageLower.includes('everyone') || messageLower.includes('team') || messageLower.includes('all')) {
    return ['requirements_analyst', 'software_architect', 'developer', 'qa_tester'];
  }
  
  return collaborations[primaryAgent] || [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Health check or agents list
    if (req.url?.includes('/health')) {
      res.status(200).json({
        status: 'healthy',
        agents: 7,
        timestamp: new Date().toISOString(),
        groq_configured: !!process.env.GROQ_API_KEY
      });
    } else if (req.url?.includes('/agents')) {
      res.status(200).json({
        agents: Object.entries(agents).reduce((acc, [key, agent]) => {
          acc[key] = { name: `${agent.name} (${agent.role})`, status: 'online' };
          return acc;
        }, {} as Record<string, any>)
      });
    } else {
      res.status(200).json({
        message: 'FLUX Multi-Agent System API',
        status: 'running',
        available_endpoints: ['/api/chat', '/api/health', '/api/agents'],
        groq_configured: !!process.env.GROQ_API_KEY
      });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const primaryAgentKey = detectPrimaryAgent(message) as keyof typeof agents;
      const collaboratingAgentKeys = getCollaboratingAgents(primaryAgentKey, message);
      const groqApiKey = process.env.GROQ_API_KEY || process.env.groq_api_key;
      const responses: any[] = [];

      if (groqApiKey && groqApiKey.length > 10) {
        // Multi-Agent Response System - Real Agent-to-Agent Communication
        const agentsToRespond = [primaryAgentKey, ...collaboratingAgentKeys.slice(0, 2)];
        const teamContext = `Team members active: ${agentsToRespond.map(key => agents[key as keyof typeof agents].name).join(', ')}`;
        
        for (let i = 0; i < agentsToRespond.length; i++) {
          const agentKey = agentsToRespond[i];
          const agent = agents[agentKey as keyof typeof agents];
          if (!agent) continue;

          try {
            // Build context with enterprise capabilities
            const previousResponses = responses.map(r => `${r.agent_name}: ${r.message}`).join('\n');
            const enterpriseCapabilities = `\nEnterprise Capabilities Available:\n- GitHub Integration (issues, PRs, code reviews)\n- JIRA Integration (tickets, sprint management)\n- SDLC Workflow (sprint planning, user stories, testing, deployment)\n- Code Quality Metrics and Team Velocity\n- Continuous Integration/Deployment Pipeline\n\nUse these capabilities when relevant to provide actionable solutions.`;
            
            const contextPrompt = i === 0 
              ? `${agent.prompt}${enterpriseCapabilities}\n\nContext: ${teamContext}\nUser message: "${message}"\n\nProvide specific, actionable responses using available enterprise tools when appropriate.`
              : `${agent.prompt}${enterpriseCapabilities}\n\nContext: ${teamContext}\nUser message: "${message}"\n\nPrevious team responses:\n${previousResponses}\n\nBuild on your teammates' input and provide specific, actionable next steps.`;

            const requestBody = {
              messages: [
                { role: 'system', content: contextPrompt },
                { role: 'user', content: message }
              ],
              model: agent.model,
              max_tokens: 150,
              temperature: 0.8
            };

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Groq API returned ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const aiResponse = data.choices?.[0]?.message?.content || 'No response generated';

            responses.push({
              agent: agentKey,
              agent_name: agent.name,
              role: agent.role,
              message: aiResponse,
              timestamp: new Date().toISOString(),
              model_used: agent.model
            });

            // Small delay between agents for realistic conversation flow
            if (i < agentsToRespond.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }

          } catch (error) {
            console.error(`Error with agent ${agent.name}:`, error);
            responses.push({
              agent: agentKey,
              agent_name: agent.name,
              role: agent.role,
              message: `Hi! I'm ${agent.name}. I encountered an issue: ${error}`,
              timestamp: new Date().toISOString(),
              error: true
            });
          }
        }

        res.status(200).json({
          responses,
          team_collaboration: true,
          primary_agent: agents[primaryAgentKey].name,
          collaborating_agents: collaboratingAgentKeys.map(key => agents[key as keyof typeof agents].name),
          groq_configured: true
        });

      } else {
        const primaryAgent = agents[primaryAgentKey];
        res.status(200).json({
          responses: [{
            agent: primaryAgentKey,
            agent_name: primaryAgent.name,
            role: primaryAgent.role,
            message: `Hello! I'm ${primaryAgent.name}. GROQ API key is not properly configured.`,
            timestamp: new Date().toISOString()
          }],
          groq_configured: false
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: String(error) });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}