"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { API_ENDPOINTS } from "@/lib/config"
import { Ingredient, CreateIngredientData } from "@/types/ingredient"
import { toast } from "sonner"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { IngredientDialog } from "./IngredientDialog"

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)

  const fetchIngredients = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.ingredients.list, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch ingredients')
      }

      const data = await response.json()
      setIngredients(data)
    } catch (error) {
      console.error('Error fetching ingredients:', error)
      toast.error('Failed to load ingredients')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [])

  const handleCreate = async (data: CreateIngredientData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to create ingredients')
        return
      }

      console.log('Creating ingredient with data:', data)
      console.log('Request URL:', API_ENDPOINTS.ingredients.create)
      console.log('Request headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      })

      const response = await fetch(API_ENDPOINTS.ingredients.create, {
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
        throw new Error(errorData?.message || `Failed to create ingredient with status ${response.status}`)
      }

      const responseData = await response.json()
      console.log('Success response:', responseData)

      toast.success('Ingredient created successfully')
      setIsDialogOpen(false)
      fetchIngredients()
    } catch (error) {
      console.error('Error creating ingredient:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create ingredient')
    }
  }

  const handleUpdate = async (data: CreateIngredientData & { _id: string }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to update ingredients')
        return
      }

      const response = await fetch(API_ENDPOINTS.ingredients.update(data._id), {
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
        throw new Error(errorData?.message || `Failed to update ingredient with status ${response.status}`)
      }

      const responseData = await response.json()
      console.log('Success response:', responseData)

      toast.success('Ingredient updated successfully')
      setIsDialogOpen(false)
      setEditingIngredient(null)
      fetchIngredients()
    } catch (error) {
      console.error('Error updating ingredient:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update ingredient')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to delete ingredients')
        return
      }

      const response = await fetch(API_ENDPOINTS.ingredients.delete(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', errorData)
        throw new Error(errorData?.message || `Failed to delete ingredient with status ${response.status}`)
      }

      const responseData = await response.json()
      console.log('Success response:', responseData)

      toast.success('Ingredient deleted successfully')
      fetchIngredients()
    } catch (error) {
      console.error('Error deleting ingredient:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete ingredient')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ingredients</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date Received</TableHead>
              <TableHead>Date Opened</TableHead>
              <TableHead>Use By Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient._id}>
                <TableCell>{ingredient.ingredientName}</TableCell>
                <TableCell>{ingredient.category}</TableCell>
                <TableCell>{formatDate(ingredient.dateReceived)}</TableCell>
                <TableCell>{formatDate(ingredient.dateOpened)}</TableCell>
                <TableCell>{formatDate(ingredient.useByDate)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingIngredient(ingredient)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(ingredient._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <IngredientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        ingredient={editingIngredient}
        onSubmit={editingIngredient ? handleUpdate : handleCreate}
      />
    </div>
  )
} 