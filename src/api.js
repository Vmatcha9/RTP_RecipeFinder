import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Spoonacular API functions
export const spoonacularApi = {
  searchRecipes: async (query, cuisine, diet, intolerances, maxReadyTime) => {
    try {
      const params = {
        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
        query: query || '',
        cuisine: cuisine || '',
        diet: diet || '',
        intolerances: intolerances || '',
        maxReadyTime: maxReadyTime || '',
        number: 10,
        addRecipeInformation: true,
        addRecipeNutrition: false
      };

      // Remove empty parameters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/complexSearch`, { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 402) {
        throw new Error('API quota exceeded. Please try again later or contact support.');
      }
      console.error('Spoonacular API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getRecipeById: async (id) => {
    try {
      const params = {
        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
        includeNutrition: false
      };

      const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${id}/information`, { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 402) {
        throw new Error('API quota exceeded. Please try again later or contact support.');
      }
      console.error('Spoonacular API Error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default api; 