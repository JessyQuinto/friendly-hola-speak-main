import { apiRequest } from '@/lib/api';
import type { Order, CreateOrderRequest } from '@/types';

export const orderService = {
  // Create new order from current cart
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await apiRequest<Order>({
      method: 'POST',
      url: '/orders',
      data: orderData,
    });
    return response.data;
  },

  // Get order by ID
  getOrder: async (orderId: number): Promise<Order> => {
    const response = await apiRequest<Order>({
      method: 'GET',
      url: `/orders/${orderId}`,
    });
    return response.data;
  },

  // Get current user's orders
  getUserOrders: async (page: number = 1, pageSize: number = 10): Promise<{ orders: Order[]; pagination: any }> => {
    const response = await apiRequest<Order[]>({
      method: 'GET',
      url: `/orders?page=${page}&pageSize=${pageSize}`,
    });
    return {
      orders: response.data,
      pagination: response.pagination,
    };
  },

  // Cancel order (if status allows)
  cancelOrder: async (orderId: number): Promise<Order> => {
    const response = await apiRequest<Order>({
      method: 'PUT',
      url: `/orders/${orderId}/cancel`,
    });
    return response.data;
  },

  // Get order status
  getOrderStatus: (status: Order['status']): { label: string; color: string } => {
    const statusMap = {
      Pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      Processing: { label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
      Shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
      Delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
      Cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
      Refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  },

  // Get payment method label
  getPaymentMethodLabel: (method: Order['paymentMethod']): string => {
    const methodMap = {
      CreditCard: 'Tarjeta de Crédito',
      DebitCard: 'Tarjeta de Débito',
      BankTransfer: 'Transferencia Bancaria',
      Cash: 'Efectivo',
    };
    return methodMap[method] || method;
  },

  // Format Colombian pesos
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  },
};

export default orderService;