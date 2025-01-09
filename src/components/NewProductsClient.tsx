'use client'

import { Heart, ShoppingCart, Star } from 'lucide-react'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Pagination from "./Pagination";
import { useState } from 'react';
import { products } from "@wix/stores";

const NewProductsClient = ({ 
  productsData, 
  searchParams 
}: { 
  productsData: { 
    products: products.Product[], 
    currentPage: number, 
    hasPrev: boolean, 
    hasNext: boolean 
  }, 
  searchParams?: any 
}) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <main className="mx-auto  py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productsData.products.map((product: products.Product) => (
            <Link href={"/" + product.slug} key={product._id} className="group">
              <Card
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                onMouseEnter={() => product._id && setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
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
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-lg font-bold text-red-600">{product.price?.price}</span>
                      {product.price?.price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {product.price.price * 1.2}
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
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                 
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {(searchParams?.cat || searchParams?.name) && (
          <Pagination
            currentPage={productsData.currentPage}
            hasPrev={productsData.hasPrev}
            hasNext={productsData.hasNext}
          />
        )}
      </main>
    </div>
  );
};

export default NewProductsClient;
