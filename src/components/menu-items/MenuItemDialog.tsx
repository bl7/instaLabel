"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { MenuItem, MenuItemCategory, MenuItemAllergen } from "@/types/menuItem"

const menuItemFormSchema = z.object({
  menuItemName: z.string().min(1, "Menu item name is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  categoryID: z.string().min(1, "Category is required"),
  allergenID: z.string().optional(),
})

type MenuItemFormValues = z.infer<typeof menuItemFormSchema>

interface MenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuItem?: MenuItem | null
  categories: MenuItemCategory[]
  allergens: MenuItemAllergen[]
  onSubmit: (data: MenuItemFormValues & { _id?: string }) => void
}

export function MenuItemDialog({
  open,
  onOpenChange,
  menuItem,
  categories,
  allergens,
  onSubmit,
}: MenuItemDialogProps) {
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      menuItemName: menuItem?.menuItemName || "",
      expiryDate: menuItem?.expiryDate ? new Date(menuItem.expiryDate).toISOString().split('T')[0] : "",
      categoryID: menuItem?.categoryID || "",
      allergenID: menuItem?.allergenID || "",
    },
  })

  const handleSubmit = (values: MenuItemFormValues) => {
    // Convert dates to ISO string format
    const formattedData = {
      ...values,
      expiryDate: new Date(values.expiryDate).toISOString(),
      _id: menuItem?._id,
    }
    onSubmit(formattedData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {menuItem ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="menuItemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter menu item name" {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            <FormField
              control={form.control}
              name="allergenID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergen (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an allergen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allergens.map((allergen) => (
                        <SelectItem key={allergen._id} value={allergen._id}>
                          {allergen.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {menuItem ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 