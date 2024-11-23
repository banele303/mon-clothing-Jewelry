"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";

const NavIcons = ({ initialRefreshToken }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathName = usePathname();

  const wixClient = useWixClient();
  const { cart, counter, getCart } = useCartStore();

  useEffect(() => {
    if (wixClient && wixClient.auth) {
      setIsLoggedIn(wixClient.auth.loggedIn?.() || false);
    }
  }, [wixClient]);

  useEffect(() => {
    if (wixClient) {
      getCart(wixClient).catch(error => {
        console.error("Error fetching cart:", error);
      });
    }
  }, [wixClient, getCart]);

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {    
    setIsCartOpen(false);
  };

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      Cookies.remove("refreshToken");
      if (wixClient && wixClient.auth) {
        const { logoutUrl } = await wixClient.auth.logout(window.location.href);
        setIsProfileOpen(false);
        router.push(logoutUrl);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/profile">Profile</Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? "Logging out" : "Logout"}
          </div>
        </div>
      )}
      <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div className="relative cursor-pointer">
        <button onClick={handleOpenCart}>
          <Image src="/cart.png" alt="" width={22} height={22} />
        </button>
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>

      {isCartOpen && <CartModal onClose={handleCloseCart} />}
    </div>
  );
};

export default NavIcons;

import { createClient, OAuthStrategy, RefreshToken } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { members } from "@wix/members";
import { createContext, ReactNode, useEffect, useState } from "react";
import { redirects } from "@wix/redirects";
import { GetServerSideProps } from "next";
import cookies from "next-cookies";

// Define the type of the Wix client
export type WixClient = ReturnType<typeof createClient>;

// Create a context to provide the Wix client throughout the app
export const WixClientContext = createContext<WixClient | null>(null);

export const WixClientProvider = ({ children, initialRefreshToken }: { children: ReactNode, initialRefreshToken: string }) => {
  const [wixClient, setWixClient] = useState<WixClient | null>(null);

  useEffect(() => {
    if (!initialRefreshToken) {
      console.error("No refresh token found");
      return;
    }

    try {
      const parsedRefreshToken: RefreshToken = JSON.parse(initialRefreshToken);
      const client = createClient({
        modules: { products, collections, currentCart, redirects, members },
        auth: OAuthStrategy({
          clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
          tokens: {
            refreshToken: parsedRefreshToken,
            accessToken: { value: "", expiresAt: 0 },
          },
        }),
      });

      setWixClient(client);
    } catch (error) {
      console.error("Error creating Wix client:", error);
    }
  }, [initialRefreshToken]);

  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};

export const wixClientServer = (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  try {
    const parsedRefreshToken: RefreshToken = JSON.parse(refreshToken);
    return createClient({
      modules: { products, collections, currentCart, redirects, members },
      auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
        tokens: {
          refreshToken: parsedRefreshToken,
          accessToken: { value: "", expiresAt: 0 },
        },
      }),
    });
  } catch (error) {
    console.error("Error creating Wix client on the server:", error);
    throw error;
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const allCookies = cookies(context);

  const refreshToken = allCookies.refreshToken;

  if (!refreshToken) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  try {
    const wixClient = wixClientServer(refreshToken);

    // Optionally, perform operations with the Wix client here
  } catch (error) {
    console.error("Error initializing Wix client on the server:", error);
  }

  return {
    props: { initialRefreshToken: refreshToken },
  };
};

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
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const router = useRouter();
//   const pathName = usePathname();

//   const wixClient = useWixClient();
//   const { cart, counter, getCart } = useCartStore();

//   useEffect(() => {
//     if (wixClient && wixClient.auth) {
//       setIsLoggedIn(wixClient.auth.loggedIn?.() || false);
//     }
//   }, [wixClient]);

//   useEffect(() => {
//     if (wixClient) {
//       getCart(wixClient).catch(error => {
//         console.error("Error fetching cart:", error);
//       });
//     }
//   }, [wixClient, getCart]);

//   const handleOpenCart = () => {
//     setIsCartOpen(true);
//   };

//   const handleCloseCart = () => {    
//     setIsCartOpen(false);
//   };

//   const handleProfile = () => {
//     if (!isLoggedIn) {
//       router.push("/login");
//     } else {
//       setIsProfileOpen((prev) => !prev);
//     }
//   };

//   const handleLogout = async () => {
//     setIsLoading(true);
//     try {
//       Cookies.remove("refreshToken");
//       if (wixClient && wixClient.auth) {
//         const { logoutUrl } = await wixClient.auth.logout(window.location.href);
//         setIsProfileOpen(false);
//         router.push(logoutUrl);
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//     } finally {
//       setIsLoading(false);
//     }
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
//       <div className="relative cursor-pointer">
//         <button onClick={handleOpenCart}>
//           <Image src="/cart.png" alt="" width={22} height={22} />
//         </button>
//         <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
//           {counter}
//         </div>
//       </div>

//       {isCartOpen && <CartModal onClose={handleCloseCart} />}
//     </div>
//   );
// };

// export default NavIcons;






