import { API_ENDPOINTS } from '@/lib/config'
import { apiClient } from '@/lib/api/client'
import { Allergen } from './allergenService'

export interface Ingredient {
  _id: string;
  name: string;
  description?: string;
  allergens: string[];
  categoryId: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    servingSize?: string;
  };
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIngredientData {
  name: string;
  description?: string;
  allergens?: string[];
  categoryId?: string;
  cost?: number;
  unit?: string;
}

export interface UpdateIngredientData extends Partial<CreateIngredientData> {
  _id: string;
}

// Mock data for development
const mockIngredients: Ingredient[] = [
  {
    _id: 'mock-ingredient-1',
    name: 'Wheat Flour',
    description: 'All-purpose wheat flour',
    allergens: ['mock-allergen-1'], // Gluten
    categoryId: 'mock-category-1',
    tenantId: 'mock-tenant-1',
    nutritionalInfo: {
      calories: 364,
      protein: 10,
      carbs: 76,
      fat: 1,
      servingSize: '100g'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-ingredient-2',
    name: 'Milk',
    description: 'Whole milk',
    allergens: ['mock-allergen-2'], // Dairy
    categoryId: 'mock-category-2',
    tenantId: 'mock-tenant-1',
    nutritionalInfo: {
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.6,
      servingSize: '100ml'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-ingredient-3',
    name: 'Peanuts',
    description: 'Roasted peanuts',
    allergens: ['mock-allergen-3'], // Nuts
    categoryId: 'mock-category-3',
    tenantId: 'mock-tenant-1',
    nutritionalInfo: {
      calories: 567,
      protein: 25.8,
      carbs: 16.1,
      fat: 49.2,
      servingSize: '100g'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const ingredientService = {
  async getAllIngredients(): Promise<Ingredient[]> {
    try {
      const data = await apiClient.get<{ ingredients: Ingredient[] }>(API_ENDPOINTS.ingredients.getAll);
      return Array.isArray(data) ? data : data.ingredients || [];
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock ingredients data');
        return mockIngredients;
      }
      return [];
    }
  },

  async getIngredientById(id: string): Promise<Ingredient> {
    try {
      const data = await apiClient.get<{ ingredient: Ingredient }>(API_ENDPOINTS.ingredients.getById(id));
      return data.ingredient || data;
    } catch (error) {
      console.error(`Failed to fetch ingredient with ID ${id}:`, error);
      if (process.env.NODE_ENV === 'development') {
        const mockIngredient = mockIngredients.find(i => i._id === id);
        if (mockIngredient) return mockIngredient;
      }
      throw error;
    }
  },

  async getIngredientsByAllergen(allergenId: string): Promise<Ingredient[]> {
    try {
      const data = await apiClient.get<{ ingredients: Ingredient[] }>(
        API_ENDPOINTS.ingredients.getByAllergen(allergenId)
      );
      return Array.isArray(data) ? data : data.ingredients || [];
    } catch (error) {
      console.error(`Failed to fetch ingredients for allergen ${allergenId}:`, error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock ingredients data for allergen');
        return mockIngredients.filter(i => i.allergens.includes(allergenId));
      }
      return [];
    }
  },

  async getIngredientsByCategory(categoryId: string): Promise<Ingredient[]> {
    try {
      const data = await apiClient.get<{ ingredients: Ingredient[] }>(
        API_ENDPOINTS.ingredients.getByCategory(categoryId)
      );
      return Array.isArray(data) ? data : data.ingredients || [];
    } catch (error) {
      console.error(`Failed to fetch ingredients for category ${categoryId}:`, error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock ingredients data for category');
        return mockIngredients.filter(i => i.categoryId === categoryId);
      }
      return [];
    }
  },

  async createIngredient(ingredientData: Omit<Ingredient, '_id' | 'createdAt' | 'updatedAt'>): Promise<Ingredient> {
    try {
      const data = await apiClient.post<{ ingredient: Ingredient }>(
        API_ENDPOINTS.ingredients.create,
        ingredientData
      );
      return data.ingredient || data;
    } catch (error) {
      console.error('Failed to create ingredient:', error);
      throw error;
    }
  },

  async updateIngredient(id: string, ingredientData: Partial<Ingredient>): Promise<Ingredient> {
    try {
      const data = await apiClient.put<{ ingredient: Ingredient }>(
        API_ENDPOINTS.ingredients.update(id),
        ingredientData
      );
      return data.ingredient || data;
    } catch (error) {
      console.error(`Failed to update ingredient with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteIngredient(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.ingredients.delete(id));
    } catch (error) {
      console.error(`Failed to delete ingredient with ID ${id}:`, error);
      throw error;
    }
  }
}; 