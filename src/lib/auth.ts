import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';

export async function logout() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    // Continue with logout even if there was an error
  }
}

export function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    // Add 5 second buffer to prevent edge cases
    return currentTime > payload.exp - 5;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

export function handleTokenError() {
  console.error('Token validation error - logging out');
  logout();
  window.location.href = '/login';
}

/**
 * Higher-order function to handle authenticated API calls
 * @param apiFn Function that performs the actual API call
 * @returns Result of the API call or throws an error
 */
export async function withAuth<T>(apiFn: () => Promise<T>): Promise<T> {
  try {
    // Get the current token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Check if token is expired and try to refresh if needed
    if (isTokenExpired(token)) {
      console.log('Token expired, attempting to refresh...');
      const refreshedToken = await authService.refreshToken();
      if (!refreshedToken) {
        throw new Error('Authentication token expired');
      }
    }

    // Execute the API function 
    return await apiFn();
  } catch (error: any) {
    // Handle different types of authentication errors
    if (
      error.message === 'No authentication token found' ||
      error.message === 'Authentication token expired' ||
      error.message?.includes('Authentication failed') ||
      error.message?.includes('token') ||
      (error instanceof Response && (error.status === 401 || error.status === 403))
    ) {
      handleTokenError();
      throw new Error('Authentication failed');
    }
    
    // Re-throw other errors
    throw error;
  }
}

/**
 * Helper function to handle JSON response from API
 * @param response Fetch Response object
 * @returns Parsed JSON data
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  console.log(`API Response: ${response.url} [${response.status}]`);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication error:', response.status);
      
      // Get response text for debugging
      const errorText = await response.text();
      console.error('Authentication error details:', errorText);
      
      throw new Error('Authentication failed');
    }
    
    // Get response text 
    const errorText = await response.text();
    console.error(`API Error [${response.status}]:`, errorText);
    
    let errorMessage = `Server error: ${response.status} ${response.statusText}`;
    
    try {
      // Try to parse as JSON
      const errorData = JSON.parse(errorText);
      console.error('Parsed error data:', errorData);
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      // Use the raw error text if it cannot be parsed as JSON
      if (errorText && errorText.length < 200) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(errorMessage);
  }
  
  // Get response text first to log it
  const responseText = await response.text();
  console.log('API response text:', responseText.length > 500 
    ? responseText.substring(0, 500) + '... [truncated]' 
    : responseText);
  
  // Parse JSON
  let data;
  try {
    data = JSON.parse(responseText);
    console.log('Parsed API response:', data);
  } catch (parseError) {
    console.error('Error parsing API response:', parseError);
    throw new Error('Invalid JSON response from server');
  }
  
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
} 