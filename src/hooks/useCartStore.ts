import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { currentCart } from '@wix/ecom';
import { WixClient } from '@/context/wixContext';

type ExtendedCart = currentCart.Cart & {
  subtotal?: { amount: number };
};

type CartState = {
  cart: ExtendedCart;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => Promise<void>;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => Promise<void>;
  removeItem: (wixClient: WixClient, itemId: string) => Promise<void>;
};

// Custom storage object for Zustand persistence
const customStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  }
};

const calculateSubtotal = (lineItems: currentCart.LineItem[]): number => {
  return lineItems.reduce((total, item) => {
    const itemPrice = Number(item.price?.amount) || 0;
    const itemQuantity = Number(item.quantity) || 0;
    return total + itemPrice * itemQuantity;
  }, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: { lineItems: [] },
      isLoading: false,
      counter: 0,
      getCart: async (wixClient) => {
        try {
          set({ isLoading: true });
          const cart = await wixClient.currentCart.getCurrentCart();
          const subtotal = cart?.lineItems ? calculateSubtotal(cart.lineItems) : 0;
          set({
            cart: { ...cart, subtotal: { amount: subtotal } },
            isLoading: false,
            counter: cart?.lineItems?.length || 0,
          });
        } catch (err) {
          set({ isLoading: false });
          console.error('Error fetching cart:', err);
        }
      },
      addItem: async (wixClient, productId, variantId, quantity) => {
        try {
          set({ isLoading: true });
          const response = await wixClient.currentCart.addToCurrentCart({
            lineItems: [
              {
                catalogReference: {
                  appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
                  catalogItemId: productId,
                  ...(variantId && { options: { variantId } }),
                },
                quantity: quantity,
              },
            ],
          });
          const subtotal = response.cart?.lineItems ? calculateSubtotal(response.cart.lineItems) : 0;
          set({
            cart: { ...response.cart, subtotal: { amount: subtotal } },
            counter: response.cart?.lineItems?.length || 0,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          console.error('Error adding item to cart:', err);
        }
      },
      removeItem: async (wixClient, itemId) => {
        try {
          set({ isLoading: true });
          const response = await wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);
          const subtotal = response.cart?.lineItems ? calculateSubtotal(response.cart.lineItems) : 0;
          set({
            cart: { ...response.cart, subtotal: { amount: subtotal } },
            counter: response.cart?.lineItems?.length || 0,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          console.error('Error removing item from cart:', err);
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: customStorage,
    }
  )
);
