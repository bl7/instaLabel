import { API_ENDPOINTS } from '@/lib/config'
import { Recipe } from './recipeService'

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  recipeId: string | Recipe;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuItemData {
  name: string;
  description?: string;
  recipeId: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface UpdateMenuItemData extends Partial<CreateMenuItemData> {
  _id: string;
}

export const menuService = {
  async getAllMenuItems(): Promise<MenuItem[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItems.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch menu items')
    }

    const data = await response.json()
    return data.data?.menuItems || []
  },

  async getMenuItemById(id: string): Promise<MenuItem> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItems.getById(id), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch menu item')
    }

    const data = await response.json()
    return data.data?.menuItem
  },

  async createMenuItem(menuItemData: CreateMenuItemData): Promise<MenuItem> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItems.create, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(menuItemData),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to create menu item')
    }

    const data = await response.json()
    return data.data?.menuItem
  },

  async updateMenuItem(id: string, menuItemData: Partial<CreateMenuItemData>): Promise<MenuItem> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItems.update(id), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(menuItemData),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to update menu item')
    }

    const data = await response.json()
    return data.data?.menuItem
  },

  async deleteMenuItem(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItems.delete(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to delete menu item')
    }
  }
} 