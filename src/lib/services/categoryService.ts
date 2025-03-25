import { API_ENDPOINTS } from '../config'
import { apiClient } from '@/lib/api/client'

export interface Category {
  _id: string
  name: string
  description?: string
  parent?: string
  tenantId: string
  createdAt?: string
  updatedAt?: string
}

export interface CategoryCreateData {
  name: string
  description?: string
  parent?: string
}

export interface CategoryUpdateData {
  name?: string
  description?: string
  parent?: string
}

// Mock data for development
const mockCategories: Category[] = [
  {
    _id: 'mock-category-1',
    name: 'Grains',
    description: 'All types of grains',
    tenantId: 'mock-tenant-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-category-2',
    name: 'Dairy',
    description: 'Dairy products',
    tenantId: 'mock-tenant-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-category-3',
    name: 'Nuts',
    description: 'All types of nuts',
    tenantId: 'mock-tenant-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const data = await apiClient.get<{ categories: Category[] }>(API_ENDPOINTS.categories.getAll);
      return Array.isArray(data) ? data : data.categories || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock categories data');
        return mockCategories;
      }
      return [];
    }
  },

  async getCategoryById(id: string): Promise<Category> {
    try {
      const data = await apiClient.get<{ category: Category }>(API_ENDPOINTS.categories.getById(id));
      return data.category || data;
    } catch (error) {
      console.error(`Failed to fetch category with ID ${id}:`, error);
      if (process.env.NODE_ENV === 'development') {
        const mockCategory = mockCategories.find(c => c._id === id);
        if (mockCategory) return mockCategory;
      }
      throw error;
    }
  },

  async createCategory(data: CategoryCreateData): Promise<Category> {
    try {
      const response = await apiClient.post<{ category: Category }>(
        API_ENDPOINTS.categories.create,
        data
      );
      return response.category || response;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, data: CategoryUpdateData): Promise<Category> {
    try {
      const response = await apiClient.put<{ category: Category }>(
        API_ENDPOINTS.categories.update(id),
        data
      );
      return response.category || response;
    } catch (error) {
      console.error(`Failed to update category with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.categories.delete(id));
    } catch (error) {
      console.error(`Failed to delete category with ID ${id}:`, error);
      throw error;
    }
  }
}; 