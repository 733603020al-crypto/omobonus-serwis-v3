import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
  if (!text) {
    return {
      main: '',
      parentheses: null,
    }
  }
  if (text.includes('\n')) {
    const [firstLine, ...rest] = text.split('\n')
    const remainder = rest.join('\n').trim()
    return {
      main: firstLine.trim(),
      parentheses: remainder || null,
    }
  }
  // Обработка случая с двумя парами скобок: "Текст (скобки1) (скобки2)"
  const matchTwo = text.match(/^(.+?)\s*\((.+?)\)\s*\((.+?)\)\s*$/)
  if (matchTwo) {
    return {
      main: `${matchTwo[1].trim()} (${matchTwo[2].trim()})`,
      parentheses: `(${matchTwo[3].trim()})`,
    }
  }
  // Обработка случая с одной парой скобок: "Текст (скобки)"
  const match = text.match(/^(.+?)\s*\((.+?)\)\s*$/)
  if (match) {
    return {
      main: match[1].trim(),
      parentheses: `(${match[2].trim()})`,
    }
  }
  return {
    main: text,
    parentheses: null
  }
}

const supplementTextShadow =
  '0 0 2px rgba(0, 0, 0, 0.4), -0.5px -0.5px 0 rgba(0, 0, 0, 0.5), 0.5px -0.5px 0 rgba(0, 0, 0, 0.5), -0.5px 0.5px 0 rgba(0, 0, 0, 0.5), 0.5px 0.5px 0 rgba(0, 0, 0, 0.5)'

const renderPriceLines = (price: string, link?: string) => {
  const trimmedPrice = price?.trim()
  if (trimmedPrice?.toLowerCase() === 'link' && link) {
    return (
      <Link
        href={link}
        className="font-inter text-[13px] md:text-[14px] text-[rgba(255,255,255,0.9)] underline underline-offset-2 hover:text-white focus:text-white transition-colors"
      >
        {trimmedPrice}
      </Link>
    )
  }

  return price.split('\n').map((line, idx) => {
    const trimmed = line.trim()
    if (!trimmed) return null
    const lower = trimmed.toLowerCase()
    const isHourly =
      lower.includes('/ godzinę') || lower.includes('/ godzine')
    const hasPlus =
      lower.includes('+ część') ||
      lower.includes('+ części') ||
      lower.includes('+ koszt tonera')
    const isSupplement =
      lower.includes('stawka z cennika')
    if (isHourly || hasPlus) {
      let value = trimmed
      let suffixText = ''
      if (isHourly) {
        const [val, suffix] = trimmed.split('/').map(part => part.trim())
        value = val
        suffixText = `/ ${suffix}`
      } else {
        const [val, suffix] = trimmed.split('+').map(part => part.trim())
        value = val
        suffixText = `+ ${suffix}`
      }
      return (
        <div key={`${trimmed}-${idx}`}> 
          <div className="font-inter text-[13px] md:text-[14px] text-[rgba(255,255,255,0.9)] leading-[1.3]">
            {value}
          </div>
          <div
            className="font-table-sub text-[14px] text-[#ede0c4] leading-[1.3]"
            style={{ textShadow: supplementTextShadow }}
          >
            {suffixText}
          </div>
        </div>
      )
    }
    if (isSupplement) {
      return (
        <div
          key={`${trimmed}-${idx}`}
          className="font-table-sub text-[14px] text-[#ede0c4] leading-[1.3]"
          style={{ textShadow: supplementTextShadow }}
        >
          {trimmed}
        </div>
      )
    }
    return (
      <div
        key={`${trimmed}-${idx}`}
        className="font-inter text-[13px] md:text-[14px] text-[rgba(255,255,255,0.9)] leading-[1.3]"
      >
        {trimmed}
      </div>
    )
  })
}

