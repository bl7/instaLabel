import { API_BASE_URL } from '../config'

export interface Category {
  _id: string
  categoryName: string
}

export async function getAllCategories(): Promise<Category[]> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(`${API_BASE_URL}/api/category`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    // credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
} 