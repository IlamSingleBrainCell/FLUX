// Enterprise Multi-Agent Team Configuration
export const enterpriseAgents = [
  {
    id: 'requirements_analyst',
    name: 'Messi',
    role: 'Requirements Analyst',
    expertise: ['Requirements Gathering', 'User Stories', 'Acceptance Criteria', 'Stakeholder Analysis'],
    avatar: '⚽',
    color: 'blue',
    capabilities: [
      'Create user stories from business requirements',
      'Define acceptance criteria',
      'Manage product backlog',
      'Conduct stakeholder interviews',
      'Perform requirements traceability'
    ]
  },
  {
    id: 'software_architect',
    name: 'Ronaldo',
    role: 'Software Architect',
    expertise: ['System Design', 'Architecture Patterns', 'Technology Selection', 'Scalability'],
    avatar: '🏗️',
    color: 'purple',
    capabilities: [
      'Design system architecture',
      'Select appropriate technologies',
      'Create technical specifications',
      'Define integration patterns',
      'Ensure scalability and performance'
    ]
  },
  {
    id: 'developer',
    name: 'Neymar',
    role: 'Senior Developer',
    expertise: ['Full-Stack Development', 'API Design', 'Database Design', 'Code Reviews'],
    avatar: '💻',
    color: 'green',
    capabilities: [
      'Implement features and functionality',
      'Design and develop APIs',
      'Write clean, maintainable code',
      'Conduct code reviews',
      'Optimize application performance'
    ]
  },
  {
    id: 'qa_tester',
    name: 'Mbappé',
    role: 'QA Engineer',
    expertise: ['Test Planning', 'Automated Testing', 'Quality Assurance', 'Bug Tracking'],
    avatar: '🧪',
    color: 'orange',
    capabilities: [
      'Create comprehensive test plans',
      'Develop automated test suites',
      'Execute manual and automated tests',
      'Track and manage defects',
      'Ensure quality standards'
    ]
  },
  {
    id: 'devops_engineer',
    name: 'Benzema',
    role: 'DevOps Engineer', 
    expertise: ['CI/CD Pipelines', 'Infrastructure', 'Deployment', 'Monitoring'],
    avatar: '🚀',
    color: 'red',
    capabilities: [
      'Set up CI/CD pipelines',
      'Manage cloud infrastructure',
      'Automate deployment processes',
      'Monitor system performance',
      'Implement security best practices'
    ]
  },
  {
    id: 'project_manager',
    name: 'Modric',
    role: 'Project Manager',
    expertise: ['Sprint Planning', 'Team Coordination', 'Risk Management', 'Stakeholder Communication'],
    avatar: '📊',
    color: 'indigo',
    capabilities: [
      'Plan and manage sprints',
      'Coordinate team activities',
      'Track project progress',
      'Manage risks and dependencies',
      'Communicate with stakeholders'
    ]
  },
  {
    id: 'security_expert',
    name: 'Ramos',
    role: 'Security Expert',
    expertise: ['Security Assessment', 'Penetration Testing', 'Threat Modeling', 'Compliance'],
    avatar: '🔒',
    color: 'yellow',
    capabilities: [
      'Conduct security assessments',
      'Perform penetration testing',
      'Create threat models',
      'Ensure compliance requirements',
      'Implement security controls'
    ]
  }
];

export const getAgentById = (id: string) => {
  return enterpriseAgents.find(agent => agent.id === id);
};

export const getAgentByName = (name: string) => {
  return enterpriseAgents.find(agent => agent.name.toLowerCase() === name.toLowerCase());
};

export const getAllAgentIds = () => {
  return enterpriseAgents.map(agent => agent.id);
};