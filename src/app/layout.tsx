import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WixClientProvider } from "@/context/wixContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MON Clothing & Juwellary",
  description: "We are the best Ecommerce company in SA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        < WixClientProvider>
          <Navbar />
          {children}
          <Footer />
        </ WixClientProvider >
      </body>
    </html>
  );
}
