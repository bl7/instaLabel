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
    list: `${API_BASE_URL}/api/allergens`,
    check: `${API_BASE_URL}/api/allergens/check`,
  },
  categories: {
    list: `${API_BASE_URL}/api/category`,
  },
  ingredients: {
    list: `${API_BASE_URL}/api/ingredients`,
    create: `${API_BASE_URL}/api/ingredients`,
    update: (id: string) => `${API_BASE_URL}/api/ingredients/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/ingredients/${id}`,
  }
} as const; 