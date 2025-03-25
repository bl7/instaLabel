import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService, type User, type Tenant } from '@/lib/services/authService'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        
        if (!token) {
          console.log('No token found, redirecting to login...')
          router.replace('/login')
          return
        }

        // Check if token is expired
        if (authService.isTokenExpired(token)) {
          console.log('Token expired, redirecting to login...')
          await authService.logout()
          router.replace('/login')
          return
        }

        // Get user info from token
        const userInfo = authService.getUserInfo(token)
        
        if (!userInfo) {
          console.log('Invalid token, redirecting to login...')
          await authService.logout()
          router.replace('/login')
          return
        }

        // Set user data from stored token (to avoid additional API call)
        // In a real application, you might want to fetch the user data from the API
        // to ensure it's up to date
        
        // This is a placeholder since we don't have the complete user data in the token
        // You might want to replace this with an API call to get the complete user data
        setUser({
          _id: userInfo.userId,
          email: '',  // We don't have this in the token
          name: '',   // We don't have this in the token
          role: userInfo.role as 'admin' | 'manager' | 'staff',
          tenantId: userInfo.tenantId,
          createdAt: '',
          updatedAt: '',
        })
      } catch (error) {
        console.error('Error checking auth status:', error)
        await authService.logout()
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [router])

  const handleLogout = async () => {
    await authService.logout()
    router.replace('/login')
  }

  return {
    user,
    tenant,
    isLoading,
    isAuthenticated: !!user,
    logout: handleLogout,
  }
} 