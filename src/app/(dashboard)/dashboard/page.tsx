"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AllergenManager } from '@/components/allergens/AllergenManager'
import { CategoryManager } from '@/components/categories/CategoryManager'
import { IngredientManager } from '@/components/ingredients/IngredientManager'
import { MenuItemCategoryManager } from '@/components/menu-item-categories/MenuItemCategoryManager'
import { MenuItemManager } from '@/components/menu-items/MenuItemManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authService } from '@/lib/services/authService'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('allergens')
  
  // Get user and tenant from service
  const user = authService.getCurrentUser()
  const tenant = authService.getCurrentTenant()
  
  // Handle tab change without triggering API calls for unselected tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleLogout = async () => {
    await authService.logout()
    router.push('/login')
  }

  // Auth check handled directly
  const isAuthenticated = authService.isAuthenticated()
  if (!isAuthenticated || !user) {
    // Redirect to login page
    router.push('/login')
    return null
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
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="allergens">Allergens</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="menu-item-categories">Menu Item Categories</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        {/* Only render content for active tab to prevent unnecessary API calls */}
        {activeTab === 'allergens' && (
          <TabsContent value="allergens" className="space-y-4">
            <AllergenManager />
          </TabsContent>
        )}

        {activeTab === 'categories' && (
          <TabsContent value="categories" className="space-y-4">
            <CategoryManager />
          </TabsContent>
        )}

        {activeTab === 'menu-item-categories' && (
          <TabsContent value="menu-item-categories" className="space-y-4">
            <MenuItemCategoryManager />
          </TabsContent>
        )}

        {activeTab === 'ingredients' && (
          <TabsContent value="ingredients" className="space-y-4">
            <IngredientManager />
          </TabsContent>
        )}

        {activeTab === 'menu-items' && (
          <TabsContent value="menu-items" className="space-y-4">
            <MenuItemManager />
          </TabsContent>
        )}
        
        {activeTab === 'subscription' && (
          <TabsContent value="subscription" className="space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold">Subscription Details</h2>
              <div className="mt-4 space-y-2">
                <p className="text-muted-foreground">
                  Current Plan: <span className="font-medium text-foreground">
                    {tenant?.subscription?.plan || 'Basic'}
                  </span>
                </p>
                {tenant?.subscription?.expiresAt && (
                  <p className="text-muted-foreground">
                    Expires: <span className="font-medium text-foreground">
                      {new Date(tenant.subscription.expiresAt).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
} 