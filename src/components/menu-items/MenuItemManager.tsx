"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { MenuItem, MenuItemCategory, MenuItemAllergen } from "@/types/menuItem"
import { MenuItemDialog } from "./MenuItemDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { API_ENDPOINTS } from "@/lib/api"

export function MenuItemManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuItemCategory[]>([])
  const [allergens, setAllergens] = useState<MenuItemAllergen[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
    fetchAllergens()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to view menu items')
        return
      }

      const response = await fetch(API_ENDPOINTS.menuItems.getAll, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', errorData)
        throw new Error(errorData?.message || `Failed to fetch menu items with status ${response.status}`)
      }

      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch menu items')
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to view categories')
        return
      }

      const response = await fetch(API_ENDPOINTS.categories.getAll, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', errorData)
        throw new Error(errorData?.message || `Failed to fetch categories with status ${response.status}`)
      }

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch categories')
    }
  }

  const fetchAllergens = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to view allergens')
        return
      }

      const response = await fetch(API_ENDPOINTS.allergens.getAll, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', errorData)
        throw new Error(errorData?.message || `Failed to fetch allergens with status ${response.status}`)
      }

      const data = await response.json()
      setAllergens(data)
    } catch (error) {
      console.error('Error fetching allergens:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch allergens')
    }
  }

  const handleCreate = async (data: CreateMenuItemData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to create menu items')
        return
      }

      console.log('Creating menu item with data:', data)
      console.log('Request URL:', API_ENDPOINTS.menuItems.create)
      console.log('Request headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      })

      const response = await fetch(API_ENDPOINTS.menuItems.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', errorData)
        throw new Error(errorData?.message || `Failed to create menu item with status ${response.status}`)
      }

      const responseData = await response.json()
      console.log('Success response:', responseData)

      toast.success('Menu item created successfully')
      setIsDialogOpen(false)
      fetchMenuItems()
    } catch (error) {
      console.error('Error creating menu item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create menu item')
    }
  }

  const handleUpdate = async (data: CreateMenuItemData & { _id: string }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to update menu items')
        return
      }

      const response = await fetch(API_ENDPOINTS.menuItems.update(data._id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', errorData)
        throw new Error(errorData?.message || `Failed to update menu item with status ${response.status}`)
      }

      const responseData = await response.json()
      console.log('Success response:', responseData)

      toast.success('Menu item updated successfully')
      setIsDialogOpen(false)
      setEditingMenuItem(null)
      fetchMenuItems()
    } catch (error) {
      console.error('Error updating menu item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update menu item')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to delete menu items')
        return
      }

      const response = await fetch(API_ENDPOINTS.menuItems.delete(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', errorData)
        throw new Error(errorData?.message || `Failed to delete menu item with status ${response.status}`)
      }

      const responseData = await response.json()
      console.log('Success response:', responseData)

      toast.success('Menu item deleted successfully')
      fetchMenuItems()
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete menu item')
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId)
    return category?.name || 'Unknown Category'
  }

  const getAllergenName = (allergenId?: string) => {
    if (!allergenId) return 'None'
    const allergen = allergens.find(a => a._id === allergenId)
    return allergen?.name || 'Unknown Allergen'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Allergen</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((menuItem) => (
              <TableRow key={menuItem._id}>
                <TableCell>{menuItem.menuItemName}</TableCell>
                <TableCell>{getCategoryName(menuItem.categoryID)}</TableCell>
                <TableCell>{getAllergenName(menuItem.allergenID)}</TableCell>
                <TableCell>{new Date(menuItem.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingMenuItem(menuItem)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(menuItem._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <MenuItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        menuItem={editingMenuItem}
        categories={categories}
        allergens={allergens}
        onSubmit={editingMenuItem ? handleUpdate : handleCreate}
      />
    </div>
  )
} 