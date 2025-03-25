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
      console.log('Allergens received in component:', data)
      // Log a sample to verify structure
      if (data.length > 0) {
        console.log('Sample allergen in component:', data[0])
        console.log('Has description?', Boolean(data[0].description))
        console.log('Related ingredients count:', data[0].relatedIngredients ? data[0].relatedIngredients.length : 0)
      }
      setAllergens(data)
    } catch (error: any) {
      console.error('Error loading allergens:', error)
      
      // Only handle authentication errors here, not redirect
      if (error.message === 'No authentication token' || error.message === 'Authentication failed') {
        toast.error('Authentication required. Please log in again.')
      } else {
        toast.error('Failed to load allergens')
      }
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
    } catch (error: any) {
      console.error('Error checking ingredient:', error)
      
      // Handle authentication errors gracefully
      if (error.message === 'No authentication token' || error.message === 'Authentication failed') {
        toast.error('Authentication required. Please log in again.')
      } else {
        toast.error('Failed to check ingredient')
      }
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
        <div className="p-4 flex flex-col space-y-2">
          <h2 className="text-xl font-semibold">Allergens List</h2>
          <p className="text-sm text-muted-foreground">
            Allergen severity is assessed using AI analysis of medical data, ingredient prevalence, and description keywords.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Allergen Name</TableHead>
              <TableHead className="w-1/4">Description</TableHead>
              <TableHead className="w-2/5">Related Ingredients</TableHead>
              <TableHead className="w-1/12">
                <div className="flex items-center space-x-1">
                  <span>Severity</span>
                  <span className="text-xs text-muted-foreground">(AI)</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allergens.map((allergen) => (
              <TableRow key={allergen._id}>
                <TableCell className="font-medium">{allergen.allergenName}</TableCell>
                <TableCell className="text-sm">
                  {allergen.description || <span className="text-muted-foreground italic">No description</span>}
                </TableCell>
                <TableCell>
                  {allergen.relatedIngredients && allergen.relatedIngredients.length > 0 ? (
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
                    <span className="text-muted-foreground italic">No related ingredients</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium 
                    ${allergen.severity === 'high' ? 'bg-red-100 text-red-800' : 
                      allergen.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {allergen.severity === 'high' ? '⚠️ High' : 
                     allergen.severity === 'medium' ? '⚠ Medium' : 
                     '• Low'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 