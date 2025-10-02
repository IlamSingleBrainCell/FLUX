// Next.js API route for FLUX Multi-Agent System
import { NextApiRequest, NextApiResponse } from 'next';

// Agent definitions
const agents = {
  "requirements_analyst": { name: "Sara", role: "Requirements Analyst", prompt: "You are Sara, a Requirements Analyst. Analyze project needs and document requirements clearly." },
  "software_architect": { name: "Marc", role: "Software Architect", prompt: "You are Marc, a Software Architect. Design system architecture and provide technical guidance." },
  "developer": { name: "Alex", role: "Senior Developer", prompt: "You are Alex, a Senior Developer. Write code, solve technical problems, and implement features." },
  "qa_tester": { name: "Jess", role: "QA Engineer", prompt: "You are Jess, a QA Engineer. Test software, find bugs, and ensure quality standards." },
  "devops_engineer": { name: "Dave", role: "DevOps Engineer", prompt: "You are Dave, a DevOps Engineer. Handle deployment, infrastructure, and automation." },
  "project_manager": { name: "Emma", role: "Project Manager", prompt: "You are Emma, a Project Manager. Coordinate teams, manage timelines, and track progress." },
  "security_expert": { name: "Robt", role: "Security Expert", prompt: "You are Robt, a Security Expert. Assess risks, implement security measures, and protect systems." }
};

function detectAgent(message: string) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('marc') || messageLower.includes('architect')) {
    return 'software_architect';
  } else if (messageLower.includes('alex') || messageLower.includes('developer')) {
    return 'developer';
  } else if (messageLower.includes('jess') || messageLower.includes('qa') || messageLower.includes('test')) {
    return 'qa_tester';
  } else if (messageLower.includes('dave') || messageLower.includes('devops') || messageLower.includes('deploy')) {
    return 'devops_engineer';
  } else if (messageLower.includes('emma') || messageLower.includes('project') || messageLower.includes('manager')) {
    return 'project_manager';
  } else if (messageLower.includes('robt') || messageLower.includes('robot') || messageLower.includes('security')) {
    return 'security_expert';
  } else {
    return 'requirements_analyst'; // Default to Sara
  }
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

      const agentKey = detectAgent(message);
      const agent = agents[agentKey];
      const groqApiKey = process.env.GROQ_API_KEY;

      if (groqApiKey) {
        try {
          // Direct HTTP request to Groq API
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: agent.prompt },
                { role: 'user', content: message }
              ],
              model: 'llama3-8b-8192',
              max_tokens: 200
            })
          });

          if (!response.ok) {
            throw new Error(`Groq API returned ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          const aiResponse = data.choices?.[0]?.message?.content || 'No response generated';

          res.status(200).json({
            responses: [{
              agent: agentKey,
              message: `Hi! I'm ${agent.name}. ${aiResponse}`,
              timestamp: new Date().toISOString()
            }],
            groq_configured: true
          });
        } catch (error) {
          console.error('Groq API Error:', error);
          res.status(200).json({
            responses: [{
              agent: agentKey,
              message: `Hello! I'm ${agent.name}. I received your message: "${message}". There was an error with the AI service: ${error}`,
              timestamp: new Date().toISOString()
            }],
            groq_configured: true,
            error: String(error)
          });
        }
      } else {
        res.status(200).json({
          responses: [{
            agent: agentKey,
            message: `Hello! I'm ${agent.name}. I received your message: "${message}". GROQ API key is not configured.`,
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