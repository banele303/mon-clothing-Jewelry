   "use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import PaymentInstructions from "./ui/PaymentInstractions";
import Link from "next/link";


interface CartModalProps {
  onClose: () => void;
}

const CartModal = ({ onClose }: CartModalProps) => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });

      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const getSubtotal = () => {
   
    return (cart.lineItems || [])
      .reduce(
        (total, item) =>
          total + (Number(item.price?.amount) || 0) * (item.quantity || 1),
        0
      )
      .toFixed(2);
  };
  const [showInstructions, setShowInstructions] = useState(false)
  // const handleRemoveItem = async (itemId: string) => {
  //   try {
  //     await removeItem(wixClient, itemId);
  //   } catch (error) {
  //     console.error("Error removing item:", error);
  //   }
  // };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-4 sm:p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close cart</span>
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {!cart.lineItems || cart.lineItems.length === 0 ? (
            <div className="text-center py-8">Cart is Empty</div>
          ) : (
            <div className="space-y-6">
              {cart.lineItems.map((item) => (
                <div key={item._id} className="flex gap-4 items-start">
                  {item.image && (
                    <Image
                      src={wixMedia.getScaledToFillImageUrl(
                        item.image,
                        72,
                        96,
                        {}
                      )}
                      alt={item.productName?.original || "Product image"}
                      width={72}
                      height={96}
                      className="object-cover rounded-md"
                    />
                  )}
                  <div className="flex-grow">
                    <h3 className="font-semibold">
                      {item.productName?.original}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.physicalProperties?.sku}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        Qty. {item.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          R{item.price?.amount}
                        </span>
{/*                          <button
                          className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                          onClick={() => handleRemoveItem(item._id!)}
                           disabled={isLoading} *
                         >
                          Remove
                        </button>  */}

 <button className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                          onClick={() => removeItem(wixClient, item._id!)}
                        disabled={isLoading}
                      >
                          Remove </button>



                      
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 sm:p-6 border-t">
          <div className="flex items-center justify-between font-semibold mb-4">
            <span>Subtotal</span>
            <span>R{getSubtotal()}</span>
          </div>
          <p className="text-gray-500 text-sm mb-4 text-center">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Close Cart
            </button>
            {/* <button
              className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                isLoading || !cart.lineItems || cart.lineItems.length === 0
              }
              onClick={handleCheckout}
            >
              Checkout
            </button> */}

<Link href="/checkout" passHref>
          <Button className="w-full" onClick={onClose}>Proceed to Checkout</Button>
        </Link>



            {showInstructions && <PaymentInstructions onClose={() => setShowInstructions(false)} />}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;











// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useCartStore } from "@/hooks/useCartStore";
// import { media as wixMedia } from "@wix/sdk";
// import { useWixClient } from "@/hooks/useWixClient";
// import { currentCart } from "@wix/ecom";
// import { X } from 'lucide-react';
// import { Button } from "@/components/ui/button"
// import PaymentInstructions from "./ui/PaymentInstractions";
// import Link from "next/link";


// interface CartModalProps {
//   onClose: () => void;
// }

// const CartModal = ({ onClose }: CartModalProps) => {
//   const wixClient = useWixClient();
//   const { cart, isLoading, removeItem } = useCartStore();
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

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
//       console.error("Checkout error:", err);
//     }
//   };

//   const getSubtotal = () => {
//     if (cart.subtotal?.amount !== undefined) {
//       return Number(cart.subtotal.amount).toFixed(2);
//     }
//     return (cart.lineItems || [])
//       .reduce(
//         (total, item) =>
//           total + (Number(item.price?.amount) || 0) * (item.quantity || 1),
//         0
//       )
//       .toFixed(2);
//   };
//   const [showInstructions, setShowInstructions] = useState(false)
//   // const handleRemoveItem = async (itemId: string) => {
//   //   try {
//   //     await removeItem(wixClient, itemId);
//   //   } catch (error) {
//   //     console.error("Error removing item:", error);
//   //   }
//   // };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div
//         ref={modalRef}
//         className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
//       >
//         <div className="p-4 sm:p-6 flex justify-between items-center border-b">
//           <h2 className="text-xl font-semibold">Shopping Cart</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <X className="h-6 w-6" />
//             <span className="sr-only">Close cart</span>
//           </button>
//         </div>
//         <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
//           {!cart.lineItems || cart.lineItems.length === 0 ? (
//             <div className="text-center py-8">Cart is Empty</div>
//           ) : (
//             <div className="space-y-6">
//               {cart.lineItems.map((item) => (
//                 <div key={item._id} className="flex gap-4 items-start">
//                   {item.image && (
//                     <Image
//                       src={wixMedia.getScaledToFillImageUrl(
//                         item.image,
//                         72,
//                         96,
//                         {}
//                       )}
//                       alt={item.productName?.original || "Product image"}
//                       width={72}
//                       height={96}
//                       className="object-cover rounded-md"
//                     />
//                   )}
//                   <div className="flex-grow">
//                     <h3 className="font-semibold">
//                       {item.productName?.original}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       {item.physicalProperties?.sku}
//                     </p>
//                     <div className="flex justify-between items-center mt-2">
//                       <span className="text-sm text-gray-500">
//                         Qty. {item.quantity}
//                       </span>
//                       <div className="flex items-center gap-2">
//                         <span className="font-semibold">
//                           R{item.price?.amount}
//                         </span>
// {/*                          <button
//                           className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
//                           onClick={() => handleRemoveItem(item._id!)}
//                            disabled={isLoading} *
//                          >
//                           Remove
//                         </button>  */}

//  <button className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
//                           onClick={() => removeItem(wixClient, item._id!)}
//                         disabled={isLoading}
//                       >
//                           Remove </button>



                      
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="p-4 sm:p-6 border-t">
//           <div className="flex items-center justify-between font-semibold mb-4">
//             <span>Subtotal</span>
//             <span>R{getSubtotal()}</span>
//           </div>
//           <p className="text-gray-500 text-sm mb-4 text-center">
//             Shipping and taxes calculated at checkout.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//             <button
//               className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//               onClick={onClose}
//             >
//               Close Cart
//             </button>
//             {/* <button
//               className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//               disabled={
//                 isLoading || !cart.lineItems || cart.lineItems.length === 0
//               }
//               onClick={handleCheckout}
//             >
//               Checkout
//             </button> */}

// <Link href="/checkout" passHref>
//           <Button className="w-full" onClick={onClose}>Proceed to Checkout</Button>
//         </Link>



//             {showInstructions && <PaymentInstructions onClose={() => setShowInstructions(false)} />}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartModal;






