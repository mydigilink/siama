"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  serviceId: string;
  serviceName: string;
  sessionId: string;
  sessionName: string;
  quantity: number;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  price: number; // Keep for backward compatibility
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  userMobile: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (serviceId: string, sessionId: string) => void;
  updateQuantity: (serviceId: string, sessionId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  setUserMobile: (mobile: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userMobile, setUserMobileState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart and userMobile from localStorage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      const savedCart = localStorage.getItem('siama_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Migrate existing cart items to include new pricing properties
        const migratedCart = parsedCart.map((item: any) => ({
          ...item,
          originalPrice: item.originalPrice || item.price || 0,
          discount: item.discount || 0,
          finalPrice: item.finalPrice || item.price || 0,
        }));
        setCart(migratedCart);
      }
      const savedMobile = localStorage.getItem('siama_user_mobile');
      if (savedMobile) {
        setUserMobileState(savedMobile);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem('siama_cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoaded]);

  // Save userMobile to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        if (userMobile) {
          localStorage.setItem('siama_user_mobile', userMobile);
        } else {
          localStorage.removeItem('siama_user_mobile');
        }
      } catch (error) {
        console.error('Error saving userMobile to localStorage:', error);
      }
    }
  }, [userMobile, isLoaded]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.serviceId === item.serviceId && cartItem.sessionId === item.sessionId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, item];
      }
    });
  };

  const removeFromCart = (serviceId: string, sessionId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.serviceId === serviceId && item.sessionId === sessionId))
    );
  };

  const updateQuantity = (serviceId: string, sessionId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId, sessionId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.serviceId === serviceId && item.sessionId === sessionId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const setUserMobile = (mobile: string | null) => {
    setUserMobileState(mobile);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        userMobile,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        setUserMobile,
      }}
    >
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
