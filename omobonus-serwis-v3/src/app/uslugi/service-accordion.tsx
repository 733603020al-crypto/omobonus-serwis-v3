'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import manifest from '@/config/KANONICZNY_MANIFEST.json'
import { DEFAULT_PRICE_TOOLTIP } from '@/lib/services-data'
import type { ServiceData } from '@/lib/services-data'
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

const PROPER_NOUN_PREFIXES = [
  'windows',
  'google',
  'onedrive',
  'airprint',
  'mopria',
  'mac',
  'bios',
  'uefi',
  'raid',
  'hp',
  'canon',
  'epson',
  'brother',
  'xerox',
  'kyocera',
  'samsung',
  'ricoh',
  'lexmark',
  'apple',
  'android',
]

const hasOuterParens = (value: string) => {
  const trimmed = value.trim()
  return trimmed.startsWith('(') && trimmed.endsWith(')')
}

const stripOuterParens = (value: string) => {
  if (!value) return value
  let result = value.trim()
  while (result.length > 1 && hasOuterParens(result)) {
    result = result.slice(1, -1).trim()
  }
  return result
}

const shouldLowercaseContinuation = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return false
  const firstChar = trimmed[0]
  if (firstChar === '(') return false
  if (/^\d/.test(firstChar)) return false
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿĄĆĘŁŃÓŚŹŻą-źż]/.test(firstChar)) return false
  const normalized = trimmed.toLowerCase()
  return !PROPER_NOUN_PREFIXES.some(prefix => normalized.startsWith(prefix))
}

const lowercaseFirstLetter = (value: string) => {
  if (!value) return value
  return value.charAt(0).toLocaleLowerCase('pl-PL') + value.slice(1)
}

const normalizeSecondLine = (value?: string | null) => {
  if (!value) return null
  let result = stripOuterParens(value)
  if (!result) return null
  if (shouldLowercaseContinuation(result)) {
    result = lowercaseFirstLetter(result)
  }
  return result
}

const stripTrailingPeriod = (value: string) => {
  let result = value.trim()
  if (result.endsWith('.')) {
    result = result.slice(0, -1).trimEnd()
  }
  return result
}

const parseServiceText = (text: string) => {
  if (!text) {
    return {
      main: '',
      parentheses: null,
    }
  }

  const buildResult = (main: string, secondary?: string | null) => {
    const normalizedSecondary = normalizeSecondLine(secondary)
    const normalizedMain =
      normalizedSecondary && main.trim().endsWith('.')
        ? stripTrailingPeriod(main)
        : main.trim()

    return {
      main: normalizedMain,
      parentheses: normalizedSecondary,
    }
  }

  if (text.includes('\n')) {
    const [firstLine, ...rest] = text.split('\n')
    const remainder = rest.join('\n').trim()
    return buildResult(firstLine, remainder || null)
  }

  const matchTwo = text.match(/^(.+?)\s*\((.+?)\)\s*\((.+?)\)\s*$/)
  if (matchTwo) {
    const mainWithFirstParens = `${matchTwo[1].trim()} (${matchTwo[2].trim()})`
    return buildResult(mainWithFirstParens, matchTwo[3].trim())
  }

  const match = text.match(/^(.+?)\s*\((.+?)\)\s*$/)
  if (match) {
    return buildResult(match[1], match[2])
  }

  return {
    main: text.trim(),
    parentheses: null,
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

  const renderSuffixLine = (text: string, key?: string | number) => (
    <div
      key={key ? `${text}-${key}` : undefined}
      className="font-table-sub text-[14px] text-[#ede0c4] leading-[1.3]"
      style={{ textShadow: supplementTextShadow }}
    >
      {text}
    </div>
  )

  const renderValueLine = (text: string, key?: string | number) => {
    if (!text) return null
    const compact = text.replace(/\s*\/\s*/g, '/')
    const hasVariant = compact !== text
    return (
      <div
        key={key ? `${text}-${key}` : undefined}
        className="font-inter text-[13px] md:text-[14px] text-[rgba(255,255,255,0.9)] leading-[1.3]"
      >
        {hasVariant ? (
          <>
            <span className="md:hidden">{compact}</span>
            <span className="hidden md:inline">{text}</span>
          </>
        ) : (
          text
        )}
      </div>
    )
  }

  return price.split('\n').map((line, idx) => {
    const trimmed = line.trim()
    if (!trimmed) return null
    const lower = trimmed.toLowerCase()
    const isHourly =
      lower.includes('/ godzinę') || lower.includes('/ godzine')
    const plusIndex = trimmed.indexOf('+')
    const hasInlinePlusSuffix = plusIndex > 0
    const isStandalonePlusSuffix = plusIndex === 0
    const isStandaloneNumericPlus = isStandalonePlusSuffix && /^\+\s*\d/.test(trimmed)
    const isSupplement = lower.includes('stawka z cennika')
    const isPerMeasureSuffix = lower.startsWith('za ')
    const isDoCenySuffix = lower === 'do ceny'
    if (isHourly) {
      const [val, suffix] = trimmed.split('/').map(part => part.trim())
      const suffixText = suffix ? `/ ${suffix}` : ''
      return (
        <div key={`${trimmed}-${idx}`}>
          {val && renderValueLine(val, `${trimmed}-${idx}-value`)}
          {suffixText && renderSuffixLine(suffixText)}
        </div>
      )
    }
    if (hasInlinePlusSuffix) {
      const value = trimmed.slice(0, plusIndex).trim()
      const suffixText = trimmed.slice(plusIndex).trim()
      return (
        <div key={`${trimmed}-${idx}`}>
          {value && renderValueLine(value, `${trimmed}-${idx}-value`)}
          {suffixText && renderSuffixLine(suffixText)}
        </div>
      )
    }
    if (isStandaloneNumericPlus) {
      return renderValueLine(trimmed, `${trimmed}-${idx}`)
    }

    if (isStandalonePlusSuffix || isSupplement || isPerMeasureSuffix || isDoCenySuffix) {
      return renderSuffixLine(trimmed, idx)
    }
    return renderValueLine(trimmed, `${trimmed}-${idx}`)
  })
}

export const renderDurationValue = (value: string) => (
  <div className="font-inter text-[13px] md:text-[14px] text-[rgba(255,255,255,0.9)] leading-[1.3]">
    {value}
  </div>
)

// Мобильная версия строки услуги (flex layout)
const renderMobileServiceRow = (
  item: { service: string; price: string; duration: string; link?: string },
  idx: number,
  isFirst: boolean,
  isLast: boolean,
  shouldHighlightPrices: boolean,
  parseServiceText: (text: string) => { main: string; parentheses: string | null },
) => {
  const parsed = parseServiceText(item.service)
  return (
    <div
      key={`mobile-${idx}`}
      className={`flex items-start w-full gap-0.5 border-white/20 border-b border-white/30 ${
        isFirst ? 'border-t border-white/30' : ''
      } ${isLast ? '' : ''} py-1`}
    >
      {/* Левая колонка - описание */}
      <div className="flex-1 min-w-0 pl-0.5">
        <div className="font-table-main text-[rgba(255,255,245,0.85)] text-[15px] text-white leading-[1.3] tracking-tight">
          {parsed.main}
        </div>
      </div>
      {/* Правая колонка - цена */}
      <div
        className={cn(
          'flex-shrink-0 min-w-[80px] max-w-[90px] text-center leading-[1.3] pr-2',
          shouldHighlightPrices
            ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] brightness-110'
            : ''
        )}
      >
        {renderPriceLines(item.price, item.link)}
      </div>
    </div>
  )
}

