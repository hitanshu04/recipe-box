import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout for AI generation
});

// Recipe API service
export const recipeService = {
  // Get all recipes with optional search and filter
  getAll: async (params = {}) => {
    const { search, cuisine, favorite } = params;
    const queryParams = new URLSearchParams();
    
    if (search) queryParams.append("search", search);
    if (cuisine && cuisine !== "All") queryParams.append("cuisine", cuisine);
    if (favorite !== undefined) queryParams.append("favorite", favorite);
    
    const response = await api.get(`/recipes?${queryParams.toString()}`);
    return response.data;
  },

  // Get single recipe by ID
  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Create new recipe
  create: async (recipeData) => {
    const response = await api.post("/recipes", recipeData);
    return response.data;
  },

  // Update recipe
  update: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  // Toggle favorite status
  toggleFavorite: async (id) => {
    const response = await api.put(`/recipes/${id}/favorite`);
    return response.data;
  },

  // Delete recipe
  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  // Generate AI recipe
  generate: async (ingredients, cuisine) => {
    const response = await api.post("/recipes/generate", {
      ingredients,
      cuisine,
    });
    return response.data;
  },
};

export default api;
