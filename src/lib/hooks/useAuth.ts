import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { authService, type User, type Tenant } from '@/lib/services/authService'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        
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

        const tenantFromApi = await authService.getTenantById(userInfo.tenantId)
        setTenant(tenantFromApi)

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