type ScrollRefs = Record<string, HTMLDivElement | null>

const SECTION_SCROLL_OFFSET = 120

// Компонент для таблицы wynajem с динамическим выравниванием
const WynajemTable = ({ 
  subcategoryId, 
  headerRefs 
}: { 
  subcategoryId: string
  headerRefs: {
    icon: React.RefObject<HTMLDivElement | null>
    text: React.RefObject<HTMLDivElement | null>
    prices: React.RefObject<HTMLDivElement | null>[]
  }
}) => {
  const [columnWidths, setColumnWidths] = useState<{ icon: number; text: number; price1: number; price2: number; price3: number } | null>(null)
  
  // Фиксированный отступ слева для выравнивания нижней таблицы под верхним рядом
  // Примерно равен расстоянию от левого края контейнера до начала иконки (12px)
  // Скорректировано визуально для идеального совпадения
  const leftOffset = 12

  useEffect(() => {
    if (subcategoryId !== 'drukarki-mono' || !headerRefs.prices[0]?.current) return

    const measureColumns = () => {
      const iconEl = headerRefs.icon.current
      const textEl = headerRefs.text.current
      const price1El = headerRefs.prices[0]?.current
      const price2El = headerRefs.prices[1]?.current
      const price3El = headerRefs.prices[2]?.current

      if (iconEl && textEl && price1El && price2El && price3El) {
        const iconRect = iconEl.getBoundingClientRect()
        const textRect = textEl.getBoundingClientRect()
        const price1Rect = price1El.getBoundingClientRect()
        const price2Rect = price2El.getBoundingClientRect()
        const price3Rect = price3El.getBoundingClientRect()

        setColumnWidths({
          icon: iconRect.width,
          text: textRect.width,
          price1: price1Rect.width,
          price2: price2Rect.width,
          price3: price3Rect.width,
        })
      }
    }

    // Задержка для обеспечения рендеринга элементов
    const timeoutId1 = setTimeout(measureColumns, 50)
    const timeoutId2 = setTimeout(measureColumns, 200)
    const timeoutId3 = setTimeout(measureColumns, 500)

    const handleResize = () => {
      measureColumns()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
    }
  }, [subcategoryId, headerRefs])

  if (subcategoryId !== 'drukarki-mono') return null

  const tableData = [
    { label: 'A4 wliczonych w czynsz, mono', plan1: '500 str.', plan2: '1 000 str.', plan3: '2 500 str.' },
    { label: 'Cena wydruku A4 powyżej limitu, mono', plan1: '0,05 zł', plan2: '0,05 zł', plan3: '0,04 zł' },
    { label: 'Duplex', plan1: '-', plan2: '- / +', plan3: '+' },
    { label: 'Prędkość druku do', plan1: '20 str./min', plan2: '40 str./min', plan3: '60 str./min' },
  ]

  return (
    <div 
      className="rounded-lg outline outline-1 outline-[#bfa76a]/10 md:outline-none md:border md:border-[#bfa76a]/10 overflow-hidden border-2 border-red-500"
    >
      <div className="overflow-x-auto md:overflow-x-visible">
        {/* Десктоп: flex с динамическими размерами из верхнего ряда */}
        <div 
          className="hidden md:block"
          style={{ marginLeft: `${leftOffset}px`, width: `calc(100% - ${leftOffset}px)` }}
        >
          {tableData.map((row, idx) => (
            <div
              key={idx}
              className={`flex w-full items-center border-[#7b6a4a]/70 ${idx === 0 ? 'border-t' : ''} border-b outline outline-2 outline-purple-500`}
            >
              {/* Пустая колонка для иконки */}
              <div 
                className="outline outline-1 outline-blue-500"
                style={columnWidths ? { width: `${columnWidths.icon}px`, marginRight: '8px' } : { width: '40px', marginRight: '8px' }}
              ></div>
              {/* Колонка с описанием */}
              <div 
                className="px-2 py-1 flex items-center leading-[1.4] font-table-main text-lg text-[rgba(255,255,245,0.85)] outline outline-1 outline-green-500"
                style={columnWidths ? { width: `${columnWidths.text}px` } : undefined}
              >
                {row.label}
              </div>
              {/* Три колонки с данными - используют точные размеры из верхнего ряда */}
              <div 
                className="px-2 py-1 flex items-center justify-center text-center leading-[1.4] border-l border-[#7b6a4a]/70 font-table-main text-lg text-[rgba(255,255,245,0.85)] outline outline-2 outline-yellow-500 outline-dashed"
                style={columnWidths ? { width: `${columnWidths.price1}px`, marginLeft: '8px' } : undefined}
              >
                {row.plan1}
              </div>
              <div 
                className="px-2 py-1 flex items-center justify-center text-center leading-[1.4] border-l border-[#7b6a4a]/70 font-table-main text-lg text-[rgba(255,255,245,0.85)] outline outline-2 outline-yellow-500 outline-dashed"
                style={columnWidths ? { width: `${columnWidths.price2}px` } : undefined}
              >
                {row.plan2}
              </div>
              <div 
                className="px-2 py-1 flex items-center justify-center text-center leading-[1.4] border-l border-[#7b6a4a]/70 font-table-main text-lg text-[rgba(255,255,245,0.85)] outline outline-2 outline-yellow-500 outline-dashed"
                style={columnWidths ? { width: `${columnWidths.price3}px` } : undefined}
              >
                {row.plan3}
              </div>
            </div>
          ))}
        </div>
        {/* Мобильная версия: обычная таблица */}
        <div className="md:hidden">
          <Table className="table-fixed border-collapse w-full">
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <TableBody>
              {tableData.map((row, idx) => (
                <TableRow
                  key={idx}
                  className={`border-[#7b6a4a]/70 border-b ${idx === 0 ? 'border-t border-[#7b6a4a]/70' : ''}`}
                >
                  <TableCell className="px-2 py-1 align-middle text-left leading-[1.4] font-table-main text-lg text-[rgba(255,255,245,0.85)]">
                    {row.label}
                  </TableCell>
                  <TableCell className="px-2 py-1 align-middle text-center leading-[1.4] border-l border-[#7b6a4a]/70 font-table-main text-lg text-[rgba(255,255,245,0.85)]">
                    {row.plan1}
                  </TableCell>
                  <TableCell className="px-2 py-1 align-middle text-center leading-[1.4] border-l border-[#7b6a4a]/70 font-table-main text-lg text-[rgba(255,255,245,0.85)]">
                    {row.plan2}
                  </TableCell>
                  <TableCell className="px-2 py-1 align-middle text-center leading-[1.4] border-l border-[#7b6a4a]/70 font-table-main text-lg text-[rgba(255,255,245,0.85)]">
                    {row.plan3}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

const scrollIntoViewIfNeeded = (
  target?: HTMLDivElement | null,
  offset = SECTION_SCROLL_OFFSET,
  force = false,
) => {
  if (!target) return

  const measureAndScroll = () => {
    const rect = target.getBoundingClientRect()
    const topVisible = rect.top >= offset
    const bottomVisible = rect.bottom <= window.innerHeight - 20

    if (!force && topVisible && bottomVisible) {
      return
    }

    const top = rect.top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(measureAndScroll)
  })
}

const DEVICE_CATEGORIES = [
  {
    title: 'Drukarka domowa',
    description:
      'Urządzenie do użytku domowego (okazjonalnego drukowania). Małe modele A4',
    features: ['małe wymiary', 'wolniejszy druk'],
    examples: '',
  },
  {
    title: 'Drukarka biurowa',
    description:
      'Do pracy w małych i średnich biurach. Do częstszego drukowania.',
    features: ['średni rozmiar', 'szybszy druk', 'wyższa trwałość'],
    examples: '',
  },
  {
    title: 'Drukarka biznesowa',
    description:
      'Duże urządzenia A4/A3 do intensywnej codziennej pracy i dużych wolumenów wydruku.',
    features: ['do dużych nakładów z wysoką wytrzymałością'],
    examples: '',
  },
]

const SPECIAL_TOOLTIP_SERVICES = new Set([
  'serwis-drukarek-laserowych',
  'serwis-drukarek-atramentowych',
  'serwis-drukarek-termicznych',
])

const ServiceAccordion = ({ service }: { service: ServiceData }) => {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [openSubcategory, setOpenSubcategory] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [isCategoryTooltipOpen, setCategoryTooltipOpen] = useState(false)
  const sectionRefs = useRef<ScrollRefs>({})
  const subcategoryRefs = useRef<ScrollRefs>({})
  // Refs для колонок цен в шапке wynajem подменю
  const wynajemHeaderRefs = useRef<{ 
    [key: string]: { 
      icon: React.RefObject<HTMLDivElement | null>
      text: React.RefObject<HTMLDivElement | null>
      prices: React.RefObject<HTMLDivElement | null>[]
    } 
  }>({})
  const priceTooltip = service.priceTooltip ?? DEFAULT_PRICE_TOOLTIP
  const isLaserService = service.slug === 'serwis-drukarek-laserowych'
  const isSpecialTooltipService = SPECIAL_TOOLTIP_SERVICES.has(service.slug)
  const shouldHighlightPrices = isLaserService && isCategoryTooltipOpen


  const renderPriceTooltipContent = () => {
    if (!isSpecialTooltipService) {
      return (
        <p className="max-w-xs text-sm leading-snug text-[#f8f1db]">
          {priceTooltip}
        </p>
      )
    }

    return (
      <div
        className="relative pointer-events-auto w-[min(calc(100vw-64px),900px)] max-h-[88vh] overflow-y-auto rounded-2xl border border-[rgba(200,169,107,0.45)] shadow-[0_22px_45px_rgba(0,0,0,0.5)] text-[#f8eacd]"
        style={{
          backgroundImage: "url('/images/services-background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-[rgba(0,0,0,0.5)] pointer-events-none" />
        <div className="relative p-6 md:p-7 space-y-6">
          <div className="text-center space-y-2">
            <h4 className="text-[22px] md:text-[26px] font-cormorant font-semibold text-white tracking-wide">
              Kategorie urządzeń
            </h4>
            <p className="text-[15px] md:text-[17px] text-[rgba(255,255,245,0.85)] leading-snug font-cormorant">
              W cenniku pierwsza cena dotyczy drukarki domowej, druga – biurowej, trzecia – biznesowej
            </p>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span className="text-[15px] md:text-[17px] text-[rgba(255,255,245,0.85)] font-cormorant">(np.</span>
              <div className="flex items-center">
                <div className="drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">
                  {renderPriceLines('50 / 100 / 150')}
                </div>
              </div>
              <span className="text-[15px] md:text-[17px] text-[rgba(255,255,245,0.85)] font-cormorant">)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {DEVICE_CATEGORIES.map(category => (
              <div
                key={category.title}
                className="bg-[rgba(255,255,255,0.08)] border border-[rgba(191,167,106,0.35)] rounded-xl p-4 flex flex-col h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] text-center"
              >
                <div>
                  <div className="text-xl font-cormorant font-semibold text-white">{category.title}</div>
                  <p className="text-xs md:text-sm text-[#f0dfbd] leading-snug mt-1 whitespace-pre-line">
                    {category.description}
                  </p>
                </div>
                <p className="text-[13px] text-[rgba(255,255,245,0.85)] leading-snug font-table-sub text-center mt-auto pt-2">
                  {category.features.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleSectionChange = (value: string | null) => {
    setOpenSection(prev => (prev === value ? null : value))
    setOpenSubcategory(null)
  }

  const handleSubcategoryChange = (sectionId: string, value: string | null) => {
    if (sectionId !== 'naprawy') return
    setOpenSubcategory(prev => (prev === value ? null : value))
  }

  const isSectionOpen = (sectionId: string) =>
    openSection ? openSection === sectionId : false

  const getSubcategoryValue = (sectionId: string) =>
    sectionId === 'naprawy' ? openSubcategory ?? undefined : undefined

  useEffect(() => {
    if (!openSection) return
    scrollIntoViewIfNeeded(sectionRefs.current[openSection], SECTION_SCROLL_OFFSET)
  }, [openSection])

  useEffect(() => {
    if (openSection !== 'faq' && openFaq) {
      setOpenFaq(null)
    }
  }, [openSection, openFaq])

  useEffect(() => {
    if (!openSubcategory || openSection !== 'naprawy') return
    const parentRef = sectionRefs.current['naprawy']
    if (!parentRef) return

    const rect = parentRef.getBoundingClientRect()
    if (rect.bottom > 70) {
      return
    }

    scrollIntoViewIfNeeded(parentRef, SECTION_SCROLL_OFFSET, true)
  }, [openSubcategory, openSection])



  return (
    <div className="container max-w-4xl mx-auto px-0 sm:px-4 md:px-6 pb-20 relative z-10">
      <div className="flex flex-col gap-4">
        <Accordion
          type="single"
          collapsible
          value={openSection ?? undefined}
          onValueChange={handleSectionChange}
          className="w-full"
        >
          {service.pricingSections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-0 group mb-4 last:mb-0 scroll-mt-[120px]"
              ref={node => {
                sectionRefs.current[section.id] = node
              }}
            >
              <div 
                className="group relative min-h-[70px] rounded-lg py-1.5 px-0 sm:py-2 md:px-3 border-2 border-[rgba(200,169,107,0.5)] hover:border-[rgba(200,169,107,0.85)] transition-all duration-300 hover:shadow-xl group-data-[state=open]:border-b group-data-[state=open]:border-b-[rgba(191,167,106,0.2)] w-full bg-[rgba(5,5,5,0.85)]"
              >
                <AccordionTrigger 
                  className="hover:no-underline [&>svg]:hidden w-full group !py-0 !items-center !gap-0"
                >
                  <div className="flex items-center w-full text-left">
                    <div className="flex items-center flex-1 min-w-0">
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

                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-cormorant font-semibold text-[#ffffff] group-hover:text-white transition-colors mb-1 leading-tight">
                          <span className="md:hidden">
                            {section.id === 'konserwacja'
                              ? 'Czyszczenie i konserwacja'
                              : section.id === 'naprawy'
                              ? 'Naprawy i usługi serwisowe'
                              : section.title}
                          </span>
                          <span className="hidden md:inline">{section.title}</span>
                        </h3>
                        <div className="flex items-center gap-2 text-[#bfa76a] text-xs font-serif group-hover:translate-x-1 transition-transform group-data-[state=open]:hidden">
                          <span>{section.id === 'faq' ? 'Zobacz' : 'Zobacz cennik'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {section.id !== 'faq' && !(service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2')) && (
                      <>
                        <div className="flex items-center gap-3 ml-3 sm:gap-4 sm:ml-4 flex-shrink-0">
                          <div
                            className={cn(
                              'flex items-center justify-center',
                              section.id === 'diagnoza' || section.id === 'dojazd' || section.id === 'konserwacja' || section.id === 'naprawy'
                                ? 'min-w-[96px] sm:min-w-[120px]'
                                : 'min-w-0 sm:min-w-[120px]'
                            )}
                          >
                            {(section.id === 'diagnoza' || section.id === 'dojazd') && (
                              <span className="text-lg md:text-xl font-table-accent text-[rgba(255,255,245,0.85)] group-data-[state=open]:hidden whitespace-nowrap">
                                GRATIS
                              </span>
                            )}
                            <div 
                              className="text-center hidden group-data-[state=open]:block w-full"
                            >
                              <div
                                className={cn(
                                  'flex items-center gap-2 text-lg md:text-xl font-cormorant font-semibold text-[#ffffff] leading-[1.05] whitespace-nowrap pl-1 md:pl-0',
                                  section.id === 'diagnoza' || section.id === 'dojazd' || section.id === 'konserwacja' || section.id === 'naprawy'
                                    ? 'justify-center'
                                    : 'justify-end'
                                )}
                              >
                                <span className="hidden sm:inline">Cena, zł</span>
                                <span className="inline sm:hidden">Cena</span>
                                {service.slug !== 'serwis-laptopow' && service.slug !== 'serwis-komputerow-stacjonarnych' && (
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip
                                      onOpenChange={open => {
                                        if (isSpecialTooltipService) {
                                          setCategoryTooltipOpen(open)
                                        }
                                      }}
                                    >
                                      <TooltipTrigger
                                        className="ml-1 -mr-2 sm:mr-0 hidden md:inline-flex"
                                        onClick={event => event.stopPropagation()}
                                        onPointerDown={event => event.stopPropagation()}
                                        onKeyDown={event => {
                                          if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            event.stopPropagation()
                                          }
                                        }}
                                      >
                                        <span
                                          role="button"
                                          tabIndex={0}
                                          aria-label="Informacja o cenach"
                                          className="inline-flex items-center justify-center text-white/80 rounded-full focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none p-2 sm:p-1 cursor-pointer"
                                        >
                                          <Info className="w-4 h-4 opacity-70 pointer-events-none" />
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        {...(isSpecialTooltipService
                                          ? {
                                              side: 'left' as const,
                                              align: 'center' as const,
                                              sideOffset: 16,
                                              collisionPadding: 16,
                                              className: 'p-0 border-none bg-transparent shadow-none max-w-none rounded-none',
                                            }
                                          : { sideOffset: 4 })}
                                      >
                                        {isSpecialTooltipService ? (
                                          renderPriceTooltipContent()
                                        ) : (
                                          <p className="max-w-xs text-sm leading-snug text-[#f8f1db]">
                                            cena z VAT (brutto)
                                          </p>
                                        )}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              {service.slug !== 'serwis-laptopow' && service.slug !== 'serwis-komputerow-stacjonarnych' && (
                                <span
                                  className="font-table-sub text-[14px] text-[#ede0c4] mt-0.5 leading-[1.1] hidden sm:block"
                                  style={{ textShadow: supplementTextShadow }}
                                >
                                  (kategorie urządzeń)
                                </span>
                              )}
                            </div>
                          </div>

                          <div
                            className={cn(
                              'items-center justify-center hidden md:flex',
                              section.id === 'diagnoza' || section.id === 'dojazd' || section.id === 'konserwacja' || section.id === 'naprawy'
                                ? 'min-w-[120px]'
                                : 'min-w-0'
                            )}
                          >
                            <div className="text-lg md:text-xl font-cormorant font-semibold text-[#ffffff] text-center hidden group-data-[state=open]:block leading-[1.05]">
                              <div className="leading-[1.05]">Czas</div>
                              <div className="leading-[1.05]">realizacji</div>
                            </div>
                          </div>
                        </div>

                      </>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent 
                  className="pt-3 pb-3 max-h-[70vh] overflow-y-auto scroll-smooth accordion-scroll relative z-10 md:border-t md:border-[rgba(200,169,107,0.3)] md:mt-2 md:border-x md:border-[rgba(191,167,106,0.3)] md:mx-2 md:mb-2 md:rounded-b-lg"
                >
                  {section.subcategories ? (
                    (() => {
                      const isRepairSection = section.id === 'naprawy'
                      const isFaqSection = section.id === 'faq'
                      const subcategoryItems = section.subcategories.map((subcategory, index) => (
                        <AccordionItem
                          key={subcategory.id}
                          value={subcategory.id}
                          className={`border-0 last:border-b-0 last:mb-0 group scroll-mt-[100px] ${
                            section.id === 'faq'
                              ? `border-b border-[#bfa76a]/30 mb-0.5 pb-0.5 ${index === 0 ? 'border-t border-[#bfa76a]/30 pt-0.5' : ''}`
                              : `border-b border-white/20 mb-1.5 pb-1.5 ${index === 0 ? 'border-t border-white/20 pt-1.5' : ''}`
                          }`}
                          ref={node => {
                            subcategoryRefs.current[subcategory.id] = node
                          }}
                        >
                          <AccordionTrigger
                            className={`hover:no-underline text-left w-full !focus-visible:ring-0 !focus-visible:outline-none focus-visible:ring-transparent transition-all duration-200 ${
                              section.id === 'faq'
                                ? 'py-1 px-2 rounded-lg hover:border-[#ffecb3]/20'
                                : 'py-1.5 px-1.5 md:py-2 md:px-3'
                            }`}
                          >
                            {service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2') && subcategory.price ? (
                              <>
                                {/* Десктоп: grid с иконкой, текстом и тремя колонками цен */}
                                {/* Фиксированные элементы (всего 108px): */}
                                {/* - Padding слева: 12px (md:px-3) - уже учтен в AccordionTrigger */}
                                {/* - Иконка: 40px */}
                                {/* - Расстояние между иконкой и текстом: 16px (gap-4) */}
                                {/* - Стрелка справа: 40px (gap + padding + стрелка) */}
                                {/* Grid контейнер занимает calc(100% - 40px) для учета стрелки справа */}
                                {/* Пропорции колонок подобраны вручную для точного совпадения центров: */}
                                {/* Иконка (40px) + Gap (16px) + Текст (2.15fr) + Цены (0.95fr каждая) */}
                                <div className="hidden md:flex items-center outline outline-2 outline-red-500" style={{ 
                                  width: 'calc(100% - 40px)' // Вычитаем место для стрелки справа (40px)
                                }}>
                                  {(() => {
                                    // Создаем или получаем refs для этого подменю
                                    const subcategoryKey = `${section.id}-${subcategory.id}`
                                    if (!wynajemHeaderRefs.current[subcategoryKey]) {
                                      wynajemHeaderRefs.current[subcategoryKey] = {
                                        icon: React.createRef<HTMLDivElement | null>(),
                                        text: React.createRef<HTMLDivElement | null>(),
                                        prices: [
                                          React.createRef<HTMLDivElement | null>(),
                                          React.createRef<HTMLDivElement | null>(),
                                          React.createRef<HTMLDivElement | null>(),
                                        ],
                                      }
                                    }
                                    const headerRefs = wynajemHeaderRefs.current[subcategoryKey]
                                    
                                    return (
                                      <>
                                        <div 
                                          ref={headerRefs.icon}
                                          className="w-[40px] h-[40px] flex-shrink-0 flex items-center justify-center mr-2 outline outline-1 outline-blue-500"
                                        >
                                          <Image
                                            src={getIconForSection(section.id)}
                                            alt={subcategory.title}
                                            width={40}
                                            height={40}
                                            className="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                                            unoptimized
                                          />
                                        </div>
                                        <div 
                                          ref={headerRefs.text}
                                          className="min-w-0 outline outline-1 outline-green-500" 
                                          style={{ width: 'calc((100% - 40px - 8px) * 0.4)' }}
                                        >
                                          <h4 className="text-lg font-semibold text-[#ffffff] font-table-main leading-[1.3]">
                                            {subcategory.title}
                                          </h4>
                                          <div
                                            data-subcategory-link
                                            className="flex items-center gap-2 text-[#bfa76a] text-xs font-serif group-hover:translate-x-1 transition-transform whitespace-nowrap"
                                          >
                                            <span>Zobacz szczegóły</span>
                                            <ArrowRight className="w-3 h-3 flex-shrink-0" />
                                          </div>
                                        </div>
                                        {subcategory.price.split(' / ').map((price, idx) => (
                                          <div 
                                            key={idx}
                                            ref={headerRefs.prices[idx]}
                                            className="flex items-center justify-center text-center px-2 border-l border-[#7b6a4a]/70 outline outline-2 outline-yellow-500 outline-dashed"
                                            style={{ width: `calc((100% - 40px - 8px) * 0.2)`, marginLeft: idx === 0 ? '8px' : '0' }}
                                          >
                                            <div className="text-2xl font-semibold text-[#ffffff] font-table-main leading-[1.3]">
                                              {price} zł
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    )
                                  })()}
                                </div>
                                <div className="md:hidden flex flex-col w-full gap-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-[40px] h-[40px] flex-shrink-0 flex items-center justify-center">
                                      <Image
                                        src={getIconForSection(section.id)}
                                        alt={subcategory.title}
                                        width={40}
                                        height={40}
                                        className="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                                        unoptimized
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-lg font-semibold text-[#ffffff] font-table-main leading-[1.3]">
                                        {subcategory.title}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 pl-[52px]">
                                    {subcategory.price.split(' / ').map((price, idx) => (
                                      <div key={idx} className="flex-1 text-center">
                                        <div className="text-lg font-semibold text-[#ffffff] font-table-main leading-[1.3]">
                                          {price} zł
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="pl-[52px]">
                                    <div
                                      data-subcategory-link
                                      className="flex items-center gap-2 text-[#bfa76a] text-xs font-serif group-hover:translate-x-1 transition-transform whitespace-nowrap"
                                    >
                                      <span>Zobacz szczegóły</span>
                                      <ArrowRight className="w-3 h-3 flex-shrink-0" />
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center w-full gap-3">
                                {service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2') && (
                                  <div className="mr-2 w-[40px] h-[40px] flex-shrink-0 flex items-center justify-center">
                                    <Image
                                      src={getIconForSection(section.id)}
                                      alt={subcategory.title}
                                      width={40}
                                      height={40}
                                      className="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                <div className="flex-1 w-full min-w-0">
                                  <div>
                                    <h4
                                      className={`font-table-main leading-[1.3] ${
                                        section.id === 'faq'
                                          ? 'text-[15px] md:text-[16px] font-semibold text-[#ffffff] mb-0'
                                          : 'text-lg font-semibold text-[#ffffff]'
                                      }`}
                                    >
                                      {subcategory.title}
                                    </h4>
                                    {subcategory.subtitle && section.id !== 'faq' && (
                                      <div
                                        className="font-table-sub text-[13px] md:text-[14px] text-[#f0dfbd] leading-tight italic mt-0.5"
                                        style={{ textShadow: supplementTextShadow }}
                                      >
                                        ({subcategory.subtitle})
                                      </div>
                                    )}
                                  </div>
                                  {section.id !== 'faq' && (
                                    <>
                                      <div
                                        data-subcategory-link
                                        className="flex items-center gap-2 text-[#bfa76a] text-xs font-serif group-hover:translate-x-1 transition-transform whitespace-nowrap"
                                      >
                                        <span>
                                          {service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2')
                                            ? 'Zobacz szczegóły'
                                            : 'Zobacz cennik'}
                                        </span>
                                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                                      </div>
                                      {service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2') && subcategory.price && (
                                        <div className="md:hidden mt-1">
                                          <div className="font-inter text-[13px] text-[rgba(255,255,255,0.9)] leading-[1.3]">
                                            {subcategory.price.split(' / ').map((price, idx, arr) => (
                                              <span key={idx}>
                                                {price} zł
                                                {idx < arr.length - 1 && ' / '}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                                {service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2') && subcategory.price && (
                                  <div className="hidden md:flex items-center justify-end flex-shrink-0 min-w-[200px]">
                                    <div className="font-inter text-[14px] text-[rgba(255,255,255,0.9)] leading-[1.3] text-right whitespace-nowrap">
                                      {subcategory.price.split(' / ').map((price, idx, arr) => (
                                        <span key={idx}>
                                          {price} zł
                                          {idx < arr.length - 1 && ' / '}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </AccordionTrigger>
                          <AccordionContent className={`${section.id === 'faq' ? 'pt-0.5' : 'pt-1.5'}`}>
                            {subcategory.answer ? (
                              <div
                                className={`font-cormorant text-base whitespace-pre-line text-[#fff8e7] ${
                                  section.id === 'faq' ? 'pt-0.5 pl-4 leading-snug' : 'pt-2 pb-1.5 px-1 leading-normal'
                                }`}
                              >
                                {subcategory.answer}
                              </div>
                            ) : subcategory.items.length === 0 ? (
                              service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2') ? (
                                (() => {
                                  const subcategoryKey = `${section.id}-${subcategory.id}`
                                  const headerRefs = wynajemHeaderRefs.current[subcategoryKey]
                                  if (headerRefs) {
                                    return <WynajemTable subcategoryId={subcategory.id} headerRefs={headerRefs} />
                                  }
                                  return null
                                })()
                              ) : (
                                <div className="rounded-lg outline outline-1 outline-[#bfa76a]/10 md:outline-none md:border md:border-[#bfa76a]/10 overflow-hidden min-h-[100px] p-4">
                                  {service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2') ? (
                                    <div className="text-center text-[rgba(255,255,245,0.85)] font-cormorant text-base">
                                      Szczegóły w przygotowaniu
                                    </div>
                                  ) : null}
                                </div>
                              )
                            ) : (
                              <div className="rounded-lg outline outline-1 outline-[#bfa76a]/10 md:outline-none md:border md:border-[#bfa76a]/10 overflow-hidden">
                                {/* Мобильная версия - flex layout */}
                                <div className="block md:hidden">
                                  {subcategory.items.map((item, idx) =>
                                    renderMobileServiceRow(
                                      item,
                                      idx,
                                      idx === 0,
                                      idx === subcategory.items.length - 1,
                                      shouldHighlightPrices,
                                      parseServiceText,
                                    ),
                                  )}
                                </div>
                                {/* Десктопная версия - HTML таблица */}
                                <div className="hidden md:block">
                                  <Table className="table-fixed border-collapse">
                                    {service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2') ? (
                                      <colgroup>
                                        <col style={{ width: '70%' }} />
                                        <col style={{ width: '30%' }} />
                                      </colgroup>
                                    ) : (
                                      <colgroup>
                                        <col style={{ width: '67%' }} />
                                        <col style={{ width: '16.5%' }} />
                                        <col style={{ width: '16.5%' }} />
                                      </colgroup>
                                    )}
                                    <TableBody>
                                      {subcategory.items.map((item, idx) => (
                                        <TableRow
                                          key={idx}
                                          className={`border-white/20 border-b border-white/30 ${idx === 0 ? 'border-t border-white/30' : ''}`}
                                        >
                                          <TableCell className="font-table-main text-[rgba(255,255,245,0.85)] py-1 pl-2 pr-2 !whitespace-normal w-auto max-w-[67%] leading-[1.3] tracking-normal overflow-hidden">
                                            {(() => {
                                              const parsed = parseServiceText(item.service)
                                              return (
                                                <div className="service-description-text">
                                                  <div className="text-[16px] text-white service-description-text leading-[1.3]">
                                                    {parsed.main}
                                                  </div>
                                                  {parsed.parentheses && (
                                                    <div
                                                      className="font-table-sub text-[14px] text-[#ede0c4] mt-0 line-clamp-2 service-description-text leading-[1.4]"
                                                      style={{ textShadow: supplementTextShadow }}
                                                    >
                                                      ({parsed.parentheses})
                                                    </div>
                                                  )}
                                                </div>
                                              )
                                            })()}
                                          </TableCell>
                                          <TableCell
                                            className={cn(
                                              'py-1 pl-2 pr-2 align-middle leading-[1.3] text-center w-auto min-w-[80px] md:pl-4',
                                              (subcategory.id === 'opcjonalne' || subcategory.title?.includes('opcjonalne')) && 'md:translate-x-[8px]',
                                              shouldHighlightPrices
                                                ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] brightness-110'
                                                : ''
                                            )}
                                          >
                                            {renderPriceLines(item.price, item.link)}
                                          </TableCell>
                                          {!(service.slug === 'wynajem-drukarek' && (section.id === 'akordeon-1' || section.id === 'akordeon-2')) && (
                                            <TableCell className={cn(
                                              'text-center py-1 pl-2 pr-2 align-middle leading-[1.3] md:pl-4',
                                              (subcategory.id === 'opcjonalne' || subcategory.title?.includes('opcjonalne')) && 'md:translate-x-[8px]'
                                            )}>
                                              {renderDurationValue(item.duration)}
                                            </TableCell>
                                          )}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))

                      if (isRepairSection) {
                        return (
                          <Accordion
                            type="single"
                            collapsible
                            value={getSubcategoryValue(section.id)}
                            onValueChange={value => handleSubcategoryChange(section.id, value)}
                            className="w-full"
                          >
                            {subcategoryItems}
                          </Accordion>
                        )
                      }

                      if (isFaqSection) {
                        return (
                          <Accordion
                            type="single"
                            collapsible
                            value={openFaq ?? undefined}
                            onValueChange={value => setOpenFaq(value ?? null)}
                            className="w-full"
                          >
                            {subcategoryItems}
                          </Accordion>
                        )
                      }

                      return (
                        <Accordion type="multiple" className="w-full">
                          {subcategoryItems}
                        </Accordion>
                      )
                    })()
                  ) : (
                    <div className="rounded-lg outline outline-1 outline-[#bfa76a]/10 md:outline-none md:border md:border-[#bfa76a]/10 overflow-hidden">
                      {/* Мобильная версия - flex layout */}
                      <div className="block md:hidden">
                        {section.items?.map((item, idx) =>
                          renderMobileServiceRow(
                            item,
                            idx,
                            idx === 0,
                            idx === (section.items?.length ?? 0) - 1,
                            false,
                            parseServiceText,
                          ),
                        )}
                      </div>
                      {/* Десктопная версия - HTML таблица */}
                      <div className="hidden md:block">
                        <Table className="table-fixed border-collapse">
                          <colgroup>
                            <col style={{ width: '67%' }} />
                            <col style={{ width: '16.5%' }} />
                            <col style={{ width: '16.5%' }} />
                          </colgroup>
                          <TableBody>
                            {section.items?.map((item, idx) => (
                              <TableRow
                                key={idx}
                                className={`border-white/20 border-b border-white/30 ${idx === 0 ? 'border-t border-white/30' : ''}`}
                              >
                                <TableCell className="font-table-main text-[rgba(255,255,245,0.85)] py-1 pl-2 pr-2 !whitespace-normal w-auto max-w-[67%] leading-[1.3] tracking-normal overflow-hidden">
                                  {(() => {
                                    const parsed = parseServiceText(item.service)
                                    return (
                                      <div className="service-description-text">
                                        <div className="text-[16px] text-white service-description-text leading-[1.3]">
                                          {parsed.main}
                                        </div>
                                        {parsed.parentheses && (
                                          <div
                                            className="font-table-sub text-[14px] text-[#ede0c4] mt-0 line-clamp-2 service-description-text leading-[1.4]"
                                            style={{ textShadow: supplementTextShadow }}
                                          >
                                            ({parsed.parentheses})
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </TableCell>
                                <TableCell className="py-1 pl-2 pr-2 align-middle leading-[1.3] text-center w-auto min-w-[80px] md:pl-4">
                                  {renderPriceLines(item.price, item.link)}
                                </TableCell>
                                <TableCell className="text-center py-1 pl-2 pr-2 align-middle leading-[1.3] md:pl-4">
                                  {renderDurationValue(item.duration)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default ServiceAccordion

