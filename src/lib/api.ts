import { API_BASE_URL } from './config';

const API_URL = API_BASE_URL;

interface ApiOptions extends RequestInit {
  params?: Record<string, string>;
}

export const apiFetch = async (endpoint: string, options: ApiOptions = {}) => {
  const token = localStorage.getItem('token');
  
  const { params, ...fetchOptions } = options;
  
  let url = `${API_URL}${endpoint}`;
  
  // Add query params if provided
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    url = `${url}?${searchParams.toString()}`;
  }
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include' as RequestCredentials
  };
  
  try {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url, {
      ...defaultOptions,
      ...fetchOptions,
      headers: {
        ...defaultOptions.headers,
        ...fetchOptions.headers
      }
    });
    
    // For debugging
    console.log(`Response status: ${response.status}`);
    
    // Get response as text first for debugging
    const responseText = await response.text();
    console.log(`Response text: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    
    // Try to parse as JSON
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
      console.log('Parsed response:', data);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid response format from server');
    }
    
    if (!response.ok) {
      // Handle 401 specially for auth issues
      if (response.status === 401) {
        console.error('Authentication failed. Redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tenant');
        // In a real app we might want to redirect to login
        // window.location.href = '/login';
      }
      
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}; 