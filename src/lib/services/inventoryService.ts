import { API_ENDPOINTS } from '@/lib/config'
import { Ingredient } from './ingredientService'

export interface InventoryItem {
  _id: string;
  ingredientId: string | Ingredient;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryItemData {
  ingredientId: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
}

export interface UpdateInventoryItemData extends Partial<CreateInventoryItemData> {
  _id: string;
}

export const inventoryService = {
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.inventory.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch inventory items')
    }

    const data = await response.json()
    return data.data?.inventoryItems || []
  },

  async getInventoryItemById(id: string): Promise<InventoryItem> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.inventory.getById(id), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch inventory item')
    }

    const data = await response.json()
    return data.data?.inventoryItem
  },

  async createInventoryItem(itemData: CreateInventoryItemData): Promise<InventoryItem> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.inventory.create, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to create inventory item')
    }

    const data = await response.json()
    return data.data?.inventoryItem
  },

  async updateInventoryItem(id: string, itemData: Partial<CreateInventoryItemData>): Promise<InventoryItem> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.inventory.update(id), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to update inventory item')
    }

    const data = await response.json()
    return data.data?.inventoryItem
  },

  async deleteInventoryItem(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.inventory.delete(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to delete inventory item')
    }
  },

  async getExpiryAlerts(): Promise<InventoryItem[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.expiryAlerts.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch expiry alerts')
    }

    const data = await response.json()
    return data.data?.expiryAlerts || []
  }
} 