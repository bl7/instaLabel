"use client"

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Category, getAllCategories } from '@/lib/services/category'
import { toast } from 'sonner'

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
      console.error('Error loading categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading categories...</div>
  }

  return (
    <div className="space-y-8">
      {/* Categories List */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">
                  {category.categoryName}
                </TableCell>
                <TableCell>
                  {new Date(category._id.substring(0, 8)).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 