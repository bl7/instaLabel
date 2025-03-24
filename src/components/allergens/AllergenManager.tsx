"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Allergen, getAllAllergens, checkIngredient } from '@/lib/services/allergen'
import { toast } from 'sonner'

export function AllergenManager() {
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ingredient, setIngredient] = useState('')
  const [checkedAllergens, setCheckedAllergens] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    loadAllergens()
  }, [])

  async function loadAllergens() {
    try {
      const data = await getAllAllergens()
      setAllergens(data)
    } catch (error) {
      toast.error('Failed to load allergens')
      console.error('Error loading allergens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCheckIngredient(e: React.FormEvent) {
    e.preventDefault()
    if (!ingredient.trim()) return

    setIsChecking(true)
    try {
      const result = await checkIngredient(ingredient.trim())
      setCheckedAllergens(result.allergens)
      
      if (result.allergens.length === 0) {
        toast.success('No allergens found for this ingredient')
      } else {
        toast.warning(`Found ${result.allergens.length} allergen(s)!`)
      }
    } catch (error) {
      toast.error('Failed to check ingredient')
      console.error('Error checking ingredient:', error)
    } finally {
      setIsChecking(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading allergens...</div>
  }

  return (
    <div className="space-y-8">
      {/* Ingredient Checker */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Check Ingredient</h2>
        <form onSubmit={handleCheckIngredient} className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter ingredient name"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" disabled={isChecking || !ingredient.trim()}>
              {isChecking ? 'Checking...' : 'Check'}
            </Button>
          </div>
          {checkedAllergens.length > 0 && (
            <div className="mt-4 rounded-md bg-warning/10 p-4">
              <p className="font-medium text-warning">
                ⚠️ This ingredient may contain the following allergens:
              </p>
              <ul className="mt-2 list-inside list-disc">
                {checkedAllergens.map((allergen) => (
                  <li key={allergen}>{allergen}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>

      {/* Allergens List */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Allergen Name</TableHead>
              <TableHead>Related Ingredients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allergens.map((allergen) => (
              <TableRow key={allergen._id}>
                <TableCell className="font-medium">{allergen.allergenName}</TableCell>
                <TableCell>
                  {allergen.relatedIngredients.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {allergen.relatedIngredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="rounded-full bg-muted px-2 py-1 text-xs"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No related ingredients</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 