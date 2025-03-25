export const API_BASE_URL = 'http://localhost:5003';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/login`,
    register: `${API_BASE_URL}/api/register`,
    verifyOtp: `${API_BASE_URL}/api/verify-otp`,
    forgotPassword: `${API_BASE_URL}/api/forgot-password`,
    resetPassword: `${API_BASE_URL}/api/reset-password`,
    me: `${API_BASE_URL}/api/me`,
  },
  allergens: {
    getAll: `${API_BASE_URL}/api/allergens`,
    create: `${API_BASE_URL}/api/allergens`,
    update: (id: string) => `${API_BASE_URL}/api/allergens/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/allergens/${id}`,
  },
  categories: {
    getAll: `${API_BASE_URL}/api/categories`,
  },
  ingredients: {
    getAll: `${API_BASE_URL}/api/ingredients`,
    create: `${API_BASE_URL}/api/ingredients`,
    update: (id: string) => `${API_BASE_URL}/api/ingredients/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/ingredients/${id}`,
  },
  menuItemCategories: {
    getAll: `${API_BASE_URL}/api/menu-item-categories`,
    create: `${API_BASE_URL}/api/menu-item-categories`,
    update: (id: string) => `${API_BASE_URL}/api/menu-item-categories/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/menu-item-categories/${id}`,
  },
  menuItems: {
    getAll: `${API_BASE_URL}/api/menu-items`,
    create: `${API_BASE_URL}/api/menu-items`,
    update: (id: string) => `${API_BASE_URL}/api/menu-items/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/menu-items/${id}`,
  },
} as const; 