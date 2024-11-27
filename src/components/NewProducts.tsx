'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, Star, Heart } from 'lucide-react'
import Pagination from "./Pagination"
import { wixClientServer } from "@/lib/wixClientServer"
import { products } from "@wix/stores"

const PRODUCT_PER_PAGE = 20

interface NewProductsProps {
  categoryId: string;
  limit?: number;
}

export default function NewProducts({ categoryId, limit = PRODUCT_PER_PAGE }: NewProductsProps) {
  const [products, setProducts] = useState<products.Product[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasPrev, setHasPrev] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const wixClient = await wixClientServer()
        const res = await wixClient.products
          .queryProducts()
          .eq("collectionIds", categoryId)
          .limit(limit)
          .find()

        setProducts(res.items)
        setCurrentPage(res.currentPage || 0)
        setHasPrev(res.hasPrev())
        setHasNext(res.hasNext())
      } catch (error) {
        console.error("Error fetching products:", error)
        // Handle error state here if needed
      }
    }

    fetchProducts()
  }, [categoryId, limit])

  const formatPrice = (price: number | null | undefined): string => {
    if (price == null) return 'N/A'
    return `R${price.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Newest</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Popularity</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <Card 
              key={product._id} 
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => product._id && setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link href={`/${product.slug}`}>
                <CardContent className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={product.media?.mainMedia?.image?.url || "/placeholder.svg"}
                      alt={product.name || "Product image"}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    {product._id && hoveredProduct === product._id && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="secondary" size="sm" className="mr-2">
                          Quick View
                        </Button>
                        <Button size="sm">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-lg font-bold text-red-600">{formatPrice(product.price?.price)}</span>
                      {product.price?.price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {formatPrice(product.price.price * 1.2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-1 text-sm text-gray-500">(123)</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <span className="text-sm text-gray-500">Free Shipping</span>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </main>
    </div>
  )
}





// import { wixClientServer } from "@/lib/wixClientServer";
// import { products } from "@wix/stores";
// import Image from "next/image";
// import Link from "next/link";
// import DOMPurify from "isomorphic-dompurify";
// import Pagination from "./Pagination";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { MapPin, Menu, Search, ShoppingCart, User } from 'lucide-react';

// const PRODUCT_PER_PAGE = 10;

// const NewProducts = async ({
//   categoryId,
//   limit,
//   searchParams,
// }: {
//   categoryId: string;
//   limit?: number;
//   searchParams?: any;
// }) => {
//   const wixClient = await wixClientServer();

//   const productQuery = wixClient.products
//     .queryProducts()
//     .startsWith("name", searchParams?.name || "")
//     .eq("collectionIds", categoryId)
//     .hasSome(
//       "productType",
//       searchParams?.type ? [searchParams.type] : ["physical", "digital"]
//     )
//     .gt("priceData.price", searchParams?.min || 0)
//     .lt("priceData.price", searchParams?.max || 999999)
//     .limit(limit || PRODUCT_PER_PAGE)
//     .skip(
//       searchParams?.page
//         ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
//         : 0
//     );

//   if (searchParams?.sort) {
//     const [sortType, sortBy] = searchParams.sort.split(" ");

//     if (sortType === "asc") {
//       productQuery.ascending(sortBy);
//     }
//     if (sortType === "desc") {
//       productQuery.descending(sortBy);
//     }
//   }

//   const res = await productQuery.find();

//   return (
//     <div className="min-h-screen bg-gray-100">
     

//       <main className="container mx-auto px-4 py-8">
       

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {res.items.map((product: products.Product) => (
//             <Link href={"/" + product.slug} key={product._id} className="group">
//               <div className="relative h-64 w-full overflow-hidden rounded-md bg-gray-200">
//                 <Image
//                   src={product.media?.mainMedia?.image?.url || "/product.png"}
//                   alt="new products"
//                   layout="fill"
//                   objectFit="cover"
//                   className="group-hover:opacity-75 transition duration-300"
//                 />
//               </div>
//               <div className="mt-2 flex justify-between items-center">
// {/*                 <span className="text-lg font-semibold">{product.name}</span> */}
//                 <span className="text-blue-600 font-semibold">
//                   R{product.price?.price}
//                 </span>
//               </div>
//               {product.additionalInfoSections && (
//                 <div
//                   className="text-sm text-gray-500 mt-1"
//                   dangerouslySetInnerHTML={{
//                     __html: DOMPurify.sanitize(
//                       product.additionalInfoSections.find(
//                         (section: any) => section.title === "shortDesc"
//                       )?.description || ""
//                     ),
//                   }}
//                 ></div>
//               )}
//               <button className="mt-3 w-full py-2 px-4 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
//                 Add to Cart
//               </button>
//             </Link>
//           ))}
//         </div>

//         {searchParams?.cat || searchParams?.name ? (
//           <Pagination
//             currentPage={res.currentPage || 0}
//             hasPrev={res.hasPrev()}
//             hasNext={res.hasNext()}
//           />
//         ) : null}
//       </main>
//     </div>
//   );
// };

// export default NewProducts;
