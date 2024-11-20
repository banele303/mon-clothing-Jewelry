return (
  <div className="">
    <Slider />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl sm:text-4xl font-serif mb-6 text-gray-900">MON CLOTHING & JEWELLERY</h1>
        <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-4">
          MON was born from the boundless creativity and curiosity of a young girl who found joy in crafting necklaces and earrings from beads. What began as a simple childhood passion has blossomed into a celebration of elegance and legacy.
        </p>
        <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-4">
          The name MON, meaning &quot;Mother of Nations&quot; or &quot;Mère de la Nation,&quot; embodies the spirit of a woman who is both graceful and profound. She is a beacon of purity and vision, dedicated to leaving a lasting legacy for future generations and she does so in style.
        </p>
        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
          At MON, we create jewellery for women who cherish both style and substance, knowing that their inner sparkle adds brilliance to any piece they wear.
        </p>
      </div>
      <div className="flex justify-center items-center">
        <div className="relative w-full max-w-md aspect-[3/4]">
          <Image
            alt="MON Jewellery craftsmanship"
            src="/owner.jpg"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
    <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-square">
      <Image
        alt="MON Jewellery craftsmanship"
        src="/owner.jpg"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover rounded-md"
      />
    </div>
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
        <ProductList
          categoryId={process.env.FEATURED_PRODUCTS_NEW_CATEGORY_ID!}
          limit={4}
        />
      </Suspense>
    </div>
  </div>
);

