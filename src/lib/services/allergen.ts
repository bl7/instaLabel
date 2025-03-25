import { API_ENDPOINTS } from '../config'

export interface Allergen {
  _id: string
  allergenName: string
  relatedIngredients: string[]
}

export async function getAllAllergens(): Promise<Allergen[]> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(API_ENDPOINTS.allergens.getAll, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch allergens')
  }

  return response.json()
}

export async function checkIngredient(ingredient: string): Promise<{
  ingredient: string
  allergens: string[]
}> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(`${API_ENDPOINTS.allergens.getAll}/check/${encodeURIComponent(ingredient)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to check ingredient')
  }

  return response.json()
} 