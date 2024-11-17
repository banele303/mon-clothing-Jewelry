import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import Reviews from "@/components/Reviews";
import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";

interface PageProps {
  params: {
    slug: string;
  };
}

const SinglePage = async ({ params }: PageProps) => {
  const wixClient = await wixClientServer();

  // Fetch product data by slug
  const products = await wixClient.products
    .queryProducts()
    .eq("slug", params.slug)
    .find();

  // Handle case where no product is found
  if (!products.items[0]) {
    return notFound();
  }

  const product = products.items[0];

  return (
    <div>
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
        {/* IMG */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages items={product.media?.items} />
        </div>
        {/* TEXTS */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-medium">{product.name}</h1>
          {product.description && (
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
          )}
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
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.description) }} />
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

      <div className="px-8 md:px-[2rem]">
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_FEATURED_CATEGORY_ID!}
            limit={8}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default SinglePage;





// import Add from "@/components/Add";
// import CustomizeProducts from "@/components/CustomizeProducts";
// import ProductImages from "@/components/ProductImages";
// import Reviews from "@/components/Reviews";
// import { wixClientServer } from "@/lib/wixClientServer";
// import { notFound } from "next/navigation";
// import DOMPurify from 'isomorphic-dompurify'
// import { Suspense } from "react";
// import ProductList from "@/components/ProductList";
// import Skeleton from "@/components/Skeleton";




// const SinglePage = async ({ params }: { params: { slug: string } }) => {
//   const wixClient = await wixClientServer();

//   const products = await wixClient.products
//     .queryProducts()
//     .eq("slug", params.slug)
//     .find();

//   if (!products.items[0]) {
//     return notFound();
//   }

//   const product = products.items[0];




//   return (
//     <div>
//     <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
//       {/* IMG */}
//       <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
//         <ProductImages items={product.media?.items} />
//       </div>
//       {/* TEXTS */}
//       <div className="w-full lg:w-1/2 flex flex-col gap-6">
//         <h1 className="text-4xl font-medium">{product.name}</h1>
//         {/* <p className="text-gray-500">{product.description}</p> */}
//         {product.description && (
//           <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
//         )}
//         <div className="h-[2px] bg-gray-100" />
//         {product.price?.price === product.price?.discountedPrice ? (
//           <h2 className="font-medium text-2xl">R{product.price?.price}</h2>
//         ) : (
//           <div className="flex items-center gap-4">
//             <h3 className="text-xl text-gray-500 line-through">
//               ${product.price?.price}
//             </h3>
//             <h2 className="font-medium text-2xl">
//               ${product.price?.discountedPrice}
//             </h2>
//           </div>
//         )}
//         <div className="h-[2px] bg-gray-100" />
//         {product.variants && product.productOptions ? (
//           <CustomizeProducts
//             productId={product._id!}
//             variants={product.variants}
//             productOptions={product.productOptions}
//           />
//         ) : (
//           <Add
//             productId={product._id!}
//             variantId="00000000-0000-0000-0000-000000000000"
//             stockNumber={product.stock?.quantity || 0}
//           />
//         )}
//         <div className="h-[2px] bg-gray-100" />
//         {product.additionalInfoSections?.map((section: any) => (
//           <div className="text-sm" key={section.title}>
//             <h4 className="font-medium mb-4">{section.title}</h4>
//             <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.description) }} />
//             {/* <h4>{section.description}</h4> */}
//           </div>
//         ))}
//         <div className="h-[2px] bg-gray-100" />
//         {/* REVIEWS */}
//         <h1 className="text-2xl">User Reviews</h1>
//         <Suspense fallback="Loading...">
//           <Reviews productId={product._id!} />
//         </Suspense>
//       </div>


     
//     </div>
// <div className="px-8 md:px-[2rem]">
// <Suspense fallback={<Skeleton />}>
//         <ProductList
//           categoryId={process.env.FEATURED_PRODUCTS_FEATURED_CATEGORY_ID!}
//           limit={8} />
//       </Suspense>
// </div>
    
//     </div>
//   );
// };

// export default SinglePage;
