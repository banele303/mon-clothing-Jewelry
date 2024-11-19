import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MapPin, Menu, Search, ShoppingCart, User } from 'lucide-react';

const PRODUCT_PER_PAGE = 4;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const wixClient = await wixClientServer();

  const productQuery = wixClient.products
    .queryProducts()
    .startsWith("name", searchParams?.name || "")
    .eq("collectionIds", categoryId)
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 999999)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
        : 0
    );

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");

    if (sortType === "asc") {
      productQuery.ascending(sortBy);
    }
    if (sortType === "desc") {
      productQuery.descending(sortBy);
    }
  }

  const res = await productQuery.find();

  return (
    <div className="min-h-screen bg-background">
     

      {/* Category Menu */}
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto py-4">
            <Button variant="ghost">All</Button>
            <Button variant="ghost">Earrings</Button>
            <Button variant="ghost">Bracelets</Button>
            <Button variant="ghost">Necles</Button>
          </div>
        </div>
      </nav>

      {/* Shop Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl blue-800 font-bold">Shop</h2>
          <span className="text-muted-foreground blue-400">112 items</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Newest</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Newest</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">Filter</Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4  gap-4">
          {res.items.map((product: products.Product) => (
            <Link
              href={"/" + product.slug}
              className="w-full flex flex-col gap-4  lg:w-[22%]"
              key={product._id}
            >
              <div className="relative  md:w-[15vw] h-[30vh] ">
                <Image
                  src={product.media?.mainMedia?.image?.url || "/product.png"}
                  alt=""
                  fill
                  sizes="25vw"
                  className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
                />
                {product.media?.items && (
                  <Image
                    src={product.media?.items[1]?.image?.url || "/product.png"}
                    alt=""
                    fill
                    sizes="20vw"
                    className="absolute object-cover rounded-md"
                  />
                )}
              </div>
              <div className="flex justify-between ">
                <span className="text-[16px] md:mr-[4rem]">{product.name}</span>
                <span className="font-semibold text-blue-400">R{product.price?.price}</span>
              </div>
              {product.additionalInfoSections && (
                <div
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      product.additionalInfoSections.find(
                        (section: any) => section.title === "shortDesc"
                      )?.description || ""
                    ),
                  }}
                ></div>
              )}
              <button className="rounded-md ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
                Add to Cart
              </button>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {searchParams?.cat || searchParams?.name ? (
          <Pagination
            currentPage={res.currentPage || 0}
            hasPrev={res.hasPrev()}
            hasNext={res.hasNext()}
          />
        ) : null}
      </main>
    </div>
  );
};

export default ProductList;




// // import { wixClientServer } from "@/lib/wixClientServer";
// // import { products } from "@wix/stores";
// // import Image from "next/image";
// // import Link from "next/link";
// // import DOMPurify from "isomorphic-dompurify";
// // import Pagination from "./Pagination";
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardFooter } from "@/components/ui/card"
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu"
// // import { Input } from "@/components/ui/input"
// // import { MapPin, Menu, Search, ShoppingCart, User } from 'lucide-react'

// const PRODUCT_PER_PAGE = 4;

// const ProductList = async ({
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
//   // .find();

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
//     <div className="min-h-screen bg-background">
//       {/* Navigation Bar */}
//       <header className="border-b">
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

// //       {/* Category Menu */}
// //       <nav className="border-b">
// //         <div className="container mx-auto px-4">
// //           <div className="flex space-x-8 overflow-x-auto py-4">
// //             <Button variant="ghost">All</Button>
// //             <Button variant="ghost">Black Friday</Button>
// //             <Button variant="ghost">Women</Button>
// //             <Button variant="ghost">Men</Button>
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Shop Section */}
// //       <main className="container mx-auto px-4 py-8">
// //         <div className="flex items-center justify-between mb-8">
// //           <h2 className="text-2xl font-bold">Shop</h2>
// //           <span className="text-muted-foreground">1512 items</span>
// //         </div>

// //         <div className="flex items-center justify-between mb-8">
// //           <DropdownMenu>
// //             <DropdownMenuTrigger asChild>
// //               <Button variant="outline">Newest</Button>
// //             </DropdownMenuTrigger>
// //             <DropdownMenuContent>
// //               <DropdownMenuItem>Newest</DropdownMenuItem>
// //               <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
// //               <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
// //             </DropdownMenuContent>
// //           </DropdownMenu>

