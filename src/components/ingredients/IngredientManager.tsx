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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ingredientService, type Ingredient, type CreateIngredientData } from '@/lib/services/ingredientService'
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from 'lucide-react'
import { menuItemCategoryService } from '@/lib/services/menuItemCategoryService'
import { allergenService } from '@/lib/services/allergenService'

const ingredientFormSchema = z.object({
  ingredientName: z.string().min(1, "Ingredient name is required"),
  category: z.enum(["Frozen", "Canned", "Fresh Produce", "Dry Goods", "Dairy", "Condiments", "Other"]),
})

export function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [allergens, setAllergens] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)

  const form = useForm<z.infer<typeof ingredientFormSchema>>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      ingredientName: "",
      category: "Other",
    },
  })

  const fetchData = async () => {
    try {
      const [ingredientsData, categoriesData, allergensData] = await Promise.all([
        ingredientService.getAllIngredients(),
        menuItemCategoryService.getAllCategories(),
        allergenService.getAllAllergens(),
      ])
      setIngredients(ingredientsData)
      setCategories(categoriesData)
      setAllergens(allergensData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onSubmit = async (values: z.infer<typeof ingredientFormSchema>) => {
    try {
      if (editingIngredient) {
        await ingredientService.updateIngredient({
          _id: editingIngredient._id,
          ...values,
        })
        toast.success('Ingredient updated successfully')
      } else {
        await ingredientService.createIngredient(values)
        toast.success('Ingredient added successfully')
      }
      setIsDialogOpen(false)
      form.reset()
      setEditingIngredient(null)
      fetchData()
    } catch (error) {
      console.error('Error saving ingredient:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save ingredient')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return

    try {
      await ingredientService.deleteIngredient(id)
      toast.success('Ingredient deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting ingredient:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete ingredient')
    }
  }

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    form.reset({
      ingredientName: ingredient.ingredientName,
      category: ingredient.category,
    })
    setIsDialogOpen(true)
  }

  const checkForAllergens = (ingredientName: string): boolean => {
    return allergens.some(allergen => 
      ingredientName.toLowerCase().includes(allergen.allergenName.toLowerCase())
    )
  }

  if (isLoading) {
    return <div>Loading ingredients...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ingredients</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
              <DialogDescription>
                {editingIngredient 
                  ? 'Update the ingredient details below.'
                  : 'Fill in the ingredient details below.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ingredientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredient Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
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
                          <SelectItem value="Frozen">Frozen</SelectItem>
                          <SelectItem value="Canned">Canned</SelectItem>
                          <SelectItem value="Fresh Produce">Fresh Produce</SelectItem>
                          <SelectItem value="Dry Goods">Dry Goods</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Condiments">Condiments</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingIngredient ? 'Update' : 'Add'} Ingredient
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
              <TableHead>Allergens</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient._id}>
                <TableCell>{ingredient.ingredientName}</TableCell>
                <TableCell>{ingredient.category}</TableCell>
                <TableCell>
                  {checkForAllergens(ingredient.ingredientName) && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Contains Allergen
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(ingredient)}
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