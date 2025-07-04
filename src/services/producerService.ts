import { apiRequest } from '@/lib/api';
import type { Producer } from '@/types';

export const producerService = {
  // Get all producers
  getProducers: async (): Promise<Producer[]> => {
    const response = await apiRequest<Producer[]>({
      method: 'GET',
      url: '/producers',
    });
    return response.data;
  },

  // Get producer by ID
  getProducer: async (id: number): Promise<Producer> => {
    const response = await apiRequest<Producer>({
      method: 'GET',
      url: `/producers/${id}`,
    });
    return response.data;
  },

  // Get producer by slug
  getProducerBySlug: async (slug: string): Promise<Producer> => {
    const response = await apiRequest<Producer>({
      method: 'GET',
      url: `/producers/slug/${slug}`,
    });
    return response.data;
  },
};

export default producerService;