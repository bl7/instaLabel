"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AllergenManager } from '@/components/allergens/AllergenManager'
import { CategoryManager } from '@/components/categories/CategoryManager'
import { IngredientManager } from '@/components/ingredients/IngredientManager'
import { MenuItemCategoryManager } from '@/components/menu-item-categories/MenuItemCategoryManager'
import { MenuItemManager } from '@/components/menu-items/MenuItemManager'
import { authService } from '@/lib/services/authService'

export default function DashboardPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('allergens')
  
  // Get user and tenant from service
  const user = authService.getCurrentUser()
  const tenant = authService.getCurrentTenant()
  console.log('user', user?.firstName)
  console.log('tenantStr', window.localStorage.getItem('tenant'))

  // Handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  const handleLogout = async () => {
    await authService.logout()
    router.push('/login')
  }

  // Auth check handled directly
  const isAuthenticated = authService.isAuthenticated()
  console.log('isAuthenticated', isAuthenticated)
  if (!isAuthenticated || !user) {
    // Redirect to login page
    router.push('/login')
    return null
  }

  return (
    <div className="flex">
      {/* Side Navigation */}
      <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                className={`block text-lg p-2 rounded ${activeSection === 'allergens' ? 'bg-gray-600' : ''}`}
                onClick={() => handleSectionChange('allergens')}
              >
                Allergens
              </button>
            </li>
            <li>
              <button
                className={`block text-lg p-2 rounded ${activeSection === 'categories' ? 'bg-gray-600' : ''}`}
                onClick={() => handleSectionChange('categories')}
              >
                Categories
              </button>
            </li>
            <li>
              <button
                className={`block text-lg p-2 rounded ${activeSection === 'menu-item-categories' ? 'bg-gray-600' : ''}`}
                onClick={() => handleSectionChange('menu-item-categories')}
              >
                Menu Item Categories
              </button>
            </li>
            <li>
              <button
                className={`block text-lg p-2 rounded ${activeSection === 'ingredients' ? 'bg-gray-600' : ''}`}
                onClick={() => handleSectionChange('ingredients')}
              >
                Ingredients
              </button>
            </li>
            <li>
              <button
                className={`block text-lg p-2 rounded ${activeSection === 'menu-items' ? 'bg-gray-600' : ''}`}
                onClick={() => handleSectionChange('menu-items')}
              >
                Menu Items
              </button>
            </li>
            <li>
              <button
                className={`block text-lg p-2 rounded ${activeSection === 'subscription' ? 'bg-gray-600' : ''}`}
                onClick={() => handleSectionChange('subscription')}
              >
                Subscription
              </button>
            </li>
          </ul>
        </nav>
        <Button variant="outline" onClick={handleLogout} className="mt-8">
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user.firstName}! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your allergens and check ingredients
          </p>
        </div>

        {/* Render Content Based on Active Section */}
        {activeSection === 'allergens' && <AllergenManager />}
        {activeSection === 'categories' && <CategoryManager />}
        {activeSection === 'menu-item-categories' && <MenuItemCategoryManager />}
        {activeSection === 'ingredients' && <IngredientManager />}
        {activeSection === 'menu-items' && <MenuItemManager />}
        {activeSection === 'subscription' && (
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
        )}
      </div>
    </div>
  )
}
