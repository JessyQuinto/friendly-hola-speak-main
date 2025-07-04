import { apiRequest } from '@/lib/api';

export interface HealthStatus {
  status: 'Healthy' | 'Unhealthy';
  uptime: string;
  timestamp: string;
  services: {
    database: 'Up' | 'Down';
    cache: 'Up' | 'Down';
    auth: 'Up' | 'Down';
  };
}

export const systemService = {
  // Health check endpoint
  getHealthStatus: async (): Promise<HealthStatus> => {
    const response = await apiRequest<HealthStatus>({
      method: 'GET',
      url: '/health',
    });
    return response.data;
  },
};

export default systemService;
