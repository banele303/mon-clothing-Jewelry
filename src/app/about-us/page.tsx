import Image from "next/image"
import SecondSection from "./second-section"

export default function Component() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 items-start">
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
        
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-square">
          <Image
            alt="MON Jewellery craftsmanship"
            src="/owner.jpg"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover rounded-md"
          />
        </div>
      </div>

      <SecondSection />
    </div>
  )
}
