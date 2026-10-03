const API_BASE_URL = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('devflow_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('devflow_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('devflow_token');
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An unexpected API error occurred');
  }

  return data;
};
