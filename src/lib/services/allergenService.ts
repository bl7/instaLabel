import { API_ENDPOINTS } from '@/lib/config'

export interface Allergen {
  _id: string
  allergenName: string
  user: string
  createdAt: string
  updatedAt: string
}

export const allergenService = {
  async getAllAllergens(): Promise<Allergen[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

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
  },
} 