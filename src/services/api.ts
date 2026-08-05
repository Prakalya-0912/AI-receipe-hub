import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Recipe API functions
export const recipeAPI = {
  searchRecipes: async (query: string, filters?: {
    diet?: string;
    cuisine?: string;
    maxReadyTime?: number;
    number?: number;
  }) => {
    const params = new URLSearchParams({ query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await api.get(`/recipes/search?${params}`);
    return response.data;
  },

  searchByIngredients: async (ingredients: string[], number?: number) => {
    const params = new URLSearchParams({
      ingredients: ingredients.join(','),
      number: (number || 12).toString()
    });
    const response = await api.get(`/recipes/ingredients/search?${params}`);
    return response.data;
  },

  getRecipeById: async (id: string) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  addToFavorites: async (recipeData: {
    recipeId: string;
    title: string;
    image?: string;
  }) => {
    const response = await api.post('/recipes/favorites', recipeData);
    return response.data;
  },

  removeFromFavorites: async (recipeId: string) => {
    const response = await api.delete(`/recipes/favorites/${recipeId}`);
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/recipes/favorites');
    return response.data;
  }
};

// User API functions
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updatePreferences: async (preferences: {
    dietaryRestrictions?: string[];
    cuisinePreferences?: string[];
    skillLevel?: string;
  }) => {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  },

  saveRecipe: async (recipeData: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
  }) => {
    const response = await api.post('/users/recipes', recipeData);
    return response.data;
  },

  getCreatedRecipes: async () => {
    const response = await api.get('/users/recipes');
    return response.data;
  }
};

export default api;
