import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';

export async function logout() {
  try {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('tenant');
    console.log('User logged out successfully');
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    // Add a small buffer to avoid edge cases
    return currentTime > payload.exp - 5;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

export async function handleTokenError() {
  console.error('Token validation error - logging out');
  logout();
}

/**
 * Higher-order function to handle authenticated API calls
 * @param apiFn Function that performs the actual API call
 * @returns Result of the API call or throws an error
 */
export async function withAuth<T>(apiFn: () => Promise<T>): Promise<T> {
  try {
    // Get the current token
    let token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      console.log('Token expired or not found, attempting to refresh...');
      try {
        const refreshedToken = await authService.refreshToken();
        if (refreshedToken) {
          localStorage.setItem('token', refreshedToken);
          token = refreshedToken;
          console.log('Token refreshed successfully');
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        console.error('Token refresh error:', error);
        handleTokenError();
        throw new Error('Authentication failed');
      }
    }

    // Execute the API function
    return await apiFn();
  } catch (error: any) {
    console.error('API call error:', error);

    // Handle authentication-related errors
    if (
      error.message?.includes('Authentication') ||
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

  const responseText = await response.text();
  console.log('API response text:', responseText.length > 500 
    ? responseText.substring(0, 500) + '... [truncated]' 
    : responseText);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication error:', response.status);
      console.error('Error details:', responseText);
      throw new Error('Authentication failed');
    }

    let errorMessage = `Server error: ${response.status} ${response.statusText}`;
    try {
      const errorData = JSON.parse(responseText);
      console.error('Parsed error data:', errorData);

      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      if (responseText && responseText.length < 200) {
        errorMessage = responseText;
      }
    }

    throw new Error(errorMessage);
  }

  try {
    const data = JSON.parse(responseText);
    console.log('Parsed API response:', data);

    // Handle common response formats
    if (data?.data) return data.data as T;
    if (data?.status === 'success') {
      const { status, ...rest } = data;
      return rest as T;
    }
    return data as T;
  } catch (parseError) {
    console.error('Error parsing API response:', parseError);
    throw new Error('Invalid JSON response from server');
  }
}
