"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock product list
const products = [
  { id: 1, name: "Gold Earrings", category: "earrings", price: 150 },
  { id: 2, name: "Silver Necklace", category: "necklaces", price: 200 },
  { id: 3, name: "Diamond Bracelet", category: "bracelets", price: 500 },
  { id: 4, name: "Platinum Earrings", category: "earrings", price: 300 },
  // Add more products as needed
];

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    // Extract filter parameters from URL
    const minPrice = searchParams.get("min");
    const maxPrice = searchParams.get("max");
    const category = searchParams.get("cat");

    // Filter products based on parameters
    let filtered = products;

    if (minPrice) {
      filtered = filtered.filter((product) => product.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((product) => product.price <= Number(maxPrice));
    }
    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    setFilteredProducts(filtered);
  }, [searchParams]);

  return (
    <div>
      <div className="mt-12 flex flex-col lg:flex-row justify-between items-center bg-white p-4 shadow rounded-lg">
        <div className="flex flex-wrap gap-4 mb-4 lg:mb-0">
          <input
            type="text"
            name="min"
            placeholder="Min Price"
            className="text-sm p-2 rounded-lg border border-gray-300 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="max"
            placeholder="Max Price"
            className="text-sm p-2 rounded-lg border border-gray-300 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFilterChange}
          />
          <select
            name="cat"
            className="text-sm p-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFilterChange}
          >
            <option value="">Select Category</option>
            <option value="new">New Arrival</option>
            <option value="popular">Popular</option>
            <option value="earrings">Earrings</option>
            <option value="bracelets">Bracelets</option>
            <option value="necklaces">Necklaces</option>
          </select>
        </div>
      </div>

      {/* Render filtered products */}
      <div className="mt-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg mb-4">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;

// "use client";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// const Filter = () => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const { replace } = useRouter();

//   const handleFilterChange = (
//     e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     const params = new URLSearchParams(searchParams);
//     params.set(name, value);
//     replace(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <div className="mt-12 flex flex-col lg:flex-row justify-between items-center bg-white p-4 shadow rounded-lg">
//       <div className="flex flex-wrap gap-4 mb-4 lg:mb-0">

//         <input
//           type="text"
//           name="min"
//           placeholder="Min Price"
//           className="text-sm p-2 rounded-lg border border-gray-300 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={handleFilterChange}
//         />
        
//         <input
//           type="text"
//           name="max"
//           placeholder="Max Price"
//           className="text-sm p-2 rounded-lg border border-gray-300 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={handleFilterChange}
//         />
        
//         <select
//           name="cat"
//           className="text-sm p-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={handleFilterChange}
//         >
//           <option value="">Select Category</option>
//           <option value="new">New Arrival</option>
//           <option value="popular">Popular</option>
//           <option value="earrings">Earrings</option>
//           <option value="bracelets">Bracelets</option>
//           <option value="necklaces">Necklaces</option>
//         </select>
        
       
//       </div>
//     </div>
//   );
// };

// export default Filter;




// "use client";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// const Filter = () => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const { replace } = useRouter();

//   const handleFilterChange = (
//     e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     const params = new URLSearchParams(searchParams);
//     params.set(name, value);
//     replace(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <div className="mt-12 flex justify-between">
//       <div className="flex gap-6 flex-wrap">
        
//         <input
//           type="text"
//           name="min"
//           placeholder="min price"
//           className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
//           onChange={handleFilterChange}
//         />
//         <input
//           type="text"
//           name="max"
//           placeholder="max price"
//           className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
//           onChange={handleFilterChange}
//         />
//         {/* TODO: Filter Categories */}
//         <select
//           name="cat"
//           className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
//           onChange={handleFilterChange}
//         >
//           <option>Category</option>
//           <option value="">New Arrival</option>
//           <option value="">Popular</option>
//         </select>
//         <select
//           name=""
//           id=""
//           className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
//         >
          
//         </select>
//       </div>
     
//     </div>
//   );
// };

// export default Filter;
