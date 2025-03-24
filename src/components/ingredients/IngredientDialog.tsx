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
import { Ingredient, IngredientCategory } from "@/types/ingredient"

const ingredientFormSchema = z.object({
  ingredientName: z.string().min(1, "Ingredient name is required"),
  category: z.enum([
    "Frozen",
    "Canned",
    "Fresh Produce",
    "Dry Goods",
    "Dairy",
    "Condiments",
    "Other",
  ] as const),
  dateReceived: z.string().min(1, "Date received is required"),
  dateOpened: z.string().optional(),
})

type IngredientFormValues = z.infer<typeof ingredientFormSchema>

interface IngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient?: Ingredient | null
  onSubmit: (data: IngredientFormValues & { _id?: string }) => void
}

export function IngredientDialog({
  open,
  onOpenChange,
  ingredient,
  onSubmit,
}: IngredientDialogProps) {
  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      ingredientName: ingredient?.ingredientName || "",
      category: ingredient?.category || "Other",
      dateReceived: ingredient?.dateReceived ? new Date(ingredient.dateReceived).toISOString().split('T')[0] : "",
      dateOpened: ingredient?.dateOpened ? new Date(ingredient.dateOpened).toISOString().split('T')[0] : "",
    },
  })

  const handleSubmit = (values: IngredientFormValues) => {
    // Convert dates to ISO string format
    const formattedData = {
      ...values,
      dateReceived: new Date(values.dateReceived).toISOString(),
      dateOpened: values.dateOpened ? new Date(values.dateOpened).toISOString() : undefined,
      _id: ingredient?._id,
    }
    onSubmit(formattedData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ingredient ? "Edit Ingredient" : "Add New Ingredient"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ingredientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ingredient name" {...field} />
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
            <FormField
              control={form.control}
              name="dateReceived"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Received</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOpened"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Opened (Optional)</FormLabel>
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
                {ingredient ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 