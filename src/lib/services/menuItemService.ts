import { API_ENDPOINTS } from '@/lib/config'
import { type Ingredient } from './ingredientService'

export interface MenuItem {
  _id: string
  menuItemName: string
  categoryID: {
    _id: string
    name: string
  }
  ingredients: {
    ingredientID: Ingredient
  }[]
  user: string
  createdAt: string
  updatedAt: string
}

export interface CreateMenuItemData {
  menuItemName: string
  categoryID: string
  ingredients: {
    ingredientID: string
  }[]
}

export interface UpdateMenuItemData extends CreateMenuItemData {
  _id: string
}

export const menuItemService = {
  async getAllMenuItems(): Promise<MenuItem[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItems.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Failed to fetch menu items')
    }

    return response.json()
  },

  async createMenuItem(data: CreateMenuItemData): Promise<MenuItem> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    console.log('Sending menu item data:', data)

    const response = await fetch(API_ENDPOINTS.menuItems.create, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Backend error:', errorData)
      throw new Error(errorData || 'Failed to create menu item')
    }

    return response.json()
  },

  async updateMenuItem(data: UpdateMenuItemData): Promise<MenuItem> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItems.update(data._id), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Failed to update menu item')
    }

    return response.json()
  },

  async deleteMenuItem(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItems.delete(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Failed to delete menu item')
    }
  }
} 