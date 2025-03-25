"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { menuItemCategoryService, type MenuItemCategory, type CreateMenuItemCategoryData } from '@/lib/services/menuItemCategoryService'

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  expiryRules: z.object({
    defaultExpiryDays: z.number().min(1, "Default expiry days must be at least 1"),
    requiresRefrigeration: z.boolean(),
    requiresFreezing: z.boolean(),
    notes: z.string().optional(),
  }),
})

export function MenuItemCategoryManager() {
  const [categories, setCategories] = useState<MenuItemCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuItemCategory | null>(null)

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      expiryRules: {
        defaultExpiryDays: 7,
        requiresRefrigeration: false,
        requiresFreezing: false,
        notes: "",
      },
    },
  })

  const fetchCategories = async () => {
    try {
      const data = await menuItemCategoryService.getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const onSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    try {
      if (editingCategory) {
        await menuItemCategoryService.updateCategory({
          _id: editingCategory._id,
          ...values,
        })
        toast.success('Category updated successfully')
      } else {
        await menuItemCategoryService.createCategory(values)
        toast.success('Category created successfully')
      }
      setIsDialogOpen(false)
      form.reset()
      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await menuItemCategoryService.deleteCategory(id)
      toast.success('Category deleted successfully')
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleEdit = (category: MenuItemCategory) => {
    setEditingCategory(category)
    form.reset({
      name: category.name,
      description: category.description || "",
      expiryRules: category.expiryRules,
    })
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return <div>Loading categories...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Item Categories</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? 'Update the category details below.'
                  : 'Fill in the category details below.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <h3 className="font-medium">Expiry Rules</h3>
                  <FormField
                    control={form.control}
                    name="expiryRules.defaultExpiryDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Expiry Days</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryRules.requiresRefrigeration"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Requires Refrigeration</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryRules.requiresFreezing"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Requires Freezing</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryRules.notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingCategory ? 'Update' : 'Add'} Category
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Expiry Rules</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || '-'}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>Expires in {category.expiryRules.defaultExpiryDays} days</div>
                    {category.expiryRules.requiresRefrigeration && (
                      <div className="text-sm text-muted-foreground">Requires refrigeration</div>
                    )}
                    {category.expiryRules.requiresFreezing && (
                      <div className="text-sm text-muted-foreground">Requires freezing</div>
                    )}
                    {category.expiryRules.notes && (
                      <div className="text-sm text-muted-foreground">{category.expiryRules.notes}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category._id)}
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
    </div>
  )
} 