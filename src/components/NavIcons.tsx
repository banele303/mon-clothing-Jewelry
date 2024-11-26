"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from 'lucide-react';
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";

interface NavIconsProps {
  onCartClick: () => void;
}

const NavIcons: React.FC<NavIconsProps> = ({ onCartClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const wixClient = useWixClient();
  const { cart, counter, getCart } = useCartStore();

  const isLoggedIn = wixClient.auth.loggedIn();

  useEffect(() => {
    setIsClient(true);
    getCart(wixClient);
  }, [wixClient, getCart]);

  if (!isClient) {
    return null;
  }

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsLoading(false);
    setIsProfileOpen(false);
    router.push(logoutUrl);
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image 
        src="/profile.png"
        alt="Profile"
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      {isProfileOpen && isLoggedIn && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/profile">Profile</Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? "Logging out" : "Logout"}
          </div>
        </div>
      )}
      <Image
        src="/notification.png"
        alt="Notifications"
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <button
        className="relative"
        onClick={onCartClick}
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-6 w-6 text-gray-400" />
        {counter > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {counter}
          </span>
        )}
      </button>
    </div>
  );
};

export default NavIcons;





























// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import CartModal from "./CartModal";
// import { createClient, OAuthStrategy } from "@wix/sdk";
// import { products, collections } from "@wix/stores";
// import { currentCart } from "@wix/ecom";
// import Cookies from "js-cookie";
// import { createContext, ReactNode, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { redirects } from '@wix/redirects';
// import { useCartStore } from "@/hooks/useCartStore";
// import { useWixClient } from "@/hooks/useWixClient";

// const refreshToken = Cookies.get("refreshToken");

// const wixClient = createClient({
//   modules: {
//     products,
//     collections,
//     currentCart,
//     redirects
//   },
//   auth: OAuthStrategy({
//     clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
//     tokens: {
//       refreshToken,
//       accessToken: { value: "", expiresAt: 0 },
//     },
//   }),
// });

// export type WixClient = typeof wixClient;

// export const WixClientContext = createContext<WixClient>(wixClient);

// export const WixClientContextProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   return (
//     <WixClientContext.Provider value={wixClient}>
//       {children}
//     </WixClientContext.Provider>
//   );
// };

// const NavIcons = () => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();
//   const wixClient = useWixClient();
//   const isLoggedIn = wixClient.auth.loggedIn();
//   const { cart, counter, getCart } = useCartStore();

//   useEffect(() => {
//     if (!isLoggedIn) {
//       Cookies.remove("refreshToken");
//       router.push("/login");
//     } else {
//       getCart(wixClient);
//     }
//   }, [wixClient, getCart, isLoggedIn]);

//   const handleProfile = () => {
//     if (!isLoggedIn) {
//       router.push("/login");
//     } else {
//       setIsProfileOpen((prev) => !prev);
//     }
//   };

//   const handleLogout = async () => {
//     setIsLoading(true);
//     Cookies.remove("refreshToken");
//     const { logoutUrl } = await wixClient.auth.logout(window.location.href);
//     setIsLoading(false);
//     setIsProfileOpen(false);
//     router.push(logoutUrl);
//   };

//   return (
//     <div className="flex items-center gap-4 xl:gap-6 relative">
//       <Image
//         src="/profile.png"
//         alt=""
//         width={22}
//         height={22}
//         className="cursor-pointer"
//         onClick={handleProfile}
//       />
//       {isProfileOpen && (
//         <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
//           <Link href="/profile">Profile</Link>
//           <div className="mt-2 cursor-pointer" onClick={handleLogout}>
//             {isLoading ? "Logging out" : "Logout"}
//           </div>
//         </div>
//       )}
//       <Image
//         src="/notification.png"
//         alt=""
//         width={22}
//         height={22}
//         className="cursor-pointer"
//       />
//       <div
//         className="relative cursor-pointer"
//         onClick={() => setIsCartOpen((prev) => !prev)}
//       >
//         <Image src="/cart.png" alt="" width={22} height={22} />
//         <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
//           {counter}
//         </div>
//       </div>
//       {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
//     </div>
//   );
// };

// export default NavIcons;




// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import CartModal from "./CartModal";
// import { useWixClient } from "@/hooks/useWixClient";
// import Cookies from "js-cookie";
// import { useCartStore } from "@/hooks/useCartStore";

// const NavIcons = () => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();
//   const pathName = usePathname();

//   const wixClient = useWixClient();
//   const isLoggedIn = wixClient.auth.loggedIn();

//   const handleProfile = () => {
//     if (!isLoggedIn) {
//       router.push("/login");
//     } else {
//       setIsProfileOpen((prev) => !prev);
//     }
//   };

//   const handleLogout = async () => {
//     setIsLoading(true);
//     Cookies.remove("refreshToken");
//     const { logoutUrl } = await wixClient.auth.logout(window.location.href);
//     setIsLoading(false);
//     setIsProfileOpen(false);
//     router.push(logoutUrl);
//   };

//   const { cart, counter, getCart } = useCartStore();

//   useEffect(() => {
//     getCart(wixClient);
//   }, [wixClient, getCart]);

//   return (
//     <div className="flex items-center gap-4 xl:gap-6 relative">
//       <Image
//         src="/profile.png"
//         alt=""
//         width={22}
//         height={22}
//         className="cursor-pointer"
//         onClick={handleProfile}
//       />
//       {isProfileOpen && (
//         <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
//           <Link href="/profile">Profile</Link>
//           <div className="mt-2 cursor-pointer" onClick={handleLogout}>
//             {isLoading ? "Logging out" : "Logout"}
//           </div>
//         </div>
//       )}
//       <Image
//         src="/notification.png"
//         alt=""
//         width={22}
//         height={22}
//         className="cursor-pointer"
//       />
//       <div
//         className="relative cursor-pointer"
//         onClick={() => setIsCartOpen((prev) => !prev)}
//       >
//         <Image src="/cart.png" alt="" width={22} height={22} />
//         <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
//           {counter}
//         </div>
//       </div>
//       {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
//     </div>
//   );
// };

// export default NavIcons;
