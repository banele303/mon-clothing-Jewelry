import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/wixContext";

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
          const cart = await wixClient.currentCart.getCurrentCart();
          const subtotal = cart?.lineItems ? calculateSubtotal(cart.lineItems) : 0;
          set({
            cart: { ...cart, subtotal: { amount: subtotal } },
            isLoading: false,
            counter: cart?.lineItems?.length || 0,
          });
        } catch (err) {
          set((prev) => ({ ...prev, isLoading: false }));
          console.error("Error fetching cart:", err);
        }
      },
      addItem: async (wixClient, productId, variantId, quantity) => {
        try {
          set((state) => ({ ...state, isLoading: true }));
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
          set((prev) => ({ ...prev, isLoading: false }));
          console.error("Error adding item to cart:", err);
        }
      },
      removeItem: async (wixClient, itemId) => {
        try {
          set((state) => ({ ...state, isLoading: true }));
          const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
            [itemId]
          );

          const subtotal = response.cart?.lineItems ? calculateSubtotal(response.cart.lineItems) : 0;

          set({
            cart: { ...response.cart, subtotal: { amount: subtotal } },
            counter: response.cart?.lineItems?.length || 0,
            isLoading: false,
          });
        } catch (err) {
          set((prev) => ({ ...prev, isLoading: false }));
          console.error("Error removing item from cart:", err);
        }
      },
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);








// import { create } from "zustand";
// import { currentCart } from "@wix/ecom";
// import { WixClient } from "@/context/wixContext";

// type CartState = {
//   cart: currentCart.Cart;
//   isLoading: boolean;
//   counter: number;
//   getCart: (wixClient: WixClient) => void;
//   addItem: (
//     wixClient: WixClient,
//     productId: string,
//     variantId: string,
//     quantity: number
//   ) => void;
//   removeItem: (wixClient: WixClient, itemId: string) => void;
// };

// export const useCartStore = create<CartState>((set) => ({
//   cart: [],
//   isLoading: true,
//   counter: 0,
//   getCart: async (wixClient) => {
//     try {
//       const cart = await wixClient.currentCart.getCurrentCart();
//       set({
//         cart: cart || [],
//         isLoading: false,
//         counter: cart?.lineItems.length || 0,
//       });
//     } catch (err) {
//       set((prev) => ({ ...prev, isLoading: false }));
//     }
//   },
//   addItem: async (wixClient, productId, variantId, quantity) => {
//     set((state) => ({ ...state, isLoading: true }));
//     const response = await wixClient.currentCart.addToCurrentCart({
//       lineItems: [
//         {
//           catalogReference: {
//             appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
//             catalogItemId: productId,
//             ...(variantId && { options: { variantId } }),
//           },
//           quantity: quantity,
//         },
//       ],
//     });

//     set({
//       cart: response.cart,
//       counter: response.cart?.lineItems.length,
//       isLoading: false,
//     });
//   },
//   removeItem: async (wixClient, itemId) => {
//     set((state) => ({ ...state, isLoading: true }));
//     const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
//       [itemId]
//     );

//     set({
//       cart: response.cart,
//       counter: response.cart?.lineItems.length,
//       isLoading: false,
//     });
//   },
// }));
