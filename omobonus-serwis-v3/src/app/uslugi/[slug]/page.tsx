import { notFound } from 'next/navigation'
import Image from 'next/image'
import { services } from '@/lib/services-data'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import manifest from '@/config/KANONICZNY_MANIFEST.json'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info, ArrowRight } from 'lucide-react'

// Helper do ikon (bo manifest ma płaską strukturę)
const getIconForSection = (sectionId: string) => {
  switch (sectionId) {
    case 'diagnoza':
      return manifest.P1_Diagnoza_i_wycena
    case 'dojazd':
      return manifest.P2_Dojazd
    case 'konserwacja':
      return manifest.P3_Czyszczenie_i_konserwacja_pakiety
    case 'naprawy':
      return manifest.P4_Naprawy_i_uslugi_serwisowe
    case 'faq':
      return manifest.P5_FAQ_pytania_i_odpowiedzi
    default:
      return manifest.P5_FAQ_pytania_i_odpowiedzi
  }
}

// Funkcja pomocnicza do parsowania tekstu usługi (wydzielenie tekstu w nawiasach)
const parseServiceText = (text: string) => {
  // Обработка случая с двумя парами скобок: "Текст (скобки1) (скобки2)"
  const matchTwo = text.match(/^(.+?)\s*\((.+?)\)\s*\((.+?)\)\s*$/)
  if (matchTwo) {
    return {
      main: `${matchTwo[1].trim()} (${matchTwo[2].trim()})`,
      parentheses: matchTwo[3].trim()
    }
  }
  // Обработка случая с одной парой скобок: "Текст (скобки)"
  const match = text.match(/^(.+?)\s*\((.+?)\)\s*$/)
  if (match) {
    return {
      main: match[1].trim(),
      parentheses: match[2].trim()
    }
  }
  return {
    main: text,
    parentheses: null
  }
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-[65px] relative">
        {/* Tło z services_background i 50% затемнением */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${manifest.services_background}')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Sekcja */}
        <div className="relative">
          <div className="container max-w-5xl mx-auto px-4 md:px-6 text-center relative z-10 mb-6">
            <h1 className="text-[40px] font-cormorant font-bold text-[#ffffff] leading-[1.1]">
              {service.title}
            </h1>
            <p className="mt-[6px] text-[18px] text-[#fff8e7] font-cormorant italic leading-tight max-w-3xl mx-auto font-semibold drop-shadow-2xl">
              Pełny wykaz usług i cen, bez ukrytych kosztów (nie &quot;naprawa od 50 zł&quot; lub &quot;cena do uzgodnienia&quot;)
            </p>
          </div>
        </div>

        {/* Sekcja Cennika (Accordion w stylu "Nasze Usługi") */}
        <div className="container max-w-4xl mx-auto px-4 md:px-6 pb-20 relative z-10">
          <div className="flex flex-col gap-4">
            <Accordion type="multiple" className="w-full">
              {service.pricingSections.map((section) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border-0 group"
                >
                  <div className="group relative min-h-[90px] rounded-lg p-3 border-2 border-white/40 hover:border-white/60 transition-all duration-300 hover:shadow-xl bg-transparent hover:bg-white/5 w-full">
                    <AccordionTrigger className="hover:no-underline [&>svg]:hidden w-full group">
                      <div className="flex items-start w-full text-left">
                        {/* Lewa część - dokładnie jak na stronie głównej */}
                        <div className="flex items-start flex-1">
                          {/* Ikona */}
                          <div className="mr-4 w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center">
                            <Image
                              src={getIconForSection(section.id)}
                              alt={section.title}
                              width={50}
                              height={50}
                              className="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                              unoptimized
                            />
                          </div>

                          {/* Treść */}
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-cormorant font-semibold text-[#ffffff] group-hover:text-white transition-colors mb-1 leading-tight">
                              {section.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[#bfa76a] text-xs font-serif group-hover:translate-x-1 transition-transform group-data-[state=open]:hidden">
                              <span>{section.id === 'faq' ? 'Zobacz' : 'Zobacz cennik'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>

                        {/* Prawa część - GRATIS / Nagłówki kolumn (ukryte dla FAQ) */}
                        {section.id !== 'faq' && (
                          <div className="flex items-center gap-4 ml-4">
                            {/* GRATIS lub Nagłówek "Cena, zł" */}
                            <div className="flex items-center justify-center min-w-[120px]">
                              {/* GRATIS - widoczne tylko gdy zamknięte */}
                              {(section.id === 'diagnoza' || section.id === 'dojazd') && (
                                <span className="text-lg md:text-xl font-cormorant font-semibold text-[#ffffff] group-data-[state=open]:hidden">
                                  GRATIS
                                </span>
                              )}
                              {/* Nagłówek "Cena, zł" - widoczne tylko gdy otwarte */}
                              <div className="text-center hidden group-data-[state=open]:block">
                                <div className="flex items-center justify-center gap-2 text-[#ffffff] font-cormorant font-bold text-lg">
                                  Cena, zł
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="w-4 h-4 opacity-70" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Ceny brutto (zawierają VAT)</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <span className="text-xs font-normal text-white/50 block mt-1">
                                  (kategorie urządzeń)
                                </span>
                              </div>
                            </div>

                            {/* Nagłówek "Czas realizacji" - widoczne tylko gdy otwarte */}
                            <div className="flex items-center justify-center min-w-[120px] hidden md:flex">
                              <div className="text-[#ffffff] font-cormorant font-bold text-lg text-center hidden group-data-[state=open]:block">
                                <div>Czas</div>
                                <div>realizacji</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-4">
                      {/* Sprawdź czy sekcja ma subcategories (dla "naprawy" lub "faq") */}
                      {section.subcategories ? (
                        // Wewnętrzny Accordion dla podkategorii
                        <Accordion type="multiple" className="w-full">
                          {section.subcategories.map((subcategory, index) => (
                            <AccordionItem
                              key={subcategory.id}
                              value={subcategory.id}
                              className={`border-0 last:border-b-0 last:mb-0 group ${
                                section.id === 'faq' 
                                  ? `border-b border-[#bfa76a]/30 mb-1 pb-1 ${index === 0 ? 'border-t border-[#bfa76a]/30 pt-1' : ''}` 
                                  : `border-b border-white/20 mb-2 pb-2 ${index === 0 ? 'border-t border-white/20 pt-2' : ''}`
                              }`}
                            >
                              <AccordionTrigger className={`hover:no-underline text-left w-full !focus-visible:ring-0 !focus-visible:outline-none focus-visible:ring-transparent transition-all duration-200 ${
                                section.id === 'faq' 
                                  ? 'py-1.5 px-2 hover:bg-[#ffecb3]/10 rounded-lg hover:border-[#ffecb3]/20' 
                                  : 'py-3 px-3'
                              }`}>
                                <div className="flex-1 w-full min-w-0">
                                  <h4 className={`font-cormorant transition-colors ${
                                    section.id === 'faq'
                                      ? 'text-lg md:text-xl font-semibold text-[#ffffff] mb-0'
                                      : 'text-lg font-semibold text-[#ffffff] mb-1'
                                  }`}>
                                    {subcategory.title}
                                  </h4>
                                  {/* Показываем "Zobacz cennik" только для не-FAQ подкатегорий */}
                                  {section.id !== 'faq' && (
                                    <div data-subcategory-link className="flex items-center gap-2 text-[#bfa76a] text-xs font-serif group-hover:translate-x-1 transition-transform whitespace-nowrap">
                                      <span>Zobacz cennik</span>
                                      <ArrowRight className="w-3 h-3 flex-shrink-0" />
                                    </div>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className={section.id === 'faq' ? 'pt-0.5' : 'pt-2'}>
                                {/* Если есть answer (FAQ), показываем ответ, иначе таблицу */}
                                {subcategory.answer ? (
                                  <div className={`font-cormorant text-base leading-relaxed whitespace-pre-line text-[#fff8e7] ${section.id === 'faq' ? 'pt-0.5' : 'pt-3 pb-2 px-1'}`}>
                                    {subcategory.answer.split('\n').map((line, idx) => {
                                      // Поддержка жирного текста через **текст**
                                      const parts = line.split(/(\*\*.*?\*\*)/g)
                                      return (
                                        <div key={idx} className={idx > 0 ? 'mt-4' : ''}>
                                          {parts.map((part, partIdx) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                              const boldText = part.slice(2, -2)
                                              return (
                                                <strong key={partIdx} className="font-semibold text-[#ffffff]">
                                                  {boldText}
                                                </strong>
                                              )
                                            }
                                            return <span key={partIdx}>{part}</span>
                                          })}
                                        </div>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <div className="rounded-lg border border-[#bfa76a]/10 overflow-hidden">
                                    <Table className="md:table-fixed">
                                      <colgroup className="hidden md:table-column-group">
                                        <col style={{ width: '67%' }} />
                                        <col style={{ width: '16.5%' }} />
                                        <col style={{ width: '16.5%' }} />
                                      </colgroup>
                                      <TableBody>
                                        {subcategory.items.map((item, idx) => (
                                          <TableRow
                                            key={idx}
                                            className={`border-white/20 border-b border-white/30 hover:bg-white/5 transition-colors ${idx === 0 ? 'border-t border-white/30' : ''}`}
                                          >
                                            <TableCell className="font-cormorant text-[#ffffff] py-2 !whitespace-normal md:max-w-[67%]">
                                              {(() => {
                                                const parsed = parseServiceText(item.service)
                                                return (
                                                  <div className="service-description-text">
                                                    <div className="text-base md:text-lg service-description-text">
                                                      {parsed.main}
                                                    </div>
                                                    {parsed.parentheses && (
                                                      <div className="text-xs md:text-sm italic text-[#fff8e7] mt-0.5 hidden md:block line-clamp-2 service-description-text">
                                                        ({parsed.parentheses})
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              })()}
                                            </TableCell>
                                            <TableCell className="font-cormorant text-[#ffffff] text-base md:text-lg text-center py-2 align-middle font-semibold min-w-[80px]">
                                              <div className="whitespace-pre-line leading-tight">{item.price}</div>
                                            </TableCell>
                                            <TableCell className="font-cormorant text-[#ffffff] text-lg text-center py-2 align-middle hidden md:table-cell">
                                              {item.duration}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        // Standardowa tabela dla sekcji bez subcategories
                        <div className="rounded-lg border border-[#bfa76a]/10 overflow-hidden">
                          <Table className="md:table-fixed">
                            <colgroup className="hidden md:table-column-group">
                              <col style={{ width: '67%' }} />
                              <col style={{ width: '16.5%' }} />
                              <col style={{ width: '16.5%' }} />
                            </colgroup>
                            <TableBody>
                              {section.items.map((item, idx) => (
                                <TableRow
                                  key={idx}
                                  className={`border-white/20 border-b border-white/30 hover:bg-white/5 transition-colors ${idx === 0 ? 'border-t border-white/30' : ''}`}
                                >
                                  <TableCell className="font-cormorant text-[#ffffff] py-2 !whitespace-normal md:max-w-[67%]">
                                    {(() => {
                                      const parsed = parseServiceText(item.service)
                                      return (
                                        <div className="service-description-text">
                                          <div className="text-base md:text-lg service-description-text">
                                            {parsed.main}
                                          </div>
                                          {parsed.parentheses && (
                                            <div className="text-xs md:text-sm italic text-[#fff8e7] mt-0.5 hidden md:block line-clamp-2 service-description-text">
                                              ({parsed.parentheses})
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })()}
                                  </TableCell>
                                  <TableCell className="font-cormorant text-[#ffffff] text-base md:text-lg text-center py-2 align-middle font-semibold min-w-[80px]">
                                    <div className="whitespace-pre-line leading-tight">{item.price}</div>
                                  </TableCell>
                                  <TableCell className="font-cormorant text-[#ffffff] text-lg text-center py-2 align-middle hidden md:table-cell">
                                    {item.duration}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
