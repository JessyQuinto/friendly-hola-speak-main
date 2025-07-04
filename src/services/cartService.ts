import { apiRequest } from '@/lib/api';
import type { Cart, CartUpdateRequest } from '@/types';

export const cartService = {
  // Get current user's cart
  getCart: async (): Promise<Cart> => {
    const response = await apiRequest<Cart>({
      method: 'GET',
      url: '/cart',
    });
    return response.data;
  },

  // Update cart (add item, update quantity, or replace entire cart)
  updateCart: async (cartData: CartUpdateRequest): Promise<Cart> => {
    const response = await apiRequest<Cart>({
      method: 'POST',
      url: '/cart',
      data: cartData,
    });
    return response.data;
  },

  // Add single item to cart
  addToCart: async (productId: number, quantity: number = 1): Promise<Cart> => {
    // First, get current cart to preserve existing items
    let currentCart: Cart;
    try {
      currentCart = await cartService.getCart();
    } catch (error) {
      // If cart doesn't exist, create empty one
      currentCart = {
        id: 0,
        userId: 0, // Will be set by backend
        items: [],
        total: 0,
        totalItems: 0,
        createdAt: '',
        updatedAt: '',
      };
    }

    // Find if product already exists in cart
    const existingItemIndex = currentCart.items.findIndex(item => item.productId === productId);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      updatedItems = currentCart.items.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + quantity;
          return {
            productId: item.productId,
            quantity: newQuantity,
            price: item.unitPrice,
          };
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
        };
      });
    } else {
      // Add new item (price will be fetched by backend)
      updatedItems = [
        ...currentCart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
        {
          productId,
          quantity,
          price: 0, // Backend will set correct price
        }
      ];
    }

    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return cartService.updateCart({
      id: currentCart.id,
      userId: currentCart.userId,
      items: updatedItems,
      total,
    });
  },

  // Update item quantity in cart
  updateItemQuantity: async (productId: number, quantity: number): Promise<Cart> => {
    const currentCart = await cartService.getCart();
    
    const updatedItems = currentCart.items
      .map(item => ({
        productId: item.productId,
        quantity: item.productId === productId ? quantity : item.quantity,
        price: item.unitPrice,
      }))
      .filter(item => item.quantity > 0); // Remove items with 0 quantity

    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return cartService.updateCart({
      id: currentCart.id,
      userId: currentCart.userId,
      items: updatedItems,
      total,
    });
  },

  // Remove item from cart
  removeFromCart: async (productId: number): Promise<Cart> => {
    const currentCart = await cartService.getCart();
    
    const updatedItems = currentCart.items
      .filter(item => item.productId !== productId)
      .map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.unitPrice,
      }));

    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return cartService.updateCart({
      id: currentCart.id,
      userId: currentCart.userId,
      items: updatedItems,
      total,
    });
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    const currentCart = await cartService.getCart();
    
    await cartService.updateCart({
      id: currentCart.id,
      userId: currentCart.userId,
      items: [],
      total: 0,
    });
  },

  // Get cart item count
  getCartItemCount: async (): Promise<number> => {
    try {
      const cart = await cartService.getCart();
      return cart.totalItems;
    } catch (error) {
      return 0;
    }
  },

  // Calculate cart total
  calculateCartTotal: (items: { quantity: number; unitPrice: number }[]): number => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  },
};

export default cartService;