const renderDurationValue = (value: string) => (
  <div className="font-inter text-[13px] md:text-[14px] text-[rgba(255,255,255,0.9)] leading-[1.3]">
    {value}
  </div>
)

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
            <p className="mt-[6px] text-[18px] text-[#bfa76a] font-cormorant italic leading-tight max-w-3xl mx-auto font-semibold drop-shadow-2xl">
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
                  className="border-0 group mb-4 last:mb-0"
                >
                  <div className="group relative min-h-[70px] rounded-lg py-2 px-3 border-2 border-[rgba(200,169,107,0.5)] hover:border-[rgba(200,169,107,0.85)] transition-all duration-300 hover:shadow-xl group-data-[state=open]:border-b group-data-[state=open]:border-b-[rgba(191,167,106,0.2)] w-full sticky top-0 z-10">
                    <AccordionTrigger className="hover:no-underline [&>svg]:hidden w-full group !py-0 !items-center !gap-0">
                      <div className="flex items-center w-full text-left">
                        {/* Lewa część - dokładnie jak na stronie głównej */}
                        <div className="flex items-center flex-1">
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
                                <span className="text-lg md:text-xl font-table-accent text-[rgba(255,255,245,0.85)] group-data-[state=open]:hidden">
                                GRATIS
                              </span>
                            )}
                            {/* Nagłówek "Cena, zł" - widoczne tylko gdy otwarte */}
                            <div className="text-center hidden group-data-[state=open]:block">
                                <div className="flex items-center justify-center gap-2 text-lg md:text-xl font-cormorant font-semibold text-[#ffffff] leading-[1.05]">
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
                                <span className="font-table-sub text-[14px] text-[#ede0c4] block mt-0.5 leading-[1.1]" style={{
                                  textShadow: supplementTextShadow
                                }}>
                                (kategorie urządzeń)
                              </span>
                            </div>
                          </div>

                          {/* Nagłówek "Czas realizacji" - widoczne только gdy otwarte */}
                          <div className="flex items-center justify-center min-w-[120px] hidden md:flex">
                              <div className="text-lg md:text-xl font-cormorant font-semibold text-[#ffffff] text-center hidden group-data-[state=open]:block leading-[1.05]">
                                <div className="leading-[1.05]">Czas</div>
                                <div className="leading-[1.05]">realizacji</div>
                              </div>
                          </div>
                        </div>
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-3 pb-3 max-h-[70vh] overflow-y-auto scroll-smooth accordion-scroll relative z-10 md:border-t md:border-[rgba(200,169,107,0.3)] md:mt-2 md:border-x md:border-[rgba(191,167,106,0.3)] md:mx-2 md:mb-2 md:rounded-b-lg">
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
                                  ? `border-b border-[#bfa76a]/30 mb-0.5 pb-0.5 ${index === 0 ? 'border-t border-[#bfa76a]/30 pt-0.5' : ''}` 
                                  : `border-b border-white/20 mb-1.5 pb-1.5 ${index === 0 ? 'border-t border-white/20 pt-1.5' : ''}`
                              }`}
                            >
                              <AccordionTrigger className={`hover:no-underline text-left w-full !focus-visible:ring-0 !focus-visible:outline-none focus-visible:ring-transparent transition-all duration-200 ${
                                section.id === 'faq' 
                                  ? 'py-1 px-2 rounded-lg hover:border-[#ffecb3]/20' 
                                  : 'py-2 px-3'
                              }`}>
                                <div className="flex-1 w-full min-w-0">
                            <h4 className={`font-table-main leading-[1.3] ${
                                    section.id === 'faq'
                                      ? 'text-[15px] md:text-[16px] font-semibold text-[#ffffff] mb-0'
                                      : 'text-lg font-semibold text-[#ffffff] mb-0.5'
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
                              <AccordionContent className={`${section.id === 'faq' ? 'pt-0.5' : 'pt-1.5'}`}>
                                {/* Если есть answer (FAQ), показываем ответ, иначе таблицу */}
                                {subcategory.answer ? (
                                  <div className={`font-cormorant text-base whitespace-pre-line text-[#fff8e7] ${section.id === 'faq' ? 'pt-0.5 pl-4 leading-snug' : 'pt-2 pb-1.5 px-1 leading-normal'}`}>
                                    {subcategory.answer.split('\n').map((line, idx) => {
                                      // Поддержка жирного текста через **текст**
                                      const parts = line.split(/(\*\*.*?\*\*)/g)
                                      return (
                                        <div key={idx} className={idx > 0 ? 'mt-3' : ''}>
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
                                            className={`border-white/20 border-b border-white/30 ${idx === 0 ? 'border-t border-white/30' : ''}`}
                                          >
                                            <TableCell className="font-table-main text-[rgba(255,255,245,0.85)] py-1 !whitespace-normal md:max-w-[67%] leading-[1.3] tracking-tight md:tracking-normal">
                                              {(() => {
                                                const parsed = parseServiceText(item.service)
                                                return (
                                                  <div className="service-description-text">
                                                    <div className="text-[15px] md:text-[16px] text-white service-description-text leading-[1.3]">
                                              {parsed.main}
                                                    </div>
                                                    {parsed.parentheses && (
                                                      <div className="font-table-sub text-[14px] text-[#ede0c4] mt-0 hidden md:block line-clamp-2 service-description-text leading-[1.4]" style={{ 
                                                        textShadow: '0 0 2px rgba(0, 0, 0, 0.4), -0.5px -0.5px 0 rgba(0, 0, 0, 0.5), 0.5px -0.5px 0 rgba(0, 0, 0, 0.5), -0.5px 0.5px 0 rgba(0, 0, 0, 0.5), 0.5px 0.5px 0 rgba(0, 0, 0, 0.5)'
                                                      }}>
                                                        {parsed.parentheses}
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              })()}
                                            </TableCell>
                                            <TableCell className="text-center py-1 align-middle min-w-[80px] leading-[1.3]">
                                              {renderPriceLines(item.price, item.link)}
                                            </TableCell>
                                            <TableCell className="text-center py-1 align-middle hidden md:table-cell leading-[1.3]">
                                              {renderDurationValue(item.duration)}
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
                                  className={`border-white/20 border-b border-white/30 ${idx === 0 ? 'border-t border-white/30' : ''}`}
                              >
                                  <TableCell className="font-table-main text-[rgba(255,255,245,0.85)] py-1 !whitespace-normal md:max-w-[67%] leading-[1.3] tracking-tight md:tracking-normal">
                                  {(() => {
                                    const parsed = parseServiceText(item.service)
                                    return (
                                        <div className="service-description-text">
                                          <div className="text-[15px] md:text-[16px] text-white service-description-text leading-[1.3]">
                                          {parsed.main}
                                        </div>
                                        {parsed.parentheses && (
                                            <div className="font-table-sub text-[14px] text-[#ede0c4] mt-0 hidden md:block line-clamp-2 service-description-text leading-[1.4]" style={{ 
                                              textShadow: '0 0 2px rgba(0, 0, 0, 0.4), -0.5px -0.5px 0 rgba(0, 0, 0, 0.5), 0.5px -0.5px 0 rgba(0, 0, 0, 0.5), -0.5px 0.5px 0 rgba(0, 0, 0, 0.5), 0.5px 0.5px 0 rgba(0, 0, 0, 0.5)'
                                            }}>
                                            {parsed.parentheses}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </TableCell>
                                  <TableCell className="text-center py-1 align-middle min-w-[80px] leading-[1.3]">
                                    {renderPriceLines(item.price, item.link)}
                                </TableCell>
                                  <TableCell className="text-center py-1 align-middle hidden md:table-cell leading-[1.3]">
                                  {renderDurationValue(item.duration)}
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
