// components/Workspace/TaskManagement.tsx
import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAgent?: string;
  createdFrom?: string; // message ID
  dueDate?: string;
  tags: string[];
}

interface TaskManagementProps {
  onClose: () => void;
  isOpen: boolean;
  messages?: any[];
  className?: string;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  onClose,
  isOpen,
  messages = [],
  className = '',
}) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication with refresh tokens',
      status: 'in-progress',
      priority: 'high',
      assignedAgent: 'Neymar',
      tags: ['backend', 'security'],
    },
    {
      id: '2',
      title: 'Design database schema',
      description: 'Create schema for user management and sessions',
      status: 'done',
      priority: 'high',
      assignedAgent: 'Ronaldo',
      tags: ['database', 'architecture'],
    },
    {
      id: '3',
      title: 'Write unit tests',
      description: 'Add test coverage for authentication module',
      status: 'todo',
      priority: 'medium',
      assignedAgent: 'Mbappé',
      tags: ['testing', 'quality'],
    },
  ]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
  });

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'slate' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'review', title: 'Review', color: 'yellow' },
    { id: 'done', title: 'Done', color: 'green' },
  ];

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  // Add new task
  const handleAddTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      status: newTask.status || 'todo',
      priority: newTask.priority || 'medium',
      assignedAgent: newTask.assignedAgent,
      tags: newTask.tags || [],
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', tags: [] });
    setShowNewTaskModal(false);
  };

  // Move task
  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  // Convert message to task
  const convertMessageToTask = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const task: Task = {
      id: Date.now().toString(),
      title: message.content.substring(0, 50) + '...',
      description: message.content,
      status: 'todo',
      priority: 'medium',
      assignedAgent: message.agentName,
      createdFrom: messageId,
      tags: ['from-chat'],
    };

    setTasks([...tasks, task]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Task Management</h2>
                <p className="text-sm text-slate-500">{tasks.length} tasks • {tasks.filter(t => t.status === 'done').length} completed</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    viewMode === 'kanban'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  📋 Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  📝 List
                </button>
              </div>

              <button
                onClick={() => setShowNewTaskModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)] custom-scrollbar">
          {viewMode === 'kanban' ? (
            // Kanban Board
            <div className="grid grid-cols-4 gap-4">
              {columns.map(column => (
                <div key={column.id} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">{column.title}</h3>
                    <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold">
                      {tasks.filter(t => t.status === column.id).length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {tasks
                      .filter(task => task.status === column.id)
                      .map(task => (
                        <div
                          key={task.id}
                          className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-move"
                        >
                          {/* Priority Badge */}
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-2 ${priorityColors[task.priority]}`}>
                            {task.priority === 'urgent' && '🔥'}
                            {task.priority === 'high' && '⬆️'}
                            {task.priority === 'medium' && '➡️'}
                            {task.priority === 'low' && '⬇️'}
                            {task.priority}
                          </div>

                          <h4 className="font-semibold text-slate-900 mb-2">{task.title}</h4>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>

                          {/* Tags */}
                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {task.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Assigned Agent */}
                          {task.assignedAgent && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                              <span>👤</span>
                              <span>{task.assignedAgent}</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <select
                              value={task.status}
                              onChange={(e) => moveTask(task.id, e.target.value as Task['status'])}
                              className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded"
                            >
                              {columns.map(col => (
                                <option key={col.id} value={col.id}>{col.title}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
                  <input type="checkbox" checked={task.status === 'done'} onChange={() => moveTask(task.id, task.status === 'done' ? 'todo' : 'done')} className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{task.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => moveTask(task.id, e.target.value as Task['status'])}
                      className="px-3 py-1 text-sm border border-slate-300 rounded"
                    >
                      {columns.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                      ))}
                    </select>
                    <button onClick={() => deleteTask(task.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Task Modal */}
        {showNewTaskModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Create New Task</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                  rows={3}
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={() => setShowNewTaskModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                  <button onClick={handleAddTask} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">Create</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
