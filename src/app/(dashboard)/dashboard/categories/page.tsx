"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '@/lib/config'
import { isTokenExpired, logout } from '@/lib/auth'
import { CategoryManager } from '@/components/categories/CategoryManager'
import { authService } from '@/lib/services/authService'

interface User {
  _id: string
  name?: string
  firstName?: string
  lastName?: string
  email: string
  subscriptionPlan?: string
  subscriptionExpiry?: Date
}

export default function CategoriesPage() {
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
        try {
          const response = await fetch(API_ENDPOINTS.auth.me, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
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
          console.error('Error fetching user data from API:', error)
          
          // Fallback to local storage if API fails
          const storedUser = authService.getCurrentUser()
          if (storedUser) {
            console.log('Using stored user data:', storedUser)
            setUser(storedUser)
          } else {
            throw new Error('No user data available')
          }
        }
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Prevent flash before redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user.firstName}! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Organize your ingredients into categories
          </p>
        </div>
        <button onClick={handleLogout} className="text-lg text-red-600">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <CategoryManager />
      </div>
    </div>
  )
}
