"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { MenuItemCategoryManager } from '@/components/menu-item-categories/MenuItemCategoryManager'
import { authService } from '@/lib/services/authService'

export default function MenuItemCategoriesPage() {
  const router = useRouter()
  const user = authService.getCurrentUser()
  
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user} onLogout={() => {
      authService.logout();
      router.push('/login');
    }}>
      <div className="container mx-auto py-6">
        <MenuItemCategoryManager />
      </div>
    </DashboardLayout>
  )
} 