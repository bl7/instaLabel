import { API_ENDPOINTS } from '@/lib/config'
import { Ingredient } from './ingredientService'

export interface RecipeIngredient {
  ingredient: string | Ingredient;
  quantity: number;
  unit?: string;
}

export interface Recipe {
  _id: string;
  name: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions?: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecipeData {
  name: string;
  description?: string;
  ingredients: {
    ingredient: string;
    quantity: number;
    unit?: string;
  }[];
  instructions?: string;
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  _id: string;
}

export const recipeService = {
  async getAllRecipes(): Promise<Recipe[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.recipes.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch recipes')
    }

    const data = await response.json()
    return data.data?.recipes || []
  },

  async getRecipeById(id: string): Promise<Recipe> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.recipes.getById(id), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch recipe')
    }

    const data = await response.json()
    return data.data?.recipe
  },

  async createRecipe(recipeData: CreateRecipeData): Promise<Recipe> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.recipes.create, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to create recipe')
    }

    const data = await response.json()
    return data.data?.recipe
  },

  async updateRecipe(id: string, recipeData: Partial<CreateRecipeData>): Promise<Recipe> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.recipes.update(id), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to update recipe')
    }

    const data = await response.json()
    return data.data?.recipe
  },

  async deleteRecipe(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(API_ENDPOINTS.recipes.delete(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to delete recipe')
    }
  }
} 