import { useState, useEffect } from 'react';

interface ToolMetrics {
  [key: string]: string | number;
}

interface ToolStatus {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error' | 'running';
  metrics: ToolMetrics;
  icon: string;
  color: string;
  lastUpdated: string;
}

export function useToolsStatus(refreshInterval: number = 30000) {
  const [tools, setTools] = useState<ToolStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToolsStatus = async () => {
    try {
      const response = await fetch('/api/tools-status');
      const data = await response.json();

      if (data.success) {
        setTools(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch tools status');
      }
    } catch (err) {
      setError('Network error while fetching tools status');
      console.error('Error fetching tools status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToolsStatus();

    const interval = setInterval(fetchToolsStatus, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { tools, loading, error, refresh: fetchToolsStatus };
}