// //           <Button variant="outline">Filter</Button>
// //         </div>

// //         {/* Product Grid */}
// //         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
// //           {/* Product Card 1 */}
// //           <Card className="border-0 rounded-none">
// //             <CardContent className="p-0">
// //               <div className="relative aspect-square">
// //                 <img
// //                   src="/placeholder.svg?height=400&width=400"
// //                   alt="Gold Plated Logo Earrings"
// //                   className="object-cover w-full h-full"
// //                 />
// //                 <div className="absolute top-2 left-2 space-y-1">
// //                   <span className="bg-black text-white text-xs px-2 py-1">NEW</span>
// //                   <div className="bg-black text-white text-xs px-2 py-1">ONLINE EXCLUSIVE</div>
// //                 </div>
// //               </div>
// //             </CardContent>
// //             <CardFooter className="flex flex-col items-start p-4">
// //               <h3 className="font-medium">Women's Iconography Gold Plated Logo Earrings</h3>
// //               <p className="text-sm text-muted-foreground">Iconography</p>
// //               <p className="font-bold mt-2">R349.00</p>
// //             </CardFooter>
// //           </Card>

// //           {/* Product Card 2 */}
// //           <Card className="border-0 rounded-none">
// //             <CardContent className="p-0">
// //               <div className="relative aspect-square">
// //                 <img
// //                   src="/placeholder.svg?height=400&width=400"
// //                   alt="White Gold Diamond Earrings"
// //                   className="object-cover w-full h-full"
// //                 />
// //                 <div className="absolute top-2 left-2">
// //                   <span className="bg-red-500 text-white text-xs px-2 py-1">SALE</span>
// //                 </div>
// //               </div>
// //             </CardContent>
// //             <CardFooter className="flex flex-col items-start p-4">
// //               <h3 className="font-medium">White Gold 1.5ct Lab Grown Diamond Round Earrings</h3>
// //               <p className="text-sm text-muted-foreground">American Swiss</p>
// //               <div className="flex items-center gap-2 mt-2">
// //                 <p className="font-bold">R17,999.00</p>
// //                 <p className="text-sm text-muted-foreground line-through">R22,999.00</p>
// //               </div>
// //             </CardFooter>
// //           </Card>

// //           {/* Additional Product Cards would follow the same pattern */}
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }








// import { wixClientServer } from "@/lib/wixClientServer";
// import { products } from "@wix/stores";
// import Image from "next/image";
// import Link from "next/link";
// import DOMPurify from "isomorphic-dompurify";
// import Pagination from "./Pagination";

// const PRODUCT_PER_PAGE = 4;

// const ProductList = async ({
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
//   // .find();

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
//     <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
// {res.items.map((product: products.Product) => (
//         <Link
//           href={"/" + product.slug}
//           className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
//           key={product._id}
//         >
//           <div className="relative w-full h-60">
//             <Image
//               src={product.media?.mainMedia?.image?.url || "/product.png"}
//               alt=""
//               fill
//               sizes="25vw"
//               className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
//             />
//             {product.media?.items && (
//               <Image
//                 src={product.media?.items[1]?.image?.url || "/product.png"}
//                 alt=""
//                 fill
//                 sizes="20vw"
//                 className="absolute object-cover rounded-md"
//               />
//             )}
//           </div>
//           <div className="flex justify-between">
//             <span className="font-medium">{product.name}</span>
//             <span className="font-semibold">R{product.price?.price}</span>
//           </div>
//           {product.additionalInfoSections && (
//             <div
//               className="text-sm text-gray-500"
//               dangerouslySetInnerHTML={{
//                 __html: DOMPurify.sanitize(
//                   product.additionalInfoSections.find(
//                     (section: any) => section.title === "shortDesc"
//                   )?.description || ""
//                 ),
//               }}
//             ></div>
//           )}
//           <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
//             Add to Cart
//           </button>
//         </Link>
//       ))}
//       {searchParams?.cat || searchParams?.name ? (
//         <Pagination
//           currentPage={res.currentPage || 0}
//           hasPrev={res.hasPrev()}
//           hasNext={res.hasNext()}
//         />
//       ) : null}
//     </div>
//   );
// };

// export default ProductList;
