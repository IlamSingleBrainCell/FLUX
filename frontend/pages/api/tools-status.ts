import type { NextApiRequest, NextApiResponse } from 'next';

interface ToolStatus {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error' | 'running';
  metrics: {
    [key: string]: string | number;
  };
  icon: string;
  color: string;
  lastUpdated: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simulate fetching real-time data from various tools
    // In production, this would call actual APIs
    
    const toolsStatus: ToolStatus[] = [
      {
        id: 'jira',
        name: 'JIRA',
        type: 'Project Management',
        status: 'connected',
        icon: '🔵',
        color: 'blue',
        lastUpdated: new Date().toISOString(),
        metrics: {
          epics: Math.floor(Math.random() * 10) + 5,
          stories: Math.floor(Math.random() * 50) + 30,
          bugs: Math.floor(Math.random() * 5) + 1,
          velocity: Math.floor(Math.random() * 30) + 40
        }
      },
      {
        id: 'github',
        name: 'GitHub',
        type: 'Version Control',
        status: 'connected',
        icon: '⚫',
        color: 'slate',
        lastUpdated: new Date().toISOString(),
        metrics: {
          commits: Math.floor(Math.random() * 20) + 15,
          pullRequests: Math.floor(Math.random() * 10) + 3,
          branches: Math.floor(Math.random() * 15) + 8,
          contributors: Math.floor(Math.random() * 5) + 3
        }
      },
      {
        id: 'jenkins',
        name: 'Jenkins',
        type: 'CI/CD Pipeline',
        status: 'running',
        icon: '🔴',
        color: 'red',
        lastUpdated: new Date().toISOString(),
        metrics: {
          builds: Math.floor(Math.random() * 25) + 10,
          successRate: Math.floor(Math.random() * 10) + 90,
          avgDuration: `${Math.floor(Math.random() * 5) + 3}m`,
          failed: Math.floor(Math.random() * 3)
        }
      },
      {
        id: 'docker',
        name: 'Docker',
        type: 'Container Registry',
        status: 'connected',
        icon: '🐳',
        color: 'cyan',
        lastUpdated: new Date().toISOString(),
        metrics: {
          images: Math.floor(Math.random() * 20) + 40,
          tags: Math.floor(Math.random() * 50) + 100,
          size: `${(Math.random() * 10 + 8).toFixed(1)} GB`,
          pulls: Math.floor(Math.random() * 100) + 200
        }
      },
      {
        id: 'kubernetes',
        name: 'Kubernetes',
        type: 'Orchestration',
        status: 'connected',
        icon: '☸️',
        color: 'indigo',
        lastUpdated: new Date().toISOString(),
        metrics: {
          pods: `${Math.floor(Math.random() * 5) + 25}/30`,
          services: Math.floor(Math.random() * 5) + 10,
          cpuUsage: `${Math.floor(Math.random() * 20) + 60}%`,
          memoryUsage: `${Math.floor(Math.random() * 20) + 70}%`
        }
      },
      {
        id: 'sonarqube',
        name: 'SonarQube',
        type: 'Code Quality',
        status: 'connected',
        icon: '📊',
        color: 'emerald',
        lastUpdated: new Date().toISOString(),
        metrics: {
          qualityGate: 'Passed',
          bugs: Math.floor(Math.random() * 5) + 1,
          vulnerabilities: Math.floor(Math.random() * 3),
          codeSmells: Math.floor(Math.random() * 20) + 10,
          coverage: `${Math.floor(Math.random() * 15) + 80}%`
        }
      },
      {
        id: 'grafana',
        name: 'Grafana',
        type: 'Monitoring',
        status: 'connected',
        icon: '📈',
        color: 'orange',
        lastUpdated: new Date().toISOString(),
        metrics: {
          dashboards: Math.floor(Math.random() * 10) + 15,
          alerts: Math.floor(Math.random() * 3),
          uptime: `${(Math.random() * 0.5 + 99.5).toFixed(2)}%`,
          avgResponseTime: `${Math.floor(Math.random() * 100) + 50}ms`
        }
      },
      {
        id: 'slack',
        name: 'Slack',
        type: 'Communication',
        status: 'connected',
        icon: '💬',
        color: 'purple',
        lastUpdated: new Date().toISOString(),
        metrics: {
          channels: Math.floor(Math.random() * 20) + 30,
          messages: Math.floor(Math.random() * 100) + 200,
          activeUsers: Math.floor(Math.random() * 10) + 15,
          notifications: Math.floor(Math.random() * 5)
        }
      }
    ];

    res.status(200).json({
      success: true,
      data: toolsStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching tools status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tools status'
    });
  }
}
