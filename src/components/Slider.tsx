
"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Buy 3 & Get Up to 50% off!",
    img: "/himg8.jpeg",
    url: "/",
    bg: "bg-gradient-to-r from-yellow-100 to-pink-100",
  },
  {
    id: 2,
    title: "summer Sale Collections",
    description: "Sale! Up to 20% off!",
    img: "/img3.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-pink-100 to-blue-100",
  },
  {
    id: 3,
    title: "Spring Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "/himg2.jpeg",
    url: "/",
    bg: "bg-gradient-to-r from-blue-100 to-yellow-100",
  },
];

export default function ModernSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-[300vw] h-full flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col md:flex-row items-center justify-center`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center gap-4 md:gap-8 text-center p-4 md:p-8">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-light text-gray-700 animate-fadeIn">
                {slide.description}
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 animate-slideUp">
                {slide.title}
              </h1>
              
            </div>
            {/* IMAGE CONTAINER */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden px-[2rem] rounded-md">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
      {/* NAVIGATION ARROWS */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white bg-opacity-50 text-gray-800 transition-all duration-300 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          aria-label="Previous slide"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white bg-opacity-50 text-gray-800 transition-all duration-300 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          aria-label="Next slide"
        >
          <ArrowRight size={24} />
        </button>
      </div>
      {/* NAVIGATION DOTS */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-gray-800 scale-125"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}



// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// const slides = [
//   {
//     id: 1,
//     title: "Summer Sale Collections",
//     description: "Sale! Up to 50% off!",
//     img: "/img5.jpg",
//     url: "/",
//     bg: "bg-gradient-to-r from-yellow-50 to-pink-50",
//   },
//   {
//     id: 2,
//     title: "Winter Sale Collections",
//     description: "Sale! Up to 50% off!",
//     img: "/img2.jpg",
//     url: "/",
//     bg: "bg-gradient-to-r from-pink-50 to-blue-50",
//   },
//   {
//     id: 3,
//     title: "Spring Sale Collections",
//     description: "Sale! Up to 50% off!",
//     img: "/img3.jpg",
//     url: "/",
//     bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
//   },
// ];

// const Slider = () => {
//   const [current, setCurrent] = useState(0);

//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   //   }, 3000);

//   //   return () => clearInterval(interval);
//   // }, []);

//   return (
//     <div className="h-[calc(100vh-80px)] overflow-hidden">
//       <div
//         className="w-max h-full flex transition-all ease-in-out duration-1000"
//         style={{ transform: `translateX(-${current * 100}vw)` }}
//       >
//         {slides.map((slide) => (
//           <div
//             className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
//             key={slide.id}
//           >
//             {/* TEXT CONTAINER */}
//             <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
//               <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
//                 {slide.description}
//               </h2>
//               <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">
//                 {slide.title}
//               </h1>
//               <Link href={slide.url}>
//                 <button className="rounded-md bg-black text-white py-3 px-4 ">
//                   SHOP NOW
//                 </button>
//               </Link>
//             </div>
//             {/* IMAGE CONTAINER */}
//             <div className="h-1/2 xl:w-1/2 xl:h-full relative">
//               <Image
//                 src={slide.img}
//                 alt=""
//                 fill
//                 sizes="100%"
//                 className="object-cover"
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
//         {slides.map((slide, index) => (
//           <div
//             className={`w-3 h-3  rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
//               current === index ? "scale-150" : ""
//             }`}
//             key={slide.id}
//             onClick={() => setCurrent(index)}
//           >
//             {current === index && (
//               <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Slider;
