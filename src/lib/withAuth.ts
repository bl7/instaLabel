import { authService } from './services/authService';

/**
 * Higher-order function to handle authenticated API calls
 * This utility makes API calls with proper authentication handling and error recovery
 * 
 * @param url The API endpoint URL to call
 * @param options Fetch options including method, headers, etc.
 * @returns Promise with the API response data
 */
export async function withAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  // Check if we have a token
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Check if token is expired and needs refresh
  try {
    if (isTokenExpired(token)) {
      console.log('Token expired, attempting to refresh...');
      const refreshedToken = await authService.refreshToken();
      
      if (!refreshedToken) {
        console.error('Token refresh failed');
        handleTokenError();
        throw new Error('Authentication failed - token expired');
      }
    }
  } catch (refreshError) {
    console.warn('Error checking token expiration:', refreshError);
    // Continue with current token and let the API call fail if token is invalid
  }

  // Get the current token (which may have been refreshed)
  const currentToken = localStorage.getItem('token');
  
  // Prepare headers with authentication
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${currentToken}`);
  headers.set('Content-Type', 'application/json');
  
  // Make the API call
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });

    // Handle API errors
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.error('Authentication error:', response.status);
        handleTokenError();
        throw new Error('Authentication failed');
      }
      
      // Try to parse error message
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Use the raw error text if it cannot be parsed as JSON
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      throw new Error(errorMessage);
    }

    // Parse successful response
    const data = await response.json();
    
    // Handle different response formats
    if (data.data) {
      // Format: { status: "success", data: { ... } }
      return data.data as T;
    } else if (data.status === 'success') {
      // Format: { status: "success", ... }
      const { status, ...rest } = data;
      return rest as T;
    } else {
      // Format: { ... } (direct data)
      return data as T;
    }
  } catch (error) {
    // Handle network errors and other exceptions
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error('Network error - unable to connect to API');
    }
    
    // Re-throw other errors
    throw error;
  }
}

/**
 * Check if a JWT token is expired
 * @param token The JWT token to check
 * @param bufferSeconds Number of seconds buffer before expiration (default: 30)
 * @returns boolean indicating if the token is expired or about to expire
 */
export function isTokenExpired(token: string, bufferSeconds: number = 30): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid token format');
      return true;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const expiry = payload.exp;
    
    if (!expiry) {
      console.warn('Token has no expiration');
      return false; // Assume token without expiry doesn't expire
    }
    
    // Check if token is expired with buffer
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= (expiry - bufferSeconds);
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Assume expired on error
  }
}

/**
 * Handle token errors by logging out and redirecting
 */
export function handleTokenError(): void {
  // Clear all auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tenant');
  
  // Only redirect if we're in a browser environment
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Create authenticated headers for fetch requests
 * @returns Headers object with Authorization header
 */
export function createAuthHeaders(): Headers {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  headers.set('Content-Type', 'application/json');
  return headers;
} 