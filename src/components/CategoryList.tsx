import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";

const CategoryList = async () => {
  const wixClient = await wixClientServer();

  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide flex items-center justify-center">
      <div className="flex gap-4 md:gap-[3rem]">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            key={item._id}
          >
           <div className="relative w-full  h-[300px] bg-slate-100 rounded-lg overflow-hidden">
              <Image
                src={item.media?.mainMedia?.image?.url || "/cat.png"}
                alt={item.name || "Category image"}
                width={200}
                height={300}
                className="object-cover w-full h-full"
                sizes="300px"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide">
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
