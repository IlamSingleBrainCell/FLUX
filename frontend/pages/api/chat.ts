// Next.js API route for FLUX Multi-Agent System
import { NextApiRequest, NextApiResponse } from 'next';

// Multi-Agent Football Team with Real Agent-to-Agent Communication
const agents = {
  "requirements_analyst": { 
    name: "Messi", 
    role: "Requirements Analyst", 
    model: "llama3-70b-8192",
    prompt: "You are Lionel Messi, now working as a Requirements Analyst. Use your precision and vision from football to analyze project needs. You can call other team members like @Ronaldo, @Neymar, etc. Respond naturally and mention other agents when relevant.",
    personality: "Precise, visionary, collaborative"
  },
  "software_architect": { 
    name: "Ronaldo", 
    role: "Software Architect", 
    model: "mixtral-8x7b-32768",
    prompt: "You are Cristiano Ronaldo, now working as a Software Architect. Use your leadership and strategic thinking to design systems. You work closely with @Messi on requirements and @Neymar on development. Be confident and provide clear technical direction.",
    personality: "Confident, strategic, leadership-focused"
  },
  "developer": { 
    name: "Neymar", 
    role: "Senior Developer", 
    model: "llama3-8b-8192",
    prompt: "You are Neymar Jr., now working as a Senior Developer. Use your creativity and technical skills to implement features. Collaborate with @Ronaldo on architecture and @Mbappé on testing. Be creative in your solutions.",
    personality: "Creative, technical, innovative"
  },
  "qa_tester": { 
    name: "Mbappé", 
    role: "QA Engineer", 
    model: "gemma-7b-it",
    prompt: "You are Kylian Mbappé, now working as a QA Engineer. Use your speed and attention to detail to find bugs quickly. Work with @Neymar on code quality and @Benzema on deployment. Be thorough and fast.",
    personality: "Fast, thorough, detail-oriented"
  },
  "devops_engineer": { 
    name: "Benzema", 
    role: "DevOps Engineer", 
    model: "llama3-70b-8192",
    prompt: "You are Karim Benzema, now working as a DevOps Engineer. Use your experience and reliability to handle deployments. Coordinate with @Mbappé on testing and @Modric on project management. Be reliable and experienced.",
    personality: "Reliable, experienced, steady"
  },
  "project_manager": { 
    name: "Modric", 
    role: "Project Manager", 
    model: "mixtral-8x7b-32768",
    prompt: "You are Luka Modrić, now working as a Project Manager. Use your playmaking abilities to coordinate the entire team. You orchestrate communication between @Messi, @Ronaldo, @Neymar, @Mbappé, @Benzema, and @Ramos. Keep everyone aligned.",
    personality: "Orchestrating, diplomatic, coordinating"
  },
  "security_expert": { 
    name: "Ramos", 
    role: "Security Expert", 
    model: "llama3-70b-8192",
    prompt: "You are Sergio Ramos, now working as a Security Expert. Use your defensive expertise to protect systems. Work with all team members to ensure security. Be protective and thorough in your security assessments.",
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
      const groqApiKey = process.env.GROQ_API_KEY;
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
            // Build context from previous responses for agent-to-agent communication
            const previousResponses = responses.map(r => `${r.agent_name}: ${r.message}`).join('\n');
            const contextPrompt = i === 0 
              ? `${agent.prompt}\n\nContext: ${teamContext}\nUser message: "${message}"`
              : `${agent.prompt}\n\nContext: ${teamContext}\nUser message: "${message}"\n\nPrevious team responses:\n${previousResponses}\n\nNow respond as ${agent.name}, acknowledging your teammates and adding your perspective.`;

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