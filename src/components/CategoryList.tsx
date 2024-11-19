

import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Browse Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className="group"
          >
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.media?.mainMedia?.image?.url || "/placeholder.svg"}
                    alt={item.name || "Category image"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;


// import { wixClientServer } from "@/lib/wixClientServer";
// import Image from "next/image";
// import Link from "next/link";

// const CategoryList = async () => {
//   const wixClient = await wixClientServer();

//   const cats = await wixClient.collections.queryCollections().find();

//   return (
//     <div className="px-4 overflow-x-scroll scrollbar-hide flex items-center justify-center">
//       <div className="flex gap-4 md:gap-[3rem]">
//         {cats.items.map((item) => (
//           <Link
//             href={`/list?cat=${item.slug}`}
//             className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
//             key={item._id}
//           >
//            <div className="relative w-full  h-[250px] bg-slate-100 rounded-lg overflow-hidden">
//               <Image
//                 src={item.media?.mainMedia?.image?.url || "/cat.png"}
//                 alt={item.name || "Category image"}
//                 width={200}
//                 height={300}
//                 className="object-cover w-full h-full"
//                 sizes="300px"
//               />
//             </div>
//             <h1 className="mt-8 font-light text-xl font-bold tracking-wide">
//               {item.name}
//             </h1>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryList;
