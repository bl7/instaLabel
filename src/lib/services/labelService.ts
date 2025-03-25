import { API_ENDPOINTS } from '@/lib/config'
import { Recipe } from './recipeService'

export interface Label {
  _id: string;
  name: string;
  recipeId: string | Recipe;
  qrCode?: string;
  generatedCode?: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLabelData {
  name: string;
  recipeId: string;
}

export interface UpdateLabelData extends Partial<CreateLabelData> {
  _id: string;
}

export const labelService = {
  async getAllLabels(): Promise<Label[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.labels.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch labels')
    }

    const data = await response.json()
    return data.data?.labels || []
  },

  async getLabelById(id: string): Promise<Label> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.labels.getById(id), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch label')
    }

    const data = await response.json()
    return data.data?.label
  },

  async createLabel(labelData: CreateLabelData): Promise<Label> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.labels.create, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(labelData),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to create label')
    }

    const data = await response.json()
    return data.data?.label
  },

  async updateLabel(id: string, labelData: Partial<CreateLabelData>): Promise<Label> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.labels.update(id), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(labelData),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to update label')
    }

    const data = await response.json()
    return data.data?.label
  },

  async deleteLabel(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.labels.delete(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to delete label')
    }
  },

  async generateQRCode(id: string): Promise<string> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.labels.generateQR(id), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to generate QR code')
    }

    const data = await response.json()
    return data.data?.qrCode || ''
  }
} 