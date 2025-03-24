"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { MenuItemCategoryManager } from '@/components/menu-item-categories/MenuItemCategoryManager'
import { useAuth } from '@/lib/hooks/useAuth'

export default function MenuItemCategoriesPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="container mx-auto py-6">
        <MenuItemCategoryManager />
      </div>
    </DashboardLayout>
  )
} 