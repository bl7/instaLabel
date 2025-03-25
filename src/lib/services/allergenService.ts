import { API_ENDPOINTS } from '@/lib/config'
import { apiClient } from '@/lib/api/client'

export interface Allergen {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  severity?: 'low' | 'medium' | 'high';
  isSystemLevel?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper to add frontend-only severity to allergens
const addFrontendSeverity = (allergen: Partial<Allergen>): Allergen => {
  // Assign severity based on name if not already present (simple example logic)
  if (!allergen.severity) {
    const name = allergen.name?.toLowerCase() || '';
    
    // Common high severity allergens
    if (
      name.includes('nut') || 
      name.includes('peanut') || 
      name.includes('shellfish') || 
      name.includes('seafood') ||
      name.includes('fish')
    ) {
      allergen.severity = 'high';
    } 
    // Common medium severity allergens
    else if (
      name.includes('gluten') || 
      name.includes('wheat') || 
      name.includes('dairy') || 
      name.includes('milk') || 
      name.includes('egg') || 
      name.includes('soy')
    ) {
      allergen.severity = 'medium';
    } 
    // Default to low for others
    else {
      allergen.severity = 'low';
    }
  }
  
  return allergen as Allergen;
};

// Mock data for development
const mockAllergens: Allergen[] = [
  {
    _id: 'mock-allergen-1',
    name: 'Gluten',
    description: 'Found in wheat and grains',
    severity: 'high',
    isSystemLevel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-allergen-2',
    name: 'Dairy',
    description: 'Includes milk and dairy products',
    severity: 'medium',
    isSystemLevel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-allergen-3',
    name: 'Nuts',
    description: 'Includes tree nuts and peanuts',
    severity: 'high',
    isSystemLevel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const allergenService = {
  async getAllAllergens(): Promise<Allergen[]> {
    try {
      const data = await apiClient.get<{ allergens: Allergen[] }>(API_ENDPOINTS.allergens.getAll);
      const allergens = Array.isArray(data) ? data : data.allergens || [];
      return allergens.map(addFrontendSeverity);
    } catch (error) {
      console.error('Failed to fetch allergens:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock allergens data');
        return mockAllergens;
      }
      return [];
    }
  },

  async getSystemAllergens(): Promise<Allergen[]> {
    try {
      const data = await apiClient.get<{ allergens: Allergen[] }>(API_ENDPOINTS.allergens.getAll);
      const allergens = Array.isArray(data) ? data : data.allergens || [];
      const systemAllergens = allergens.filter((a: Allergen) => a.isSystemLevel);
      return systemAllergens.map(addFrontendSeverity);
    } catch (error) {
      console.error('Failed to fetch system allergens:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock system allergens data');
        return mockAllergens.filter(a => a.isSystemLevel);
      }
      return [];
    }
  },

  async getAllergenById(id: string): Promise<Allergen> {
    try {
      const data = await apiClient.get<{ allergen: Allergen }>(API_ENDPOINTS.allergens.getById(id));
      const allergen = data.allergen || data;
      
      if (!allergen) {
        throw new Error(`Allergen with ID ${id} not found`);
      }
      
      return addFrontendSeverity(allergen);
    } catch (error) {
      console.error(`Failed to fetch allergen with ID ${id}:`, error);
      if (process.env.NODE_ENV === 'development') {
        const mockAllergen = mockAllergens.find(a => a._id === id);
        if (mockAllergen) return mockAllergen;
      }
      throw error;
    }
  },

  async createAllergen(allergenData: Omit<Allergen, '_id' | 'createdAt' | 'updatedAt'>): Promise<Allergen> {
    try {
      // Remove severity from data sent to the backend
      const { severity, ...dataForBackend } = allergenData;
      
      const data = await apiClient.post<{ allergen: Allergen }>(
        API_ENDPOINTS.allergens.create,
        dataForBackend
      );
      
      const createdAllergen = data.allergen || data;
      return addFrontendSeverity({
        ...createdAllergen,
        severity // Restore the severity for frontend use
      });
    } catch (error) {
      console.error('Failed to create allergen:', error);
      throw error;
    }
  },

  async updateAllergen(id: string, allergenData: Partial<Allergen>): Promise<Allergen> {
    try {
      // Remove severity from data sent to the backend
      const { severity, ...dataForBackend } = allergenData;
      
      const data = await apiClient.put<{ allergen: Allergen }>(
        API_ENDPOINTS.allergens.update(id),
        dataForBackend
      );
      
      const updatedAllergen = data.allergen || data;
      return addFrontendSeverity({
        ...updatedAllergen,
        severity // Restore the severity for frontend use
      });
    } catch (error) {
      console.error(`Failed to update allergen with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteAllergen(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.allergens.delete(id));
    } catch (error) {
      console.error(`Failed to delete allergen with ID ${id}:`, error);
      throw error;
    }
  }
}; 