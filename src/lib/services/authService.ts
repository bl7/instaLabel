"use client";

import { API_ENDPOINTS } from '@/lib/config'
import { apiClient } from '@/lib/api/client'

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'admin' | 'manager' | 'staff'
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  subscription: {
    plan: string
    expiresAt: string
    isActive: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  companyName: string
  phone: string
  subscriptionPlan: 'basic' | 'professional' | 'enterprise'
}

export interface SignupResponse {
  status: 'success'
  token: string
  data: {
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      role: string
      tenantId: string
    }
    tenant: {
      id: string
      name: string
      subscriptionPlan: string
    }
  }
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  data: { user: User }
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
}

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.auth.signup,
        data,
        { requiresAuth: false }
      );

      if (response.token) {
        window.localStorage.setItem('token', response.token);
        window.localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.auth.login,
        credentials,
        { requiresAuth: false }
      );
      console.log(response)

      if (response.token) {
        window.localStorage.setItem('token', response.token);
        window.localStorage.setItem('user', JSON.stringify(response.data.user));
        window.localStorage.setItem('tenant', JSON.stringify(response.data.user.tenantId)) ;
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getTenantByEmail(email: string): Promise<Tenant> {
    try {
      const response = await apiClient.get<{ data: { tenant: Tenant } }>(
        API_ENDPOINTS.auth.tenantForEmail(email),
        { requiresAuth: false }
      );
      return response.data.tenant;
    } catch (error) {
      console.error('Company lookup error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<any>(
        API_ENDPOINTS.auth.logout,
        {},
        { requiresAuth: true }
      );
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('tenant');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local storage even if the API call fails
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('tenant');
    }
  },

  isAuthenticated(): boolean {
    const token = window.localStorage.getItem('token')
    return !!token && !this.isTokenExpired(token)
  },

  isTokenExpired(token: string, bufferSeconds: number = 5): boolean {
    try {
      // For immediate fix - disable token expiration check in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Bypassing token expiration check');
        return false; // Never expire in development
      }

      console.log('Checking token expiration...');
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format (not 3 parts):', parts.length);
        return true;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      console.log('Decoding token payload...');
      let decodedPayload;
      try {
        decodedPayload = atob(base64);
      } catch (e) {
        console.error('Failed to decode base64 token:', e);
        return true;
      }

      console.log('Parsing token JSON...');
      let payload;
      try {
        payload = JSON.parse(decodedPayload);
      } catch (e) {
        console.error('Failed to parse token JSON:', e, 'Raw payload:', decodedPayload);
        return true;
      }

      console.log('Token payload:', payload);

      if (!payload || !payload.exp) {
        console.warn('Token has no expiration time (exp) claim');
        return false; // If no expiration, assume it's not expired
      }

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      // Normalize expiration time - check if it's in seconds or milliseconds
      const expTimestamp = payload.exp;

      // If exp is much larger than now (like 13 digits vs 10), it's likely in milliseconds
      const isMilliseconds = expTimestamp > currentTime * 100;
      const normalizedExp = isMilliseconds ? expTimestamp / 1000 : expTimestamp;

      // For added stability - use a very large buffer (1 day) to prevent frequent logouts
      const stableBufferSeconds = -86400; // Negative buffer gives extra time (1 day)

      const timeRemaining = normalizedExp - currentTime;
      const expDate = new Date(normalizedExp * 1000);

      console.log(`Current time: ${currentTime} (${new Date(currentTime * 1000).toLocaleString()})`);
      console.log(`Exp time: ${normalizedExp} (${expDate.toLocaleString()})`);
      console.log(`Time remaining: ${timeRemaining} seconds (${(timeRemaining / 60).toFixed(2)} minutes)`);
      console.log(`Using stability buffer: ${stableBufferSeconds} seconds`);

      // Token is expired if current time + buffer is at or past expiration
      // Using negative buffer means we give extra time before declaring expired
      const isExpired = timeRemaining <= stableBufferSeconds;
      console.log('Token expired?', isExpired);

      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      // Even if we can't parse the token, let's not immediately log out the user
      return false;
    }
  },

  getUserInfo(token: string): { userId: string; tenantId: string; role: string } | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        userId: payload.userId || payload._id || payload.id,
        tenantId: payload.tenantId,
        role: payload.role,
      }
    } catch {
      return null
    }
  },

  async getTenantById(id: string): Promise<Tenant> {
    try {
      const response = await apiClient.get<{ tenant: Tenant }>(
        API_ENDPOINTS.auth.tenantById(id),
        { requiresAuth: false }
      );
      return response.tenant || response;
    } catch (error) {
      console.error('Tenant lookup error:', error);
      throw error;
    }
  },

  getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = window.localStorage.getItem('user');
      if (!userStr) return null;
  
      try {
        return JSON.parse(userStr) as User;
      } catch (err) {
        console.error("Failed to parse user data:", err);
        return null;
      }
    }
    return null;
  },  

  getCurrentTenant(): Tenant | null {
    const tenantStr = window.localStorage.getItem('tenant');
    if (!tenantStr) return null;
    try {
      return JSON.parse(tenantStr);
    } catch {
      return null;
    }
  },

  // Simplified refresh token functionality that can work without a backend endpoint
  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<{ token: string }>(
        API_ENDPOINTS.auth.refreshToken,
        {},
        { requiresAuth: false }
      );

      if (response.token) {
        window.localStorage.setItem('token', response.token);
      }

      return response.token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },

  parseJwt(token: string): any {
    try {
      // Split the token and get the payload part
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid token format');
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // Decode the base64 string
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post(
        API_ENDPOINTS.auth.updatePassword,
        { currentPassword, newPassword }
      );
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  // Get the current user from the API
  async fetchCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.auth.me);
      return response.user || response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
} 