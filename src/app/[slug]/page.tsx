
import DOMPurify from "isomorphic-dompurify";
import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import Reviews from "@/components/Reviews";
import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Skeleton from "@/components/Skeleton";
import NewProducts from "@/components/NewProducts";

type Params = Promise<{ slug: string[] }>;

export default async function SinglePage({ params }: { params: Params }) {

  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const wixClient = await wixClientServer();

  const products = await wixClient.products
    .queryProducts()
    .eq("slug", slug)
    .find();

  if (!products.items[0]) {
    return notFound();
  }

  const product = products.items[0];

  return (
    <div>
    <div className="px-4 mt-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full md:w-1/2 lg:sticky top-20 ">
        <ProductImages items={product.media?.items} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
{/*         <div>{product.description}</div> */}
        <div className="h-[2px] bg-gray-100" />
        {product.price?.price === product.price?.discountedPrice ? (
          <h2 className="font-medium text-2xl">R{product.price?.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${product.price?.price}
            </h3>
            <h2 className="font-medium text-2xl">
              ${product.price?.discountedPrice}
            </h2>
          </div>
        )}
        <div className="h-[2px] bg-gray-100" />
        {product.variants && product.productOptions ? (
          <CustomizeProducts
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : (
          <Add
            productId={product._id!}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={product.stock?.quantity || 0}
          />
        )}
        <div className="h-[2px] bg-gray-100" />
        {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>

            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.description) }} ></div>
{/*             <div className="text-[16px]">{section.description}</div> */}
          </div>
        ))}
        <div className="h-[2px] bg-gray-100" />
        {/* REVIEWS */}
        <h1 className="text-2xl">User Reviews</h1>
        <Suspense fallback="Loading...">
          <Reviews productId={product._id!} />
        </Suspense>
      </div>

      
    </div>
 {/* <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl text-bold">New Products</h1>
        <Suspense fallback={<Skeleton />}>
          <NewProducts
            categoryId={process.env.NEXT_PUBLIC_EARRINGS_ID!}
            limit={4}
          />
        </Suspense>
      </div> */}
      
    </div>
  );
};

          
{/*         {product.price?.price === product.price?.discountedPrice ? (
          <h2 className="font-medium text-2xl">R{product.price?.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${product.price?.price}
            </h3>
            <h2 className="font-medium text-2xl">
              ${product.price?.discountedPrice}
            </h2>
          </div>
        )}
        <div className="h-[2px] bg-gray-100" />
        {product.variants && product.productOptions ? (
          <CustomizeProducts
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : (
          <Add
            productId={product._id!}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={product.stock?.quantity || 0}
          />
        )}
        <div className="h-[2px] bg-gray-100" />
        {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            <h3>{section.description}</h3>
          </div>
        ))}
        <div className="h-[2px] bg-gray-100" />
        {/* REVIEWS */}
       
 





