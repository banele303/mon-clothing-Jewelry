"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Buy 3 & Get Up to 50% off!",
    img: "/himg8.jpeg",
    url: "/summer-sale",
    bg: "bg-gradient-to-r from-yellow-100 to-pink-100",
  },
  {
    id: 2,
    title: "Elegant Essentials",
    description: "Sale! Up to 20% off!",
    img: "/img3.jpg",
    url: "/elegant-essentials",
    bg: "bg-gradient-to-r from-pink-100 to-blue-100",
  },
  {
    id: 3,
    title: "Spring Favorites",
    description: "Sale! Up to 50% off!",
    img: "/himg2.jpeg",
    url: "/spring-favorites",
    bg: "bg-gradient-to-r from-blue-100 to-yellow-100",
  },
];

export default function ElegantHeroSlider() {
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
          <Card
            key={slide.id}
            className={`${slide.bg} w-screen h-full border-none rounded-none shadow-none`}
          >
            <CardContent className="flex flex-col md:flex-row items-center justify-center h-full p-0">
              <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center gap-6 text-center p-8">
                <Badge variant="secondary" className="text-sm md:text-base">
                  New Collection
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-md">
                  {slide.description}
                </p>
                <Link href="/deals">
                <Button className="mt-4" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
                </Button>
                </Link>
                
              </div>
              <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="rounded-full bg-white/50 text-gray-800 hover:bg-white/75"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="rounded-full bg-white/50 text-gray-800 hover:bg-white/75"
          aria-label="Next slide"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
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

