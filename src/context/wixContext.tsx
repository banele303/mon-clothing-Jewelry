"use client";

import { createClient, OAuthStrategy, RefreshToken } from "@wix/sdk";
import { products, collections } from "@wix/stores";  // Removed orders import
import { currentCart } from "@wix/ecom";
import { members } from "@wix/members";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";
import { redirects } from "@wix/redirects";

// Define the type of the Wix client
export type WixClient = ReturnType<typeof createClient>;

// Create a context to provide the Wix client throughout the app
export const WixClientContext = createContext<WixClient | null>(null);

// Client-side provider for Wix Client
export const WixClientProvider = ({ children }: { children: ReactNode }) => {
  const [wixClient, setWixClient] = useState<WixClient | null>(null);

  useEffect(() => {
    // Retrieve the refresh token from cookies
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      console.error("No refresh token found");
      return;
    }

    try {
      // Parse the refresh token into the expected structure
      const parsedRefreshToken: RefreshToken = JSON.parse(refreshToken);

      // Initialize the Wix client
      const client = createClient({
        modules: { products, collections, currentCart, redirects, members },  // Removed orders
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
  }, []);

  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};

// Server-side function to initialize Wix client
export const wixClientServer = async () => {
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    // Parse the refresh token into the expected structure
    const parsedRefreshToken: RefreshToken = JSON.parse(refreshToken);

    return createClient({
      modules: { products, collections, currentCart, redirects, members },  // Removed orders
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







// "use client";

// import { createClient, OAuthStrategy } from "@wix/sdk";
// import { products, collections } from "@wix/stores";
// import { currentCart } from "@wix/ecom";
// import Cookies from "js-cookie";
// import { createContext, ReactNode } from "react";
// import { redirects } from '@wix/redirects';

// const refreshToken = JSON.parse(Cookies.get("refreshToken") || "{}");

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
