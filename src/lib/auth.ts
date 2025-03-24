import { API_ENDPOINTS } from './config'

export async function logout() {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      // Call logout endpoint if you have one
      // await fetch(API_ENDPOINTS.auth.logout, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   credentials: 'include'
      // })
      
      // Clear local storage
      localStorage.removeItem('token')
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiryTime = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expiryTime
  } catch {
    return true
  }
}

export async function handleTokenError() {
  await logout()
  window.location.href = '/login'
} 