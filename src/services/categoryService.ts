import { apiRequest } from '@/lib/api';
import type { Category } from '@/types';

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiRequest<Category[]>({
      method: 'GET',
      url: '/categories',
    });
    return response.data;
  },

  // Get category by ID
  getCategory: async (id: number): Promise<Category> => {
    const response = await apiRequest<Category>({
      method: 'GET',
      url: `/categories/${id}`,
    });
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiRequest<Category>({
      method: 'GET',
      url: `/categories/slug/${slug}`,
    });
    return response.data;
  },
};

export default categoryService;