import Image from "next/image";
import SecondSection from "./second-section";

export default function Component() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-[4rem] items-start">
          <div className="prose prose-slate lg:prose-lg max-w-none">
            <h1 className="text-4xl font-serif mb-8 text-gray-900">MON CLOTHING & JEWELLERY</h1>
            
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              MON was born from the boundless creativity and curiosity of a young girl who found joy in crafting necklaces and earrings from beads. What began as a simple childhood passion has blossomed into a celebration of elegance and legacy.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              The name MON, meaning &quot;Mother of Nations&quot; or &quot;Mère de la Nation,&quot; embodies the spirit of a woman who is both graceful and profound. She is a beacon of purity and vision, dedicated to leaving a lasting legacy for future generations and she does so in style.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              At MON, we create jewellery for women who cherish both style and substance, knowing that their inner sparkle adds brilliance to any piece they wear.
            </p>
          </div>
          
          <div className="flex justify-center items-center  relative w-full h-full overflow-hidden ">
  <Image
    alt="MON Jewellery craftsmanship"
    fill
    sizes="25vw"
    className="object-cover rounded-md z-10 transition-opacity ease duration-500 rounded-md max-w-[280px] md:h-[520px]"
    src="/owner.jpg"
  />
</div>

        </div>





        

<SecondSection/>

      </div>
    );
  }