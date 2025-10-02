// MCP (Model Context Protocol) Connectors for Enterprise Integration
import { NextApiRequest, NextApiResponse } from 'next';

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  state: string;
  assignee?: string;
  labels: string[];
  created_at: string;
  updated_at: string;
}

interface JIRATicket {
  key: string;
  summary: string;
  description: string;
  status: string;
  assignee?: string;
  priority: string;
  created: string;
  updated: string;
}

class MCPConnector {
  private githubToken: string;
  private jiraToken: string;
  private jiraUrl: string;

  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN || '';
    this.jiraToken = process.env.JIRA_TOKEN || '';
    this.jiraUrl = process.env.JIRA_URL || '';
  }

  // GitHub MCP Operations
  async getGitHubIssues(repo: string, owner: string): Promise<GitHubIssue[]> {
    if (!this.githubToken) return [];
    
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) throw new Error(`GitHub API: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('GitHub MCP Error:', error);
      return [];
    }
  }

  async createGitHubIssue(repo: string, owner: string, title: string, body: string, labels: string[] = []): Promise<GitHubIssue | null> {
    if (!this.githubToken) return null;

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body, labels })
      });

      if (!response.ok) throw new Error(`GitHub API: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('GitHub MCP Error:', error);
      return null;
    }
  }

  async getGitHubPullRequests(repo: string, owner: string): Promise<any[]> {
    if (!this.githubToken) return [];

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) throw new Error(`GitHub API: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('GitHub MCP Error:', error);
      return [];
    }
  }

  // JIRA MCP Operations
  async getJIRATickets(projectKey: string): Promise<JIRATicket[]> {
    if (!this.jiraToken || !this.jiraUrl) return [];

    try {
      const response = await fetch(`${this.jiraUrl}/rest/api/2/search?jql=project=${projectKey}`, {
        headers: {
          'Authorization': `Bearer ${this.jiraToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`JIRA API: ${response.statusText}`);
      const data = await response.json();
      
      return data.issues.map((issue: any) => ({
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        status: issue.fields.status.name,
        assignee: issue.fields.assignee?.displayName,
        priority: issue.fields.priority.name,
        created: issue.fields.created,
        updated: issue.fields.updated
      }));
    } catch (error) {
      console.error('JIRA MCP Error:', error);
      return [];
    }
  }

  async createJIRATicket(projectKey: string, summary: string, description: string, issueType: string = 'Task'): Promise<JIRATicket | null> {
    if (!this.jiraToken || !this.jiraUrl) return null;

    try {
      const issueData = {
        fields: {
          project: { key: projectKey },
          summary,
          description,
          issuetype: { name: issueType }
        }
      };

      const response = await fetch(`${this.jiraUrl}/rest/api/2/issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.jiraToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
      });

      if (!response.ok) throw new Error(`JIRA API: ${response.statusText}`);
      const data = await response.json();
      
      return {
        key: data.key,
        summary,
        description,
        status: 'To Do',
        priority: 'Medium',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('JIRA MCP Error:', error);
      return null;
    }
  }

  // Enterprise SDLC Operations
  async syncGitHubToJIRA(repo: string, owner: string, projectKey: string): Promise<{ synced: number, errors: string[] }> {
    const issues = await this.getGitHubIssues(repo, owner);
    let synced = 0;
    const errors: string[] = [];

    for (const issue of issues) {
      const jiraTicket = await this.createJIRATicket(
        projectKey,
        `[GitHub] ${issue.title}`,
        issue.body || 'Synced from GitHub',
        'Story'
      );
      
      if (jiraTicket) {
        synced++;
      } else {
        errors.push(`Failed to sync issue: ${issue.title}`);
      }
    }

    return { synced, errors };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const mcp = new MCPConnector();
  const { action, repo, owner, projectKey, title, body, labels, summary, description } = req.body || req.query;

  try {
    switch (action) {
      case 'get_github_issues':
        const issues = await mcp.getGitHubIssues(repo, owner);
        res.status(200).json({ success: true, data: issues });
        break;

      case 'create_github_issue':
        const newIssue = await mcp.createGitHubIssue(repo, owner, title, body, labels || []);
        res.status(200).json({ success: !!newIssue, data: newIssue });
        break;

      case 'get_github_prs':
        const prs = await mcp.getGitHubPullRequests(repo, owner);
        res.status(200).json({ success: true, data: prs });
        break;

      case 'get_jira_tickets':
        const tickets = await mcp.getJIRATickets(projectKey);
        res.status(200).json({ success: true, data: tickets });
        break;

      case 'create_jira_ticket':
        const newTicket = await mcp.createJIRATicket(projectKey, summary, description);
        res.status(200).json({ success: !!newTicket, data: newTicket });
        break;

      case 'sync_github_jira':
        const syncResult = await mcp.syncGitHubToJIRA(repo, owner, projectKey);
        res.status(200).json({ success: true, data: syncResult });
        break;

      case 'health':
        res.status(200).json({
          success: true,
          connectors: {
            github: !!process.env.GITHUB_TOKEN,
            jira: !!(process.env.JIRA_TOKEN && process.env.JIRA_URL)
          },
          capabilities: [
            'get_github_issues',
            'create_github_issue', 
            'get_github_prs',
            'get_jira_tickets',
            'create_jira_ticket',
            'sync_github_jira'
          ]
        });
        break;

      default:
        res.status(400).json({ 
          success: false, 
          error: 'Invalid action',
          available_actions: ['get_github_issues', 'create_github_issue', 'get_github_prs', 'get_jira_tickets', 'create_jira_ticket', 'sync_github_jira', 'health']
        });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'MCP Connector Error', 
      details: String(error) 
    });
  }
}