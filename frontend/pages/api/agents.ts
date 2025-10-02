// Next.js API route for agents list
import { NextApiRequest, NextApiResponse } from 'next';

const agents = {
  "requirements_analyst": { name: "Messi", role: "Requirements Analyst" },
  "software_architect": { name: "Ronaldo", role: "Software Architect" },
  "developer": { name: "Neymar", role: "Senior Developer" },
  "qa_tester": { name: "Mbappé", role: "QA Engineer" },
  "devops_engineer": { name: "Benzema", role: "DevOps Engineer" },
  "project_manager": { name: "Modric", role: "Project Manager" },
  "security_expert": { name: "Ramos", role: "Security Expert" }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const agentsList = Object.entries(agents).reduce((acc, [key, agent]) => {
      acc[key] = { 
        name: `${agent.name} (${agent.role})`, 
        status: 'online' 
      };
      return acc;
    }, {} as Record<string, any>);

    res.status(200).json({
      endpoint: 'agents',
      agents: agentsList,
      total: Object.keys(agents).length
    });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}