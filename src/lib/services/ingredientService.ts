import { API_ENDPOINTS } from '@/lib/config'

export interface Ingredient {
  _id: string
  ingredientName: string
  category: 'Frozen' | 'Canned' | 'Fresh Produce' | 'Dry Goods' | 'Dairy' | 'Condiments' | 'Other'
  user: string
  createdAt: string
  updatedAt: string
}

export interface CreateIngredientData {
  ingredientName: string
  category: Ingredient['category']
}

export interface UpdateIngredientData extends Partial<CreateIngredientData> {
  _id: string
}

export const ingredientService = {
  async getAllIngredients(): Promise<Ingredient[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.ingredients.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Failed to fetch ingredients')
    }

    return response.json()
  },

  async createIngredient(data: CreateIngredientData): Promise<Ingredient> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.ingredients.create, {
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
      throw new Error(errorData || 'Failed to create ingredient')
    }

    return response.json()
  },

  async updateIngredient(data: UpdateIngredientData): Promise<Ingredient> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.ingredients.update(data._id), {
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
      throw new Error(errorData || 'Failed to update ingredient')
    }

    return response.json()
  },

  async deleteIngredient(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.ingredients.delete(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Failed to delete ingredient')
    }
  }
} 