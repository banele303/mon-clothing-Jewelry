import { NewProductsData } from './NewProductsData';
import NewProductsClient from './NewProductsClient';
import { products } from "@wix/stores";

const NewProducts = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const productsData: {
    products: products.Product[];
    currentPage: number;
    hasPrev: boolean;
    hasNext: boolean;
  } = await NewProductsData({ categoryId, limit, searchParams });

  return <NewProductsClient productsData={productsData} searchParams={searchParams} />;
};

export default NewProducts;













// import { Heart } from 'lucide-react'
// import { wixClientServer } from "@/lib/wixClientServer";
// import { products } from "@wix/stores";
// import Image from "next/image";
// import Link from "next/link";
// import DOMPurify from "isomorphic-dompurify";
// import Pagination from "./Pagination";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";

// import { ShoppingCart, Star, } from 'lucide-react';
// import { useState } from 'react';

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
//   const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
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
//     <div className="min-h-screen ">


//       <main className=" mx-auto px-4 py-8">


//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {res.items.map((product: products.Product) => (
//             <Link href={"/" + product.slug} key={product._id} className="group">
//               <Card
//                 className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
//                 onMouseEnter={() => product._id && setHoveredProduct(product._id)}
//                 onMouseLeave={() => setHoveredProduct(null)}
//               >
//                 <Link href={`/${product.slug}`}>
//                   <CardContent className="p-0">
//                     <div className="relative h-48 w-full overflow-hidden">
//                       <Image
//                         src={product.media?.mainMedia?.image?.url || "/placeholder.svg"}
//                         alt={product.name || "Product image"}
//                         layout="fill"
//                         objectFit="cover"
//                         className="transition-transform duration-300 group-hover:scale-110"
//                       />
//                       {product._id && hoveredProduct === product._id && (
//                         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                           <Button variant="secondary" size="sm" className="mr-2">
//                             Quick View
//                           </Button>
//                           <Button size="sm">
//                             <ShoppingCart className="w-4 h-4 mr-2" />
//                             Add to Cart
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
//                       <div className="mt-1 flex items-center">
//                         <span className="text-lg font-bold text-red-600">{product.price?.price}</span>
//                         {product.price?.price && (
//                           <span className="ml-2 text-sm text-gray-500 line-through">
//                             {product.price.price * 1.2}
//                           </span>
//                         )}
//                       </div>
//                       <div className="mt-1 flex items-center">
//                         {[...Array(5)].map((_, i) => (
//                           <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
//                         ))}
//                         <span className="ml-1 text-sm text-gray-500">(123)</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Link>
//                 <CardFooter className="p-4 pt-0 flex justify-between items-center">
//                   <Button variant="ghost" size="sm">
//                     <Heart className="w-4 h-4 mr-2" />
//                     Wishlist
//                   </Button>
//                   <span className="text-sm text-gray-500">Free Shipping</span>
//                 </CardFooter>
//               </Card>
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
