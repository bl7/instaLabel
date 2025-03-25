"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { isTokenExpired, logout } from '@/lib/auth'
import { AllergenManager } from '@/components/allergens/AllergenManager'
import { CategoryManager } from '@/components/categories/CategoryManager'
import { IngredientManager } from '@/components/ingredients/IngredientManager'
import { MenuItemCategoryManager } from '@/components/menu-item-categories/MenuItemCategoryManager'
import { MenuItemManager } from '@/components/menu-items/MenuItemManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
  _id: string
  name?: string
  email: string
  subscriptionPlan: string
  subscriptionExpiry?: Date
}

export default function DashboardPage() {
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
            Welcome, {user.name || user.email}! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your allergens and check ingredients
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="allergens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allergens">Allergens</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="menu-item-categories">Menu Item Categories</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allergens" className="space-y-4">
          <AllergenManager />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="menu-item-categories" className="space-y-4">
          <MenuItemCategoryManager />
        </TabsContent>

        <TabsContent value="ingredients" className="space-y-4">
          <IngredientManager />
        </TabsContent>

        <TabsContent value="menu-items" className="space-y-4">
          <MenuItemManager />
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">Subscription Details</h2>
            <div className="mt-4 space-y-2">
              <p className="text-muted-foreground">
                Current Plan: <span className="font-medium text-foreground">{user.subscriptionPlan}</span>
              </p>
              {user.subscriptionExpiry && (
                <p className="text-muted-foreground">
                  Expires: <span className="font-medium text-foreground">
                    {new Date(user.subscriptionExpiry).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 