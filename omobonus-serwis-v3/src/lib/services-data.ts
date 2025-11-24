import manifest from '@/config/KANONICZNY_MANIFEST.json'

export interface PricingItem {
  service: string
  price: string
  duration: string
}

export interface PricingSection {
  id: string
  title: string
  icon?: string
  status?: string // np. "GRATIS", "od 50 zł"
  items: PricingItem[]
}

export interface ServiceData {
  slug: string
  title: string
  subtitle: string
  icon: string
  description: string // Krótki opis na kafelki
  pricingSections: PricingSection[]
}

// Domyślne sekcje cennika (aby nie powtarzać kodu dla każdej usługi na start)
const defaultPricingSections: PricingSection[] = [
  {
    id: 'diagnoza',
    title: 'Diagnoza',
    // icon: manifest.P1_Diagnoza_i_wycena, // Ikona będzie dodana w komponencie
    status: 'GRATIS',
    items: [
      {
        service: 'Diagnoza przy dostawie do serwisu (również w razie rezygnacji z naprawy)',
        price: 'GRATIS',
        duration: '24 h',
      },
      {
        service: 'Diagnoza i wycena w formie pisemnej (bez naprawy, np. dla ubezpieczyciela)',
        price: '50 / 70 / 90 zł',
        duration: '1-3 dni',
      },
      {
        service: 'Usługi w trybie ekspresowym (do 24 godzin, stawka z cennika)',
        price: '+ 100%',
        duration: '24 h',
      },
    ],
  },
  {
    id: 'wycena',
    title: 'Wycena',
    status: 'GRATIS',
    items: [
      {
        service: 'Wstępna wycena naprawy',
        price: 'GRATIS',
        duration: 'od ręki',
      },
    ],
  },
  {
    id: 'dojazd',
    title: 'Dojazd',
    status: 'GRATIS',
    items: [
      {
        service: 'Dojazd do klienta na terenie Wrocławia (przy naprawie)',
        price: 'GRATIS',
        duration: '-',
      },
      {
        service: 'Dojazd poza Wrocław (ustalane indywidualnie)',
        price: 'od 50 zł',
        duration: '-',
      },
    ],
  },
  {
    id: 'konserwacja',
    title: 'Czyszczenie i konserwacja (bez naprawy)',
    items: [
      {
        service: 'Podstawowe czyszczenie sprzętu',
        price: 'od 50 zł',
        duration: '1-2 dni',
      },
      {
        service: 'Pełna konserwacja układu chłodzenia',
        price: 'od 120 zł',
        duration: '1-2 dni',
      },
    ],
  },
  {
    id: 'naprawy',
    title: 'Naprawy i usługi serwisowe',
    items: [
      {
        service: 'Instalacja systemu operacyjnego',
        price: '150 zł',
        duration: '1 dzień',
      },
      {
        service: 'Wymiana podzespołów (dyski, pamięć, matryce)',
        price: 'od 80 zł',
        duration: '1-2 dni',
      },
    ],
  },
]

export const services: ServiceData[] = [
  {
    slug: 'serwis-laptopow',
    title: 'Serwis Laptopów',
    subtitle: 'Pełny wykaz usług i cen, bez ukrytych kosztów (nie „naprawa od 50 zł” lub „cena do uzgodnienia")',
    icon: manifest['01_serwis_laptopow'],
    description: 'Kompleksowa naprawa i konserwacja laptopów wszystkich marek.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'serwis-komputerow-stacjonarnych',
    title: 'Serwis Komputerów Stacjonarnych',
    subtitle: 'Pełny wykaz usług i cen, bez ukrytych kosztów',
    icon: manifest['02_serwis_komputerow_stacjonarnych'],
    description: 'Diagnostyka, naprawa i modernizacja jednostek centralnych.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'outsourcing-it',
    title: 'Outsourcing IT',
    subtitle: 'Obsługa informatyczna dla firm',
    icon: manifest['03_outsourcing_it'],
    description: 'Pełna obsługa informatyczna dla Twojej firmy.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'serwis-drukarek-laserowych',
    title: 'Serwis Drukarek Laserowych i MFU',
    subtitle: 'Profesjonalna naprawa drukarek laserowych i urządzeń wielofunkcyjnych',
    icon: manifest['04_serwis_drukarek_laserowych'],
    description: 'Profesjonalna naprawa i serwis drukarek laserowych.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'serwis-drukarek-atramentowych',
    title: 'Serwis Drukarek Atramentowych',
    subtitle: 'Specjalistyczna naprawa drukarek atramentowych',
    icon: manifest['05_serwis_drukarek_atramentowych'],
    description: 'Naprawa, udrażnianie głowic i konserwacja drukarek atramentowych.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'serwis-drukarek-termicznych',
    title: 'Serwis Drukarek Termiczno-etykietowych',
    subtitle: 'Naprawa drukarek etykiet i kodów kreskowych',
    icon: manifest['06_serwis_drukarek_termicznych'],
    description: 'Serwis drukarek etykiet i kodów kreskowych.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'serwis-drukarek-iglowych',
    title: 'Serwis Drukarek Igłowych',
    subtitle: 'Naprawa specjalistycznych drukarek igłowych',
    icon: manifest['07_serwis_drukarek_iglowych'],
    description: 'Naprawa specjalistycznych drukarek igłowych.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'serwis-ploterow',
    title: 'Serwis Ploterów',
    subtitle: 'Serwis i konserwacja ploterów wielkoformatowych',
    icon: manifest['08_serwis_ploterow'],
    description: 'Serwis i konserwacja ploterów wielkoformatowych.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'serwis-niszczarek',
    title: 'Serwis Niszczarek',
    subtitle: 'Naprawa i konserwacja niszczarek dokumentów',
    icon: manifest['09_serwis_niszczarek'],
    description: 'Naprawa i konserwacja niszczarek dokumentów.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'wynajem-drukarek',
    title: 'Wynajem (Dzierżawa) Drukarek',
    subtitle: 'Dzierżawa urządzeń drukujących dla biur',
    icon: manifest['10_wynajem_drukarek'],
    description: 'Dzierżawa urządzeń drukujących dla biur i firm.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'drukarka-zastepcza',
    title: 'Drukarka Zastępcza',
    subtitle: 'Urządzenie zastępcze na czas naprawy',
    icon: manifest['11_drukarka_zastepcza'],
    description: 'Oferujemy urządzenie zastępcze na czas naprawy.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'regeneracja-tonerow',
    title: 'Wymiana tuszy, regeneracja tonerów',
    subtitle: 'Wymiana tuszy i regeneracja tonerów',
    icon: manifest['12_wymiana_tuszy_regeneracja_tonerow'],
    description: 'Wymiana tuszy i profesjonalna regeneracja tonerów.',
    pricingSections: defaultPricingSections,
  },
  {
    slug: 'odkup-komputerow',
    title: 'Odkup Komputerów i Laptopów',
    subtitle: 'Skup używanych laptopów i komputerów',
    icon: manifest['13_odkup_komputerow_laptopow'],
    description: 'Odkup używanych komputerów i laptopów.',
    pricingSections: defaultPricingSections,
  },
]
