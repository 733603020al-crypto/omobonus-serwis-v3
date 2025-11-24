import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { services } from '@/lib/services-data'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

// Generuje statyczne ścieżki dla wszystkich usług przy budowaniu
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  // W Next.js 15+ params jest Promise, więc trzeba go awaitować
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-paper-texture pt-[65px]">
        {/* Overlay dla lepszej czytelności na teksturze */}
        <div className="min-h-[calc(100vh-65px)] bg-black/60 relative flex items-center justify-center py-20">
          
          <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
            {/* Ikona / Ilustracja */}
            <div className="mb-8 flex justify-center">
              <div className="w-[150px] h-[150px] relative bg-black/30 rounded-full p-6 border border-[#bfa76a]/50 backdrop-blur-sm">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={150}
                  height={150}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            </div>

            {/* Tytuł */}
            <h1 className="text-[40px] md:text-[56px] font-cormorant font-bold text-[#bfa76a] mb-8 leading-tight">
              {service.title}
            </h1>

            {/* Opis */}
            <div className="text-[18px] md:text-[20px] font-sans leading-relaxed text-white/90 mb-12 max-w-2xl mx-auto">
              {service.description}
            </div>

            {/* CTA */}
            <Link
              href="/#kontakt"
              className="inline-flex items-center justify-center border border-[#bfa76a] text-[18px] text-[#bfa76a] py-3 px-8 rounded-full hover:bg-[#bfa76a] hover:text-black transition-all duration-300 font-cormorant font-bold tracking-wide"
            >
              Wyślij zgłoszenie
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
