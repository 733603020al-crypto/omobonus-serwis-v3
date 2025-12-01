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
  priceColumnRef?: React.RefObject<HTMLDivElement | null> | null,
) => {
  const parsed = parseServiceText(item.service)
  return (
    <div
      key={`mobile-${idx}`}
      className={`flex items-start w-full gap-1 border-white/20 border-b border-white/30 ${
        isFirst ? 'border-t border-white/30' : ''
      } ${isLast ? '' : ''} py-1`}
      style={{ outline: '1px solid red' }}
    >
      {/* Левая колонка - описание */}
      <div className="flex-1 min-w-0 pl-0.5" style={{ outline: '1px solid blue' }}>
        <div className="font-table-main text-[rgba(255,255,245,0.85)] text-[15px] text-white leading-[1.3] tracking-tight">
          {parsed.main}
        </div>
      </div>
      {/* Правая колонка - цена */}
      <div
        ref={idx === 0 ? priceColumnRef : null}
        className={cn(
          'flex-shrink-0 w-[70px] text-center leading-[1.3] pr-2',
          shouldHighlightPrices
            ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] brightness-110'
            : ''
        )}
        style={{ outline: '2px solid green' }}
      >
        {renderPriceLines(item.price, item.link)}
      </div>
    </div>
  )
}

type ScrollRefs = Record<string, HTMLDivElement | null>

