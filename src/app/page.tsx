import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import NewProducts from "@/components/NewProducts";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";


import { Suspense } from "react";
import MonOwnerSection from "./about-us/AboutMore";

const HomePage = async () => {
  // TEST (FETCHING ON THE CLIENT COMPONENT)

  // const wixClient = useWixClient()

  // useEffect(() => {
  //   const getProducts = async () => {
  //     const res = await wixClient.products.queryProducts().find();

  //     console.log(res)
  //   };

  //   getProducts();
  // }, [wixClient]);

  // TEST (FETCHING ON THE SERVER COMPONENT)

  // const wixClient = await wixClientServer();

  // const res = await wixClient.products.queryProducts().find();

  // console.log(res);

  return (
    <div className="">
      <Slider />
     <MonOwnerSection/>
      <div className="mt-10 md:mt-23 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl extratext-bold p-4 text-white py-3 px-5 bg-black rounded-md text-center">Featured Products</h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_FEATURED_CATEGORY_ID!}
            limit={8}
          />
        </Suspense>
      </div>
      <div className="mt-4">
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </div>
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


