import { API_BASE_URL } from '../config';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = API_BASE_URL;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getHeaders(requiresAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'An error occurred');
    }
    return response.json();
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...restOptions } = options;
    const cleanEndpoint = endpoint.startsWith(this.baseUrl) ? endpoint.slice(this.baseUrl.length) : endpoint;
    const response = await fetch(`${this.baseUrl}${cleanEndpoint}`, {
      method: 'GET',
      headers: this.getHeaders(requiresAuth),
      credentials: 'include',
      mode: 'cors',
      ...restOptions,
    });
    return this.handleResponse(response);
  }

  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...restOptions } = options;
    const cleanEndpoint = endpoint.startsWith(this.baseUrl) ? endpoint.slice(this.baseUrl.length) : endpoint;
    const response = await fetch(`${this.baseUrl}${cleanEndpoint}`, {
      method: 'POST',
      headers: this.getHeaders(requiresAuth),
      body: JSON.stringify(data),
      credentials: 'include',
      mode: 'cors',
      ...restOptions,
    });
    return this.handleResponse(response);
  }

  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...restOptions } = options;
    const cleanEndpoint = endpoint.startsWith(this.baseUrl) ? endpoint.slice(this.baseUrl.length) : endpoint;
    const response = await fetch(`${this.baseUrl}${cleanEndpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(requiresAuth),
      body: JSON.stringify(data),
      credentials: 'include',
      mode: 'cors',
      ...restOptions,
    });
    return this.handleResponse(response);
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...restOptions } = options;
    const cleanEndpoint = endpoint.startsWith(this.baseUrl) ? endpoint.slice(this.baseUrl.length) : endpoint;
    const response = await fetch(`${this.baseUrl}${cleanEndpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(requiresAuth),
      credentials: 'include',
      mode: 'cors',
      ...restOptions,
    });
    return this.handleResponse(response);
  }
}

export const apiClient = ApiClient.getInstance(); 