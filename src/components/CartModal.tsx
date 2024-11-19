'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/hooks/useCartStore'
import { media as wixMedia } from '@wix/sdk'
import { useWixClient } from '@/hooks/useWixClient'
import { currentCart } from '@wix/ecom'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CartItem extends currentCart.LineItem {
  _id: string
  image?: { url: string }
  productName?: { original: string }
  price?: { amount: number }
}

interface Cart extends currentCart.Cart {
  lineItems: CartItem[]
  subtotal?: { amount: number }
}

const CartModal = ({ onClose }: { onClose: () => void }) => {
  const wixClient = useWixClient()
  const { cart, isLoading, removeItem } = useCartStore() as { cart: Cart; isLoading: boolean; removeItem: (wixClient: any, itemId: string) => Promise<void> }
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleCheckout = async () => {
    try {
      const checkout = await wixClient.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      })

      const { redirectSession } = await wixClient.redirects.createRedirectSession({
        ecomCheckout: { checkoutId: checkout.checkoutId },
        callbacks: {
          postFlowUrl: window.location.origin,
          thankYouPageUrl: `${window.location.origin}/success`,
        },
      })

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl
      }
    } catch (err) {
      console.error('Checkout error:', err)
    }
  }

  const getSubtotal = () => {
    if (cart.subtotal?.amount) {
      return cart.subtotal.amount
    }
    return cart.lineItems.reduce((total, item) => total + (item.price?.amount || 0) * (item.quantity || 1), 0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-4 sm:p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close cart</span>
          </Button>
        </div>
        <ScrollArea className="h-[60vh] sm:h-[70vh]">
          {!cart.lineItems || cart.lineItems.length === 0 ? (
            <div className="text-center p-4">Cart is Empty</div>
          ) : (
            <div className="p-4 sm:p-6 flex flex-col gap-6">
              {cart.lineItems.map((item) => (
                <div key={item._id} className="flex gap-4 items-start">
                  {item.image && (
                    <Image
                      src={wixMedia.getScaledToFillImageUrl(item.image, 72, 96, {})}
                      alt={item.productName?.original || 'Product image'}
                      width={72}
                      height={96}
                      className="object-cover rounded-md"
                    />
                  )}
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-semibold">{item.productName?.original}</h3>
                      <p className="text-sm text-gray-500">{item.availability?.status}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">Qty. {item.quantity}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">R{item.price?.amount || 0}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(wixClient, item._id)}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-4 sm:p-6 border-t">
          <div className="flex items-center justify-between font-semibold mb-4">
            <span>Subtotal</span>
            <span>R{getSubtotal()}</span>
          </div>
          <p className="text-gray-500 text-sm mb-4 text-center">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close Cart
            </Button>
            <Button
              className="w-full"
              disabled={isLoading || !cart.lineItems || cart.lineItems.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartModal



// "use client";

// import Image from "next/image";
// import { useCartStore } from "@/hooks/useCartStore";
// import { media as wixMedia } from "@wix/sdk";
// import { useWixClient } from "@/hooks/useWixClient";
// import { currentCart } from "@wix/ecom";

// const CartModal = () => {
//   // TEMPORARY
//   // const cartItems = true;

//   const wixClient = useWixClient();
//   const { cart, isLoading, removeItem } = useCartStore();

//   const handleCheckout = async () => {
//     try {
//       const checkout =
//         await wixClient.currentCart.createCheckoutFromCurrentCart({
//           channelType: currentCart.ChannelType.WEB,
//         });

//       const { redirectSession } =
//         await wixClient.redirects.createRedirectSession({
//           ecomCheckout: { checkoutId: checkout.checkoutId },
//           callbacks: {
//             postFlowUrl: window.location.origin,
//             thankYouPageUrl: `${window.location.origin}/success`,
//           },
//         });

//       if (redirectSession?.fullUrl) {
//         window.location.href = redirectSession.fullUrl;
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
//       {!cart.lineItems ? (
//         <div className="">Cart is Empty</div>
//       ) : (
//         <>
//           <h2 className="text-xl">Shopping Cart</h2>
//           {/* LIST */}
//           <div className="flex flex-col gap-8">
//             {/* ITEM */}
//             {cart.lineItems.map((item) => (
//               <div className="flex gap-4" key={item._id}>
//                 {item.image && (
//                   <Image
//                     src={wixMedia.getScaledToFillImageUrl(
//                       item.image,
//                       72,
//                       96,
//                       {}
//                     )}
//                     alt=""
//                     width={72}
//                     height={96}
//                     className="object-cover rounded-md"
//                   />
//                 )}
//                 <div className="flex flex-col justify-between w-full">
//                   {/* TOP */}
//                   <div className="">
//                     {/* TITLE */}
//                     <div className="flex items-center justify-between gap-8">
//                       <h3 className="font-semibold">
//                         {item.productName?.original}
//                       </h3>
//                       <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
//                         {item.quantity && item.quantity > 1 && (
//                           <div className="text-xs text-green-500">
//                             {item.quantity} x{" "}
//                           </div>
//                         )}
//                         R{item.price?.amount}
//                       </div>
//                     </div>
//                     {/* DESC */}
//                     <div className="text-sm text-gray-500">
//                       {item.availability?.status}
//                     </div>
//                   </div>
//                   {/* BOTTOM */}
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Qty. {item.quantity}</span>
//                     <span
//                       className="text-blue-500"
//                       style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
//                       onClick={() => removeItem(wixClient, item._id!)}
//                     >
//                       Remove
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* BOTTOM */}
//           <div className="">
//             <div className="flex items-center justify-between font-semibold">
//               <span className="">Subtotal</span>
//               {/* <span className="">${cart.subtotal.amount}</span> */}
//             </div>
//             <p className="text-gray-500 text-sm mt-2 mb-4">
//               Shipping and taxes calculated at checkout.
//             </p>
//             <div className="flex justify-between text-sm">
//               <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
//                 View Cart
//               </button>
//               <button
//                 className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
//                 disabled={isLoading}
//                 onClick={handleCheckout}
//               >
//                 Checkout
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CartModal;
