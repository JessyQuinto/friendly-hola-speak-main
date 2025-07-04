import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { cartService } from '@/services/cartService';
import { useAuth } from '@/contexts/AuthContext';
import type { Cart, CartItem } from '@/types';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  total: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Calculate derived values
  const itemCount = cart?.totalItems || 0;
  const total = cart?.total || 0;

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error: any) {
      // If cart doesn't exist, it's okay - user might not have added anything yet
      if (error.response?.status !== 404) {
        console.error('Error loading cart:', error);
      }
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1): Promise<void> => {
    if (!isAuthenticated) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para agregar productos al carrito.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart);
      
      toast({
        title: 'Producto agregado',
        description: 'El producto ha sido agregado al carrito.',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al agregar producto al carrito';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number): Promise<void> => {
    if (!isAuthenticated || !cart) return;

    try {
      setIsLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const updatedCart = await cartService.updateItemQuantity(productId, quantity);
      setCart(updatedCart);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar cantidad';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      await cartService.removeFromCart(productId);
      await refreshCart(); // Refresh to get updated cart
      
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado del carrito.',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar producto';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      await cartService.clearCart();
      setCart(null);
      
      toast({
        title: 'Carrito limpiado',
        description: 'Todos los productos han sido eliminados del carrito.',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al limpiar carrito';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    isLoading,
    itemCount,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;