const SECTION_SCROLL_OFFSET = 120

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
  const priceTooltip = service.priceTooltip ?? DEFAULT_PRICE_TOOLTIP
  const isLaserService = service.slug === 'serwis-drukarek-laserowych'
  const isSpecialTooltipService = SPECIAL_TOOLTIP_SERVICES.has(service.slug)
  const shouldHighlightPrices = isLaserService && isCategoryTooltipOpen

  // Refs для измерения размеров контейнеров
  const cenaHeaderRef = useRef<HTMLDivElement | null>(null)
  const priceColumnRef = useRef<HTMLDivElement | null>(null)
  const sectionCardRef = useRef<HTMLDivElement | null>(null)
  const accordionTriggerRef = useRef<HTMLButtonElement | null>(null)
  const accordionContentRef = useRef<HTMLDivElement | null>(null)
  
  // Состояние для хранения размеров
  const [measurements, setMeasurements] = useState<{
    cenaHeader: { width: number; left: number; right: number; paddingLeft: number; paddingRight: number } | null
    priceColumn: { width: number; left: number; right: number; paddingLeft: number; paddingRight: number } | null
    sectionCard: { width: number; left: number; right: number; paddingLeft: number; paddingRight: number } | null
    accordionTrigger: { width: number; left: number; right: number; paddingLeft: number; paddingRight: number } | null
    accordionContent: { width: number; left: number; right: number; paddingLeft: number; paddingRight: number } | null
  }>({
    cenaHeader: null,
    priceColumn: null,
    sectionCard: null,
    accordionTrigger: null,
    accordionContent: null,
  })

  const renderPriceTooltipContent = () => {
    if (!isLaserService) {
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

  // Измерение размеров контейнеров (только для мобильных)
  useEffect(() => {
    const measureContainers = () => {
      // Проверяем, что мы на мобильной версии (ширина экрана < 768px = md breakpoint)
      const isMobile = window.innerWidth < 768
      if (!isMobile) {
        return // Измеряем только на мобильных
      }

      const newMeasurements: typeof measurements = {
        cenaHeader: null,
        priceColumn: null,
        sectionCard: null,
        accordionTrigger: null,
        accordionContent: null,
      }

      // Измерение контейнера с "Cena"
      if (cenaHeaderRef.current) {
        const rect = cenaHeaderRef.current.getBoundingClientRect()
        const styles = window.getComputedStyle(cenaHeaderRef.current)
        newMeasurements.cenaHeader = {
          width: rect.width,
          left: rect.left,
          right: rect.right,
          paddingLeft: parseFloat(styles.paddingLeft) || 0,
          paddingRight: parseFloat(styles.paddingRight) || 0,
        }
      }

      // Измерение контейнера с колонкой цен
      if (priceColumnRef.current) {
        const rect = priceColumnRef.current.getBoundingClientRect()
        const styles = window.getComputedStyle(priceColumnRef.current)
        newMeasurements.priceColumn = {
          width: rect.width,
          left: rect.left,
          right: rect.right,
          paddingLeft: parseFloat(styles.paddingLeft) || 0,
          paddingRight: parseFloat(styles.paddingRight) || 0,
        }
      }

      // Измерение родительского контейнера секции
      if (sectionCardRef.current) {
        const rect = sectionCardRef.current.getBoundingClientRect()
        const styles = window.getComputedStyle(sectionCardRef.current)
        newMeasurements.sectionCard = {
          width: rect.width,
          left: rect.left,
          right: rect.right,
          paddingLeft: parseFloat(styles.paddingLeft) || 0,
          paddingRight: parseFloat(styles.paddingRight) || 0,
        }
      }

      // Измерение AccordionTrigger (где находится "Cena")
      if (accordionTriggerRef.current) {
        const rect = accordionTriggerRef.current.getBoundingClientRect()
        const styles = window.getComputedStyle(accordionTriggerRef.current)
        newMeasurements.accordionTrigger = {
          width: rect.width,
          left: rect.left,
          right: rect.right,
          paddingLeft: parseFloat(styles.paddingLeft) || 0,
          paddingRight: parseFloat(styles.paddingRight) || 0,
        }
      }

      // Измерение AccordionContent (где находится таблица с ценами)
      if (accordionContentRef.current) {
        const rect = accordionContentRef.current.getBoundingClientRect()
        const styles = window.getComputedStyle(accordionContentRef.current)
        newMeasurements.accordionContent = {
          width: rect.width,
          left: rect.left,
          right: rect.right,
          paddingLeft: parseFloat(styles.paddingLeft) || 0,
          paddingRight: parseFloat(styles.paddingRight) || 0,
        }
      }

      setMeasurements(newMeasurements)

      // Вывод размеров в консоль с фокусом на ключевые измерения
      const trigger = newMeasurements.accordionTrigger
      const content = newMeasurements.accordionContent
      
      if (trigger && content && newMeasurements.cenaHeader) {
        const cena = newMeasurements.cenaHeader
        const card = newMeasurements.sectionCard
        
        // Ключевые измерения
        const triggerWidth = trigger.width
        const triggerRight = trigger.right
        const contentWidth = content.width
        const contentRight = content.right
        const rightDiff = contentRight - triggerRight
        
        // Анализ доступного пространства для "Cena"
        const cenaWidth = cena.width
        const cenaRight = cena.right
        const availableSpaceInTrigger = triggerRight - cenaRight
        const leftPartWidth = cena.left - trigger.left
        const rightPartWidth = triggerRight - cena.right
        
        console.log('\n' + '='.repeat(80))
        console.log('📐 КЛЮЧЕВЫЕ ИЗМЕРЕНИЯ (мобильная версия < 768px)')
        console.log('='.repeat(80))
        
        console.log('\n1️⃣ ACCORDION TRIGGER (где находится "Cena"):')
        console.log(`   • Ширина: ${triggerWidth.toFixed(1)}px`)
        console.log(`   • Правая граница: ${triggerRight.toFixed(1)}px`)
        console.log(`   • Левая граница: ${trigger.left.toFixed(1)}px`)
        
        console.log('\n2️⃣ ACCORDION CONTENT (где находятся строки с ценами):')
        console.log(`   • Ширина: ${contentWidth.toFixed(1)}px`)
        console.log(`   • Правая граница: ${contentRight.toFixed(1)}px`)
        console.log(`   • Левая граница: ${content.left.toFixed(1)}px`)
        
        console.log('\n3️⃣ РАЗНИЦА МЕЖДУ ПРАВЫМИ ГРАНИЦАМИ:')
        if (rightDiff === 0) {
          console.log(`   ✅ Правые границы СОВПАДАЮТ (разница: ${rightDiff.toFixed(1)}px)`)
        } else if (rightDiff > 0) {
          console.log(`   ⚠️  Content правее Trigger на: ${rightDiff.toFixed(1)}px`)
          console.log(`   → AccordionContent выступает за правый край AccordionTrigger`)
        } else {
          console.log(`   ⚠️  Trigger правее Content на: ${Math.abs(rightDiff).toFixed(1)}px`)
          console.log(`   → AccordionTrigger выступает за правый край AccordionContent`)
        }
        
        console.log('\n4️⃣ ПРОВЕРКА: ПОМЕЩАЕТСЯ ЛИ БЛОК "Cena" В ПРАВУЮ ЧАСТЬ РОДИТЕЛЯ?')
        console.log(`   • Ширина блока "Cena": ${cenaWidth.toFixed(1)}px`)
        console.log(`   • Доступное место справа от "Cena" в Trigger: ${availableSpaceInTrigger.toFixed(1)}px`)
        console.log(`   • Левая часть Trigger (до "Cena"): ${leftPartWidth.toFixed(1)}px`)
        console.log(`   • Правая часть Trigger (после "Cena"): ${rightPartWidth.toFixed(1)}px`)
        
        if (availableSpaceInTrigger >= 0) {
          console.log(`   ✅ Есть свободное место справа: ${availableSpaceInTrigger.toFixed(1)}px`)
          
          // Проверяем, достаточно ли места для выравнивания
          const neededShift = rightDiff // Сколько нужно сдвинуть "Cena" вправо
          if (neededShift > 0 && availableSpaceInTrigger >= neededShift) {
            console.log(`   ✅ Достаточно места для выравнивания!`)
            console.log(`   → Можно сдвинуть "Cena" вправо на ${neededShift.toFixed(1)}px`)
          } else if (neededShift > 0 && availableSpaceInTrigger < neededShift) {
            console.log(`   ❌ НЕ достаточно места для полного выравнивания`)
            console.log(`   → Нужно: ${neededShift.toFixed(1)}px, доступно: ${availableSpaceInTrigger.toFixed(1)}px`)
            console.log(`   → Нехватка: ${(neededShift - availableSpaceInTrigger).toFixed(1)}px`)
          }
        } else {
          console.log(`   ❌ "Cena" выходит за правый край Trigger!`)
          console.log(`   → Превышение: ${Math.abs(availableSpaceInTrigger).toFixed(1)}px`)
        }
        
        if (card) {
          console.log('\n5️⃣ ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ:')
          console.log(`   • Родительская карточка (правая граница): ${card.right.toFixed(1)}px`)
          console.log(`   • Разница: Content vs Карточка: ${(contentRight - card.right).toFixed(1)}px`)
          console.log(`   • Разница: Trigger vs Карточка: ${(triggerRight - card.right).toFixed(1)}px`)
        }
        
        console.log('\n' + '='.repeat(80) + '\n')
      }
    }

    // Измеряем при открытии секции и при изменении размера окна
    if (openSection && openSection !== 'faq') {
      // Небольшая задержка для рендеринга
      setTimeout(measureContainers, 100)
    }

    window.addEventListener('resize', measureContainers)
    return () => window.removeEventListener('resize', measureContainers)
  }, [openSection])

  // Компонент для отображения размеров
  const MeasurementDisplay = () => {
    if (!openSection || openSection === 'faq') return null
    if (!measurements.cenaHeader || !measurements.priceColumn || !measurements.sectionCard) return null

    const cena = measurements.cenaHeader
    const price = measurements.priceColumn
    const card = measurements.sectionCard
    const trigger = measurements.accordionTrigger
    const content = measurements.accordionContent

    const rightDiff = price.right - cena.right
    const leftDiff = price.left - cena.left

    // Формируем текст для копирования
    const copyText = `🟡 Карточка секции (жёлтая рамка):
width: ${card.width.toFixed(1)}px
left: ${card.left.toFixed(1)}px
right: ${card.right.toFixed(1)}px
paddingLeft: ${card.paddingLeft.toFixed(1)}px
paddingRight: ${card.paddingRight.toFixed(1)}px

🔵 Контейнер "Cena" (голубая рамка):
width: ${cena.width.toFixed(1)}px
left: ${cena.left.toFixed(1)}px
right: ${cena.right.toFixed(1)}px
paddingLeft: ${cena.paddingLeft.toFixed(1)}px
paddingRight: ${cena.paddingRight.toFixed(1)}px

🟢 Колонка цен (зелёная рамка):
width: ${price.width.toFixed(1)}px
left: ${price.left.toFixed(1)}px
right: ${price.right.toFixed(1)}px
paddingLeft: ${price.paddingLeft.toFixed(1)}px
paddingRight: ${price.paddingRight.toFixed(1)}px

📊 Разница:
Разница правых краёв (price.right - cena.right): ${rightDiff.toFixed(1)}px
Разница левых краёв (price.left - cena.left): ${leftDiff.toFixed(1)}px`

    const handleCopy = () => {
      navigator.clipboard.writeText(copyText)
      alert('Измерения скопированы в буфер обмена!')
    }

    return (
      <div className="fixed bottom-4 left-4 bg-black/95 text-white text-xs p-3 rounded-lg z-50 border-2 border-yellow-400 md:hidden max-w-[300px] font-mono">
        <div className="font-bold mb-2 text-yellow-400 flex items-center justify-between">
          <span>📏 Измерения (мобильная)</span>
          <button
            onClick={handleCopy}
            className="text-xs bg-yellow-400/20 hover:bg-yellow-400/30 px-2 py-1 rounded border border-yellow-400/50"
          >
            Копировать
          </button>
        </div>
        
        <div className="mb-2">
          <div className="text-yellow-300 font-semibold mb-1">🟡 Карточка секции:</div>
          <div className="pl-2 text-[10px] leading-tight">
            <div>width: {card.width.toFixed(1)}px</div>
            <div>left: {card.left.toFixed(1)}px</div>
            <div>right: {card.right.toFixed(1)}px</div>
            <div>paddingLeft: {card.paddingLeft.toFixed(1)}px</div>
            <div>paddingRight: {card.paddingRight.toFixed(1)}px</div>
          </div>
        </div>

        {trigger && (
          <div className="mb-2">
            <div className="text-pink-300 font-semibold mb-1">🩷 AccordionTrigger:</div>
            <div className="pl-2 text-[10px] leading-tight">
              <div>width: {trigger.width.toFixed(1)}px</div>
              <div>left: {trigger.left.toFixed(1)}px</div>
              <div>right: {trigger.right.toFixed(1)}px</div>
            </div>
          </div>
        )}

        <div className="mb-2">
          <div className="text-cyan-300 font-semibold mb-1">🔵 Контейнер "Cena":</div>
          <div className="pl-2 text-[10px] leading-tight">
            <div>width: {cena.width.toFixed(1)}px</div>
            <div>left: {cena.left.toFixed(1)}px</div>
            <div>right: {cena.right.toFixed(1)}px</div>
            <div>paddingLeft: {cena.paddingLeft.toFixed(1)}px</div>
            <div>paddingRight: {cena.paddingRight.toFixed(1)}px</div>
          </div>
        </div>

        {content && (
          <div className="mb-2">
            <div className="text-indigo-300 font-semibold mb-1">💜 AccordionContent:</div>
            <div className="pl-2 text-[10px] leading-tight">
              <div>width: {content.width.toFixed(1)}px</div>
              <div>left: {content.left.toFixed(1)}px</div>
              <div>right: {content.right.toFixed(1)}px</div>
            </div>
          </div>
        )}

        <div className="mb-2">
          <div className="text-green-300 font-semibold mb-1">🟢 Колонка цен:</div>
          <div className="pl-2 text-[10px] leading-tight">
            <div>width: {price.width.toFixed(1)}px</div>
            <div>left: {price.left.toFixed(1)}px</div>
            <div>right: {price.right.toFixed(1)}px</div>
            <div>paddingLeft: {price.paddingLeft.toFixed(1)}px</div>
            <div>paddingRight: {price.paddingRight.toFixed(1)}px</div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-white/20">
          <div className="text-red-300 font-semibold mb-1">📊 Разница:</div>
          <div className="pl-2 text-[10px] leading-tight">
            <div>right diff: {rightDiff.toFixed(1)}px</div>
            <div>left diff: {leftDiff.toFixed(1)}px</div>
          </div>
        </div>
      </div>
    )
  }

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
                ref={section.id === openSection ? sectionCardRef : null}
                className="group relative min-h-[70px] rounded-lg py-1.5 px-0 sm:py-2 md:px-3 border-2 border-[rgba(200,169,107,0.5)] hover:border-[rgba(200,169,107,0.85)] transition-all duration-300 hover:shadow-xl group-data-[state=open]:border-b group-data-[state=open]:border-b-[rgba(191,167,106,0.2)] w-full bg-[rgba(5,5,5,0.85)] md:outline-none" 
                style={{ outline: '2px solid yellow' }}
              >
                <AccordionTrigger 
                  ref={(node) => {
                    if (section.id === openSection && node) {
                      accordionTriggerRef.current = node as HTMLButtonElement
                    }
                  }}
                  className="hover:no-underline [&>svg]:hidden w-full group !py-0 !items-center !gap-0 md:outline-none" 
                  style={{ outline: '2px solid pink' }}
                >
                  <div className={cn(
                    "flex items-center w-full text-left md:outline-none",
                    section.id === 'konserwacja'
                      ? 'md:justify-between'  // На десктопе используем space-between для правильного позиционирования
                      : ''
                  )} style={{ outline: '2px solid lime' }}>
                    <div className={cn(
                      "flex items-center min-w-0 md:outline-none",
                      section.id === 'konserwacja'
                        ? 'flex-1 md:max-w-[calc(100%-140px)]'  // На десктопе ограничиваем максимальную ширину левой части
                        : 'flex-1'
                    )} style={{ outline: '2px solid aqua' }}>
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

                    {section.id !== 'faq' && (
                      <>
                        <div className={cn(
                          "flex items-center gap-3 sm:gap-4 flex-shrink-0 md:outline-none",
                          section.id === 'konserwacja'
                            ? 'ml-3 sm:ml-0 md:ml-0'  // На десктопе убираем отступ слева
                            : 'ml-3 sm:ml-4'  // Для остальных оставляем как было
                        )} style={{ outline: '2px solid purple' }}>
                          <div
                            className={cn(
                              'flex items-center justify-center md:outline-none',
                              section.id === 'diagnoza' || section.id === 'dojazd'
                                ? 'min-w-[96px] sm:min-w-[120px]'
                                : 'min-w-0 sm:min-w-[120px]'
                            )}
                            style={{ outline: '2px solid orange' }}
                          >
                            {(section.id === 'diagnoza' || section.id === 'dojazd') && (
                              <span className="text-lg md:text-xl font-table-accent text-[rgba(255,255,245,0.85)] group-data-[state=open]:hidden whitespace-nowrap">
                                GRATIS
                              </span>
                            )}
                            <div 
                              ref={section.id === openSection ? cenaHeaderRef : null}
                              className="text-center hidden group-data-[state=open]:block w-full md:outline-none" 
                              style={{ outline: '2px solid cyan' }}
                            >
                              <div
                                className={cn(
                                  'flex items-center gap-2 text-lg md:text-xl font-cormorant font-semibold text-[#ffffff] leading-[1.05] whitespace-nowrap md:outline-none',
                                  section.id === 'diagnoza' || section.id === 'dojazd'
                                    ? 'justify-center'
                                    : section.id === 'konserwacja'
                                    ? 'justify-end md:justify-center'
                                    : 'justify-end'
                                )}
                                style={{ outline: '2px solid magenta' }}
                              >
                                <span className="hidden sm:inline">Cena, zł</span>
                                <span className="inline sm:hidden" style={{ outline: '2px solid red' }}>Cena</span>
                                <TooltipProvider delayDuration={100}>
                                  <Tooltip
                                    onOpenChange={open => {
                                      if (isLaserService) {
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
                                      {...(isLaserService
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
                              </div>
                              <span
                                className="font-table-sub text-[14px] text-[#ede0c4] mt-0.5 leading-[1.1] hidden sm:block"
                                style={{ textShadow: supplementTextShadow }}
                              >
                                (kategorie urządzeń)
                              </span>
                            </div>
                          </div>

                          <div
                            className={cn(
                              'items-center justify-center hidden md:flex',
                              section.id === 'diagnoza' || section.id === 'dojazd'
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
                  ref={(node) => {
                    if (section.id === openSection && node) {
                      accordionContentRef.current = node as HTMLDivElement
                    }
                  }}
                  className="pt-3 pb-3 max-h-[70vh] overflow-y-auto scroll-smooth accordion-scroll relative z-10 md:border-t md:border-[rgba(200,169,107,0.3)] md:mt-2 md:border-x md:border-[rgba(191,167,106,0.3)] md:mx-2 md:mb-2 md:rounded-b-lg md:outline-none" 
                  style={{ outline: '2px solid indigo' }}
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
                                <div
                                  data-subcategory-link
                                  className="flex items-center gap-2 text-[#bfa76a] text-xs font-serif group-hover:translate-x-1 transition-transform whitespace-nowrap"
                                >
                                  <span>Zobacz cennik</span>
                                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                                </div>
                              )}
                            </div>
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
                                      priceColumnRef,
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
                                              'py-1 pl-2 pr-2 align-middle leading-[1.3] text-center w-auto min-w-[80px]',
                                              shouldHighlightPrices
                                                ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] brightness-110'
                                                : ''
                                            )}
                                          >
                                            {renderPriceLines(item.price, item.link)}
                                          </TableCell>
                                          <TableCell className="text-center py-1 align-middle leading-[1.3]">
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
                            priceColumnRef,
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
                                <TableCell className="py-1 pl-2 pr-2 align-middle leading-[1.3] text-center w-auto min-w-[80px]">
                                  {renderPriceLines(item.price, item.link)}
                                </TableCell>
                                <TableCell className="text-center py-1 align-middle leading-[1.3]">
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
      <MeasurementDisplay />
    </div>
  )
}

export default ServiceAccordion

