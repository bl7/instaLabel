import { API_ENDPOINTS } from '@/lib/config'

export interface Subscription {
  _id: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  duration: number; // in days
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const subscriptionService = {
  async getCurrentSubscription(): Promise<Subscription> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.subscriptions.getCurrent, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch current subscription')
    }

    const data = await response.json()
    return data.data?.subscription
  },

  async getAllPlans(): Promise<SubscriptionPlan[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.subscriptions.getAllPlans, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch subscription plans')
    }

    const data = await response.json()
    return data.data?.plans || []
  },

  async subscribeToPlan(planId: string): Promise<Subscription> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.subscriptions.subscribe, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ planId }),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to subscribe to plan')
    }

    const data = await response.json()
    return data.data?.subscription
  },

  async cancelSubscription(): Promise<Subscription> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.subscriptions.cancel, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }

    const data = await response.json()
    return data.data?.subscription
  }
} 