import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import manifest from '@/config/KANONICZNY_MANIFEST.json'

export function About() {
  return (
    <section id="o-nas" className="relative py-16 md:py-24">
      {/* Tło */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${manifest.Background_1}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Zawartość */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Lewa kolumna - obraz */}
          <div className="max-w-sm md:max-w-md mx-auto md:mx-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-2xl">
              <Image
                src={manifest.omobonus_hero}
                alt="Święty Omobonus"
                width={400}
                height={500}
                className="object-contain rounded-lg w-full h-auto"
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Prawa kolumna - tekst */}
          <div className="space-y-6 text-white">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                Święty Omobonus XII wieku (łac. „Dobry człowiek”)
              </h2>
              <p className="text-lg">
                Patron biznesmenów i przemysłowców. Był uczciwym rzemieślnikiem, który część swoich dochodów przekazywał potrzebującym.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
                O nas:
              </h3>
              <p className="text-lg">
                Jesteśmy zespołem, który wierzy, że praca może być również pomocą i służbą innym ludziom.  
                Zysk jest potrzebny, ale nie jest naszym idolem ani bożkiem.  
                Nie chcemy się bogacić za wszelką cenę.
              </p>
            </div>

            <div>
              <p className="text-lg font-serif text-primary">
                „Szacunek do klienta i brak oszustwa” to nasze podstawowe zasady pracy.
              </p>
            </div>

            <div>
              <p className="text-lg mb-4">Współpracując z nami, możesz mieć pewność, że:</p>
              <ul className="space-y-3">
                {[
                  'podajemy prawdziwe ceny — od razu wiesz, ile to kosztuje;',
                  'nie podajemy cen netto, lecz wyłącznie ceny brutto;',
                  'podczas diagnozy otrzymujesz nie tylko tabelkę z wyceną, ale też zdjęcia usterek;',
                  'jeśli naprawa się nie opłaca – powiemy to otwarcie;',
                  'nie wymieniamy części bez potrzeby;',
                  'wymienione części i podzespoły zawsze zwracamy Klientowi;',
                  'w razie potrzeby na czas naprawy zapewniamy usługę „Drukarka zastępcza”.',
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span className="text-primary">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
