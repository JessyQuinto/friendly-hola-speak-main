import { apiRequest } from '@/lib/api';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
}

export const contactService = {
  // Send contact message
  sendMessage: async (data: ContactMessage): Promise<void> => {
    await apiRequest({
      method: 'POST',
      url: '/contact',
      data,
    });
  },

  // Subscribe to newsletter
  subscribeToNewsletter: async (data: NewsletterSubscription): Promise<void> => {
    await apiRequest({
      method: 'POST',
      url: '/newsletter',
      data,
    });
  },

  // Health check
  checkHealth: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiRequest<{ status: string; timestamp: string }>({
      method: 'GET',
      url: '/health',
    });
    return response.data;
  },
};

export default contactService;