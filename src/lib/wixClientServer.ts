'use server'

// Refactor wixClientServer to work without req
import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { orders } from "@wix/ecom";
import { parse } from "cookie";
import { members } from "@wix/members";

// Refactor wixClientServer to remove dependency on `req`
export const wixClientServer = async () => {
  let refreshToken;

  // Access cookies directly or use a fallback strategy if on the client-side
  if (typeof window !== "undefined") {
    const cookies = parse(document.cookie);
    refreshToken = JSON.parse(cookies.refreshToken || "{}");
  }

  const wixClient = createClient({
    modules: {
      products,
      collections,
      orders,
      members,
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken,
        accessToken: { value: "", expiresAt: 0 },
      },
    }),
  });

  return wixClient;
};




