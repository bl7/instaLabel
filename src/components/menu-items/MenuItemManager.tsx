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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { menuItemService, type MenuItem, type CreateMenuItemData } from '@/lib/services/menuItemService'
import { menuItemCategoryService, type MenuItemCategory } from '@/lib/services/menuItemCategoryService'
import { ingredientService, type Ingredient } from '@/lib/services/ingredientService'
import { type Allergen, getAllAllergens } from '@/lib/services/allergen'
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'

const menuItemFormSchema = z.object({
  menuItemName: z.string().min(1, "Menu item name is required"),
  categoryID: z.string().min(1, "Category is required"),
  ingredients: z.array(z.object({
    ingredientID: z.string().min(1, "Ingredient is required"),
  })).min(1, "At least one ingredient is required"),
})

export function MenuItemManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuItemCategory[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)

  const form = useForm<z.infer<typeof menuItemFormSchema>>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      menuItemName: "",
      categoryID: "",
      ingredients: [{ ingredientID: "" }],
    },
  })

  const fetchData = async () => {
    try {
      const [menuItemsData, categoriesData, ingredientsData, allergensData] = await Promise.all([
        menuItemService.getAllMenuItems(),
        menuItemCategoryService.getAllCategories(),
        ingredientService.getAllIngredients(),
        getAllAllergens(),
      ])
      setMenuItems(menuItemsData)
      setCategories(categoriesData)
      setIngredients(ingredientsData)
      setAllergens(allergensData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onSubmit = async (values: z.infer<typeof menuItemFormSchema>) => {
    try {
      if (editingMenuItem) {
        await menuItemService.updateMenuItem({
          _id: editingMenuItem._id,
          ...values,
        })
        toast.success('Menu item updated successfully')
      } else {
        await menuItemService.createMenuItem(values)
        toast.success('Menu item created successfully')
      }
      setIsDialogOpen(false)
      form.reset()
      setEditingMenuItem(null)
      fetchData()
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save menu item')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      await menuItemService.deleteMenuItem(id)
      toast.success('Menu item deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const handleEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem)
    form.reset({
      menuItemName: menuItem.menuItemName,
      categoryID: menuItem.categoryID._id,
      ingredients: menuItem.ingredients.map(ing => ({
        ingredientID: ing.ingredientID._id,
      })),
    })
    setIsDialogOpen(true)
  }

  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients')
    form.setValue('ingredients', [...currentIngredients, { ingredientID: "" }])
  }

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues('ingredients')
    form.setValue(
      'ingredients',
      currentIngredients.filter((_, i) => i !== index)
    )
  }

  const checkForAllergens = (ingredients: MenuItem['ingredients']): { hasAllergen: boolean; allergenIngredients: string[] } => {
    const allergenIngredients = ingredients
      .filter(ing => allergens.some(allergen => 
        ing.ingredientID.ingredientName.toLowerCase().includes(allergen.allergenName.toLowerCase())
      ))
      .map(ing => ing.ingredientID.ingredientName)

    return {
      hasAllergen: allergenIngredients.length > 0,
      allergenIngredients
    }
  }

  if (isLoading) {
    return <div>Loading menu items...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
              <DialogDescription>
                {editingMenuItem 
                  ? 'Update the menu item details below.'
                  : 'Fill in the menu item details below.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="menuItemName"
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
                  name="categoryID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Ingredients</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                      Add Ingredient
                    </Button>
                  </div>
                  {form.watch('ingredients').map((_, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.ingredientID`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an ingredient" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ingredients.map((ingredient) => (
                                    <SelectItem key={ingredient._id} value={ingredient._id}>
                                      {ingredient.ingredientName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingMenuItem ? 'Update' : 'Add'} Menu Item
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
              <TableHead>Category</TableHead>
              <TableHead>Ingredients</TableHead>
              <TableHead>Allergens</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((menuItem) => {
              const { hasAllergen, allergenIngredients } = checkForAllergens(menuItem.ingredients)
              return (
                <TableRow key={menuItem._id}>
                  <TableCell>{menuItem.menuItemName}</TableCell>
                  <TableCell>
                    {categories.find(c => c._id === menuItem.categoryID._id)?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {menuItem.ingredients.map((ing) => (
                        <li key={ing.ingredientID._id}>
                          {ing.ingredientID.ingredientName}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    {hasAllergen && (
                      <div className="space-y-1">
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Contains Allergen
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {allergenIngredients.join(', ')}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(menuItem)}
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
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 