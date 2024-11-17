// WixClientProvider.tsx
"use client";

import { createClient, OAuthStrategy, RefreshToken } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { members } from "@wix/members";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";
import { redirects } from "@wix/redirects";

// Define the type of the Wix client
export type WixClient = ReturnType<typeof createClient>;

// Create a context to provide the Wix client throughout the app
export const WixClientContext = createContext<WixClient | null>(null);

export const WixClientProvider = ({ children }: { children: ReactNode }) => {
  const [wixClient, setWixClient] = useState<WixClient | null>(null);

  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token found");
      return;
    }

    try {
      const parsedRefreshToken: RefreshToken = JSON.parse(refreshToken);
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
  }, []);

  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};




// wixClientServer.ts


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







// pages/some-page.tsx

// Import GetServerSideProps type from Next.js
import { GetServerSideProps } from "next";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context; // Access `req` from the context
  const cookies = req.headers.cookie || ""; // Retrieve cookies from the request header

  // Extract the refresh token from cookies
  const refreshToken = cookies
    .split("; ")
    .find((cookie) => cookie.startsWith("refreshToken="))
    ?.split("=")[1];

  if (!refreshToken) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  try {
    // Use the refresh token to initialize the Wix client on the server
    const wixClient = wixClientServer(refreshToken);

    // Optionally, perform operations with the Wix client here
  } catch (error) {
    console.error("Error initializing Wix client on the server:", error);
  }

  return {
    props: {}, // Pass props to the page component
  };
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
