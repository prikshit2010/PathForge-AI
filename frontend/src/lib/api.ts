const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const checkAuth = async () => {
  const response = await fetch(`${API_BASE}/api/auth/me`, { 
    credentials: 'include',
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Not authenticated');
  return response.json();
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
  }
  return response.json();
};

export const register = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
  }
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Logout failed');
  return response.json();
};

export const generateRoadmap = async (data: any) => {
  const response = await fetch(`${API_BASE}/api/roadmaps/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  if (!response.ok) {
     const text = await response.text();
     console.error("API Error", response.status, text);
     throw new Error('Failed to generate roadmap');
  }
  return response.json();
};

export const getRoadmapGraph = async (id: string) => {
  const response = await fetch(`${API_BASE}/api/roadmaps/${id}/graph`, {
    credentials: 'include',
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to load roadmap graph');
  return response.json();
};

export const updateNodeStatus = async (roadmapId: string, nodeId: string, status: string) => {
  const response = await fetch(`${API_BASE}/api/roadmaps/${roadmapId}/nodes/${nodeId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Failed to update status');
};

export const tutorNode = async (roadmapId: string, nodeId: string, question: string) => {
  const response = await fetch(`${API_BASE}/api/roadmaps/${roadmapId}/nodes/${nodeId}/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ question })
  });
  if (!response.ok) throw new Error('Failed to fetch tutor answer');
  const data = await response.json();
  return data.answer;
};
