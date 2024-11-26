


"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Menu, Search, ShoppingCart, User } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import SearchBar from "./SearchBar";
import MenuPhone from "./Menu";
import CartModal from "./CartModal";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <Image src="/logo.jpg" alt="MON Logo" width={124} height={124} />
        </Link>

        {/* RIGHT */}
        <div className="w-full justify-end flex items-end gap-8 md:pl-[3rem]">
          <NavIcons onCartClick={handleCartClick} />
          <MenuPhone />
        </div>
      </div>

      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="MON Logo" width={64} height={64} />
            <div className="text-xl tracking-wide">MON</div>
          </Link>
          <div className="hidden xl:flex gap-6 md:gap-9 md:pl-[3rem]">
            <Link href="/">Homepage</Link>
            <Link href="/">Shop</Link>
            <Link href="/">Deals</Link>
            <Link href="/about-us">About</Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8 md:pl-[3rem]">
          <SearchBar />
          <div className="flex items-center">
            <NavIcons onCartClick={handleCartClick} />
          </div>
        </div>
      </div>
      {isCartOpen && <CartModal onClose={handleCloseCart} />}
    </div>
  );
};

export default Navbar;








// <header className="border-b">
//         <div className="container mx-auto px-4">
//           <div className="flex h-16 items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Button variant="ghost" size="icon">
//                 <Menu className="h-6 w-6" />
//               </Button>
//               <h1 className="text-2xl font-bold">bash</h1>
//             </div>
//             <div className="hidden md:flex items-center space-x-4">
//               <Search className="h-6 w-6" />
//               <MapPin className="h-6 w-6" />
//               <User className="h-6 w-6" />
//               <ShoppingCart className="h-6 w-6" />
//             </div>
//           </div>
//         </div>
//       </header>
