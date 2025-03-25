import { API_ENDPOINTS } from '@/lib/config'

export interface MenuItemCategory {
  _id: string
  name: string
  description?: string
  expiryRules: {
    defaultExpiryDays: number
    requiresRefrigeration: boolean
    requiresFreezing: boolean
    notes?: string
  }
  user: string
  createdAt: string
  updatedAt: string
}

export interface CreateMenuItemCategoryData {
  name: string
  description?: string
  expiryRules: {
    defaultExpiryDays: number
    requiresRefrigeration: boolean
    requiresFreezing: boolean
    notes?: string
  }
}

export interface UpdateMenuItemCategoryData extends CreateMenuItemCategoryData {
  _id: string
}

export const menuItemCategoryService = {
  async getAllCategories(): Promise<MenuItemCategory[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItemCategories.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server response:', errorText)
      throw new Error('Failed to fetch categories')
    }

    return response.json()
  },

  async createCategory(data: CreateMenuItemCategoryData): Promise<MenuItemCategory> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    console.log('Creating category with data:', JSON.stringify(data, null, 2))

    const response = await fetch(API_ENDPOINTS.menuItemCategories.create, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server response:', errorText)
      throw new Error(errorText || 'Failed to create category')
    }

    return response.json()
  },

  async updateCategory(data: UpdateMenuItemCategoryData): Promise<MenuItemCategory> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    console.log('Updating category with data:', JSON.stringify(data, null, 2))

    const response = await fetch(API_ENDPOINTS.menuItemCategories.update(data._id), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server response:', errorText)
      throw new Error(errorText || 'Failed to update category')
    }

    return response.json()
  },

  async deleteCategory(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.menuItemCategories.delete(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server response:', errorText)
      throw new Error(errorText || 'Failed to delete category')
    }
  },
} 