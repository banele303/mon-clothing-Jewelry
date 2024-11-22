

import { OAuthStrategy, createClient } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const res = NextResponse.next();

  if (cookies.get("refreshToken")) {
    return res;
  }

  try {
    console.log("Initializing Wix client...");
    const wixClient = createClient({
      auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
    });

    console.log("Attempting to generate visitor tokens...");
    const tokens = await wixClient.auth.generateVisitorTokens();

    if (tokens && tokens.refreshToken) {
      console.log("Visitor tokens generated successfully.");
      res.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    } else {
      console.error("Tokens or refreshToken is undefined.");
    }
  } catch (error) {
    console.error("Error generating visitor tokens:", error);
    
    // Log additional information
    console.error("Environment variables:");
    console.error("NEXT_PUBLIC_WIX_CLIENT_ID:", process.env.NEXT_PUBLIC_WIX_CLIENT_ID);
    console.error("NODE_ENV:", process.env.NODE_ENV);

    // You might want to set a cookie or header to indicate the error
    res.cookies.set("authError", "Failed to generate visitor tokens", {
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }

  return res;
}


// import { OAuthStrategy, createClient } from "@wix/sdk";
// import { NextRequest, NextResponse } from "next/server";

// export const middleware = async (request: NextRequest) => {
//   const cookies = request.cookies;
//   const res = NextResponse.next();

//   if (cookies.get("refreshToken")) {
//     return res;
//   }

//   const wixClient = createClient({
//     auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
//   });

//   const tokens = await wixClient.auth.generateVisitorTokens();
//   res.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
//     maxAge: 60 * 60 * 24 * 30,
//   });

//   return res;
// };
