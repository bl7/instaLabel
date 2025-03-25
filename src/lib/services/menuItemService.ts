import { API_ENDPOINTS } from '@/lib/config'
import { apiClient } from '@/lib/api/client'
import { type Ingredient } from './ingredientService'

export interface MenuItem {
  _id: string
  name: string
  description?: string
  price: number
  categoryId: string
  ingredients: string[]
  allergens: string[]
  tenantId: string
  createdAt?: string
  updatedAt?: string
}

export interface MenuItemCreateData {
  name: string
  description?: string
  price?: number
  category?: string
  ingredients?: string[]
  allergens?: string[]
  images?: string[]
}

export interface MenuItemUpdateData {
  name?: string
  description?: string
  price?: number
  category?: string
  ingredients?: string[]
  allergens?: string[]
  images?: string[]
}

// Mock data for development
const mockMenuItems: MenuItem[] = [
  {
    _id: 'mock-menu-item-1',
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella pizza',
    price: 12.99,
    categoryId: 'pizza',
    ingredients: ['dough', 'tomato sauce', 'mozzarella', 'basil'],
    allergens: ['dairy', 'gluten'],
    tenantId: 'mock-tenant-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-menu-item-2',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing',
    price: 8.99,
    categoryId: 'salads',
    ingredients: ['romaine lettuce', 'croutons', 'parmesan', 'caesar dressing'],
    allergens: ['dairy', 'gluten'],
    tenantId: 'mock-tenant-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const menuItemService = {
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const data = await apiClient.get<{ menuItems: MenuItem[] }>(API_ENDPOINTS.menuItems.getAll);
      return Array.isArray(data) ? data : data.menuItems || [];
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      // Return mock data as fallback in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock menu items data');
        return mockMenuItems;
      }
      return [];
    }
  },

  async getMenuItemById(id: string): Promise<MenuItem> {
    try {
      const data = await apiClient.get<{ menuItem: MenuItem }>(API_ENDPOINTS.menuItems.getById(id));
      return data.menuItem || data;
    } catch (error) {
      console.error(`Failed to fetch menu item with ID ${id}:`, error);
      throw error;
    }
  },

  async createMenuItem(menuItemData: Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
    try {
      const data = await apiClient.post<{ menuItem: MenuItem }>(
        API_ENDPOINTS.menuItems.create,
        menuItemData
      );
      return data.menuItem || data;
    } catch (error) {
      console.error('Failed to create menu item:', error);
      throw error;
    }
  },

  async updateMenuItem(id: string, menuItemData: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const data = await apiClient.put<{ menuItem: MenuItem }>(
        API_ENDPOINTS.menuItems.update(id),
        menuItemData
      );
      return data.menuItem || data;
    } catch (error) {
      console.error(`Failed to update menu item with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.menuItems.delete(id));
    } catch (error) {
      console.error(`Failed to delete menu item with ID ${id}:`, error);
      throw error;
    }
  },

  // Helper method to get menu items by category
  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const menuItems = await this.getAllMenuItems();
    return menuItems.filter(item => item.categoryId === categoryId);
  },

  // Helper method to get menu items by allergen
  async getMenuItemsByAllergen(allergenId: string): Promise<MenuItem[]> {
    const menuItems = await this.getAllMenuItems();
    return menuItems.filter(item => item.allergens.includes(allergenId));
  }
} 