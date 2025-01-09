import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MonOwnerSection() {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-rose-50 shadow-lg">
      <CardContent className="p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <Badge variant="secondary" className="mb-4">Elegance Redefined</Badge>
            <h1 className="text-3xl sm:text-4xl font-serif mb-6 text-gray-900 leading-tight">
              MON CLOTHING & JEWELLERY
            </h1>
            <div className="prose prose-slate max-w-none space-y-4">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                MON was born from the boundless creativity and curiosity of a young girl who found joy in crafting necklaces and earrings from beads. What began as a simple childhood passion has blossomed into a celebration of elegance and legacy.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                The name MON, meaning &quot;Mother of Nations&quot; or &quot;Mère de la Nation,&quot; embodies the spirit of a woman who is both graceful and profound. She is a beacon of purity and vision, dedicated to leaving a lasting legacy for future generations and she does so in style.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                At MON, we create jewellery for women who cherish both style and substance, knowing that their inner sparkle adds brilliance to any piece they wear.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full aspect-[4/5] max-w-md lg:max-w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-rose-200 rounded-2xl transform rotate-3 scale-95 z-0"></div>
              <Image
                alt="MON Jewellery craftsmanship"
                src="/owner.jpg"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-top rounded-2xl shadow-xl z-10"
                priority
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

