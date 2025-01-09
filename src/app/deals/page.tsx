import NewProducts from "@/components/NewProducts";
import Skeleton from "@/components/Skeleton";
import { Suspense, useContext, useEffect } from "react";

const HomePage = async () => {
 

  return (
    <div className="">
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl text-bold">New Products</h1>
        <Suspense fallback={<Skeleton />}>
          <NewProducts
            categoryId={process.env.FEATURED_PRODUCTS_NEW_CATEGORY_ID!}
            limit={4}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;


