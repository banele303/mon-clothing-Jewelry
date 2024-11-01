import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SecondSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Our Story
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">MON Clothing & Jewellery</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Born from boundless creativity and a passion for artisanal craft, MON represents more than just a brand—it&apos;s
                a celebration of elegance and legacy.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/collections">
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300">
                  Explore Collections
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Our Heritage</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  The name MON, meaning &quot;Mother of Nations,&quot; embodies our spirit of grace and profound purpose. We are
                  dedicated to creating pieces that tell stories and leave lasting legacies.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Artisanal Craft</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Each piece is thoughtfully designed and meticulously crafted, combining traditional techniques with modern
                  aesthetics to create timeless accessories that speak to the soul.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Our Promise</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We create jewelry and clothing for those who cherish both style and substance, offering pieces that
                  celebrate individuality while maintaining the highest standards of quality and sustainability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Established with love and dedication, MON continues to grow while staying true to its founding principles of
            elegance, quality, and meaningful design.
          </p>
        </div>
      </div>
    </section>
  )
}