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

const NewProduct = async ({
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
    <div className="min-h-screen bg-gray-100">
      <header className="py-4 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-2xl font-bold">Shop</div>
          <span className="text-gray-600">112 items</span>
        </div>
      </header>

      <nav className="bg-white py-3 shadow">
        <div className="container mx-auto flex space-x-4 px-4">
          <Button variant="ghost">All</Button>
          <Button variant="ghost">Earrings</Button>
          <Button variant="ghost">Bracelets</Button>
          <Button variant="ghost">Necklaces</Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Newest</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">Filter</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {res.items.map((product: products.Product) => (
            <Link href={"/" + product.slug} key={product._id} className="group">
              <div className="relative h-64 w-full overflow-hidden rounded-md bg-gray-200">
                <Image
                  src={product.media?.mainMedia?.image?.url || "/product.png"}
                  alt="new products"
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:opacity-75 transition duration-300"
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-semibold">{product.name}</span>
                <span className="text-blue-600 font-semibold">
                  R{product.price?.price}
                </span>
              </div>
              {product.additionalInfoSections && (
                <div
                  className="text-sm text-gray-500 mt-1"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      product.additionalInfoSections.find(
                        (section: any) => section.title === "shortDesc"
                      )?.description || ""
                    ),
                  }}
                ></div>
              )}
              <button className="mt-3 w-full py-2 px-4 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
                Add to Cart
              </button>
            </Link>
          ))}
        </div>

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

export default NewProducts;
