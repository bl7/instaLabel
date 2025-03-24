import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '@/lib/config'
import { isTokenExpired, logout } from '@/lib/auth'

interface User {
  _id: string
  name?: string
  email: string
  subscriptionPlan: string
  subscriptionExpiry?: Date
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No token found, redirecting to login...')
          router.replace('/login')
          return
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log('Token expired, redirecting to login...')
          await logout()
          router.replace('/login')
          return
        }

        console.log('Fetching user data...')
        const response = await fetch(API_ENDPOINTS.auth.me, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()
        console.log('User data loaded:', userData)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
        await logout()
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  return {
    user,
    isLoading,
    logout: handleLogout,
  }
} 