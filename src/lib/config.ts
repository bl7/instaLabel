export const API_BASE_URL = 'http://localhost:3006';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/v1/auth/login`,
    signup: `${API_BASE_URL}/api/v1/auth/signup`,
    tenantForEmail: (email: string) => `${API_BASE_URL}/api/v1/auth/tenant-for-email/${encodeURIComponent(email)}`,
    tenantById: (id: string) => `${API_BASE_URL}/api/v1/auth/tenant/${id}`,
    logout: `${API_BASE_URL}/api/v1/auth/logout`,
    verifyOtp: `${API_BASE_URL}/api/v1/auth/verify-otp`,
    forgotPassword: `${API_BASE_URL}/api/v1/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/api/v1/auth/reset-password`,
    updatePassword: `${API_BASE_URL}/api/v1/auth/update-password`,
    me: `${API_BASE_URL}/api/v1/auth/me`,
    refreshToken: `${API_BASE_URL}/api/v1/auth/refresh-token`
  },
  allergens: {
    getAll: `${API_BASE_URL}/api/v1/allergens`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/allergens/${id}`,
    create: `${API_BASE_URL}/api/v1/allergens`,
    update: (id: string) => `${API_BASE_URL}/api/v1/allergens/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/allergens/${id}`,
  },
  categories: {
    getAll: `${API_BASE_URL}/api/v1/categories`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/categories/${id}`,
    create: `${API_BASE_URL}/api/v1/categories`,
    update: (id: string) => `${API_BASE_URL}/api/v1/categories/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/categories/${id}`,
  },
  ingredients: {
    getAll: `${API_BASE_URL}/api/v1/ingredients`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/ingredients/${id}`,
    getByAllergen: (allergenId: string) => `${API_BASE_URL}/api/v1/ingredients/allergen/${allergenId}`,
    getByCategory: (categoryId: string) => `${API_BASE_URL}/api/v1/ingredients/category/${categoryId}`,
    create: `${API_BASE_URL}/api/v1/ingredients`,
    update: (id: string) => `${API_BASE_URL}/api/v1/ingredients/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/ingredients/${id}`,
  },
  recipes: {
    getAll: `${API_BASE_URL}/api/v1/recipes`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/recipes/${id}`,
    getByAllergen: (allergenId: string) => `${API_BASE_URL}/api/v1/recipes/allergen/${allergenId}`,
    create: `${API_BASE_URL}/api/v1/recipes`,
    update: (id: string) => `${API_BASE_URL}/api/v1/recipes/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/recipes/${id}`,
  },
  labels: {
    getAll: `${API_BASE_URL}/api/v1/labels`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/labels/${id}`,
    create: `${API_BASE_URL}/api/v1/labels`,
    update: (id: string) => `${API_BASE_URL}/api/v1/labels/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/labels/${id}`,
    generateQR: (id: string) => `${API_BASE_URL}/api/v1/labels/${id}/qr`
  },
  inventory: {
    getAll: `${API_BASE_URL}/api/v1/inventory`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/inventory/${id}`,
    create: `${API_BASE_URL}/api/v1/inventory`,
    update: (id: string) => `${API_BASE_URL}/api/v1/inventory/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/inventory/${id}`,
  },
  expiryAlerts: {
    getAll: `${API_BASE_URL}/api/v1/expiry-alerts`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/expiry-alerts/${id}`,
    getActive: `${API_BASE_URL}/api/v1/expiry-alerts/active`,
    update: (id: string) => `${API_BASE_URL}/api/v1/expiry-alerts/${id}`,
  },
  menuItems: {
    getAll: `${API_BASE_URL}/api/v1/menu-items`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/menu-items/${id}`,
    create: `${API_BASE_URL}/api/v1/menu-items`,
    update: (id: string) => `${API_BASE_URL}/api/v1/menu-items/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/menu-items/${id}`,
  },
  subscriptions: {
    getCurrent: `${API_BASE_URL}/api/v1/subscriptions`,
    update: `${API_BASE_URL}/api/v1/subscriptions`,
    getAllPlans: `${API_BASE_URL}/api/v1/subscriptions/plans`,
    subscribe: `${API_BASE_URL}/api/v1/subscriptions/subscribe`,
    cancel: `${API_BASE_URL}/api/v1/subscriptions/cancel`
  },
  tenants: {
    getAll: `${API_BASE_URL}/api/v1/tenants`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/tenants/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/v1/tenants/${id}`,
  }
} as const; 