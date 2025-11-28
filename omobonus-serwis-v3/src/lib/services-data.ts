import manifest from '@/config/KANONICZNY_MANIFEST.json'

export interface PricingItem {
  service: string
  price: string
  duration: string
}

export interface PricingSubcategory {
  id: string
  title: string
  items: PricingItem[]
  answer?: string // Odpowiedź dla FAQ (z obsługą formatowania)
}

export interface PricingSection {
  id: string
  title: string
  icon?: string
  status?: string // np. "GRATIS", "od 50 zł"
  items: PricingItem[]
  subcategories?: PricingSubcategory[] // Podkategorie (dla "naprawy" lub "faq")
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
    title: 'Diagnoza i wycena',
    // icon: manifest.P1_Diagnoza_i_wycena, // Ikona będzie dodana w komponencie
    status: 'GRATIS',
    items: [
      {
        service: 'Wstępna diagnoza i wycena online (Opis problemu przez WhatsApp/stronę internetową/telefon - pomożemy ustalić, czy naprawa się opłaca)',
        price: 'GRATIS',
        duration: '15 min',
      },
      {
        service: 'Diagnoza i wycena naprawy (przy dostawie do serwisu) (również w razie rezygnacji z naprawy)',
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
        price: 'stawka z cennika\n+ 100%',
        duration: '24 h',
      },
    ],
  },
  {
    id: 'dojazd',
    title: 'Dojazd',
    status: 'GRATIS',
    items: [
      {
        service: 'Dojazd (przy zleceniu naprawy) (Wrocław do 10 km, w tym diagnoza)',
        price: 'GRATIS',
        duration: '1-3 dni',
      },
      {
        service: 'Dojazd (przy rezygnacji z naprawy) (Wrocław do 10 km, diagnoza + naprawy do 15 min)',
        price: '50 / 80 / 100',
        duration: '1-3 dni',
      },
      {
        service: 'Dojazd (powyżej 10 km) (liczony w obie strony)',
        price: '1,5 zł/km',
        duration: '1-3 dni',
      },
      {
        service: 'Dostarczenie naprawionego urządzenia (Wrocław do 10 km, obie strony)',
        price: '1,5 zł/km',
        duration: '1-3 dni',
      },
      {
        service: 'Usługi w trybie ekspresowym (do 24 godzin)',
        price: 'stawka z cennika\n+ 100%',
        duration: '24 h',
      },
    ],
  },
  {
    id: 'konserwacja',
    title: 'Czyszczenie i konserwacja (bez naprawy)',
    items: [
      {
        service: 'PODSTAWOWY do 30 min. (przegląd i profilaktyka, zmniejsza ryzyko awarii i stresu) (czyszczenie zewnętrzne i wewnętrzne drukarki, czyszczenie i konserwacja karetek, sprawdzenie głowicy, czyszczenie rolek pobierania papieru, kontrola elementów mechanicznych, test jakości wydruku)',
        price: '50 / 100 / 150',
        duration: '1-3 dni',
      },
      {
        service: 'STANDARD do 1 godziny (standardowa konserwacja) (Zakres PODSTAWOWY + Czyszczenie czujników papieru, Czyszczenie stacji serwisowej)',
        price: '100 / 150 / 200',
        duration: '1-3 dni',
      },
      {
        service: 'PREMIUM do 2 godzin (pełna konserwacja) (Zakres STANDARD + Udrożnienie układu tuszu, Czyszczenie pompy/pochłaniacza tuszu, reset liczników serwisowych)',
        price: '150 / 200 / 250',
        duration: '1-3 dni',
      },
    ],
  },
  {
    id: 'naprawy',
    title: 'Naprawy i usługi serwisowe (opcjonalne)',
    subcategories: [
      {
        id: 'naprawy-mechanizm',
        title: 'Mechanizm poboru papieru, rolki, separatory',
        items: [
          {
            service: 'Czyszczenie lub wymiana rolki pobierającej / separatora (Usuwa zaciągnięcia, "chwyta kilka kartek")',
            price: '80 / 120 / 160',
            duration: '1-2 dni',
          },
          {
            service: 'Czyszczenie czujników papieru (Usuwa fałszywe komunikaty "brak papieru")',
            price: '80 / 130 / 170',
            duration: '1-2 dni',
          },
          {
            service: 'Regulacja prowadnic i rolek rejestracji papieru (Wyrównuje tor papieru, zmniejsza zaciągnięcia)',
            price: '90 / 140 / 180',
            duration: '1-3 dni',
          },
          {
            service: 'Naprawa mechanizmu poboru papieru (Usuwa poślizgi i blokady)',
            price: '100 / 150 / 200',
            duration: '1-3 dni',
          },
        ],
      },
      {
        id: 'naprawy-karetka',
        title: 'Karetka i napęd',
        items: [
          {
            service: 'Czyszczenie i smarowanie prowadnic karetki (Usuwa szarpanie i hałas)',
            price: '80 / 130 / 170',
            duration: '1-2 dni',
          },
          {
            service: 'Wymiana paska napędowego karetki (Usuwa "zgrzytanie")',
            price: '120 / 170 / 220',
            duration: '1-3 dni',
          },
          {
            service: 'Czyszczenie / wymiana taśmy enkodera (Usuwa przesunięcia i cienie)',
            price: '100 / 150 / 200',
            duration: '1-3 dni',
          },
          {
            service: 'Naprawa silnika karetki / mechanizmu przesuwu (Drukarka nie przesuwa głowicy)',
            price: '140 / 200 / 260',
            duration: '1-5 dni',
          },
        ],
      },
      {
        id: 'naprawy-glowica',
        title: 'Głowica drukująca i układ tuszu',
        items: [
          {
            service: 'Udrażnianie głowicy drukującej (Usuwa przerwy w druku)',
            price: '120 / 170 / 220',
            duration: '1-3 dni',
          },
          {
            service: 'Płukanie i odpowietrzanie układu tuszu (Zapobiega bąbelkom)',
            price: '130 / 180 / 230',
            duration: '1-3 dni',
          },
          {
            service: 'Wymiana głowicy drukującej (Gdy udrażnianie nie pomaga)',
            price: '120 / 170 / 220',
            duration: '1-3 dni',
          },
          {
            service: 'Serwis stacji serwisowej (Czyści głowicę)',
            price: '120 / 170 / 220',
            duration: '1-3 dni',
          },
          {
            service: 'Reset blokad serwisowych (Odblokowuje drukarkę)',
            price: '80 / 120 / 160',
            duration: '1 dzień',
          },
          {
            service: 'Czyszczenie/wymiana pochłaniacza tuszu ("Pampersy - gąbki")',
            price: '80 / 120 / 160',
            duration: '1-2 dni',
          },
        ],
      },
      {
        id: 'naprawy-elektronika',
        title: 'Naprawy elektroniczne',
        items: [
          {
            service: 'Naprawa lub wymiana gniazda USB / LAN (Drukarka niewidoczna)',
            price: '90 / 130 / 170',
            duration: '1-3 dni',
          },
          {
            service: 'Wymiana panelu sterowania (Uszkodzony wyświetlacz)',
            price: '140 / 200 / 260',
            duration: '1-3 dni',
          },
          {
            service: 'Naprawa lub wymiana taśm sygnałowych (Brak komunikacji)',
            price: '70 / 110 / 150',
            duration: '1-3 dni',
          },
          {
            service: 'Naprawa zasilacza (Drukarka się nie włącza)',
            price: '150 / 200 / 250',
            duration: '1-3 dni',
          },
          {
            service: 'Naprawa płyty głównej (Błędy systemowe)',
            price: '160 / 220 / 280',
            duration: '1-3 dni',
          },
          {
            service: 'Wymiana płyty głównej (Gdy naprawa nieopłacalna)',
            price: '140 / 200 / 260',
            duration: '1-3 dni',
          },
          {
            service: 'Wymiana czujników (Drukarka nie widzi papieru)',
            price: '100 / 150 / 200',
            duration: '1-3 dni',
          },
        ],
      },
      {
        id: 'naprawy-skaner',
        title: 'Skaner / ADF',
        items: [
          {
            service: 'Czyszczenie szyby skanera (Usuwa smugi)',
            price: '70 / 110 / 150',
            duration: '1-2 dni',
          },
          {
            service: 'Kalibracja skanera (Poprawia ostrość)',
            price: '60 / 90 / 120',
            duration: '1-2 dni',
          },
          {
            service: 'Czyszczenie czujników skanera (Usuwa pasy)',
            price: '70 / 110 / 150',
            duration: '1-2 dni',
          },
          {
            service: 'Wymiana lampy skanera (Równomierne oświetlenie)',
            price: '120 / 170 / 220',
            duration: '1-3 dni',
          },
          {
            service: 'Wymiana przewodu skanera (Usuwa przerwy)',
            price: '120 / 170 / 220',
            duration: '1-3 dni',
          },
          {
            service: 'Naprawa zawiasów pokrywy (Stabilizuje docisk)',
            price: '90 / 140 / 190',
            duration: '1-3 dni',
          },
          {
            service: 'Czyszczenie rolek ADF (Usuwa poślizgi)',
            price: '80 / 120 / 160',
            duration: '1-2 dni',
          },
          {
            service: 'Wymiana rolek ADF (Zmniejsza zaciągnięcia)',
            price: '120 / 170 / 220',
            duration: '1-3 dni',
          },
          {
            service: 'Czyszczenie toru ADF (Usuwa zaciągnięcia)',
            price: '80 / 120 / 160',
            duration: '1-2 dni',
          },
          {
            service: 'Kalibracja ADF (Wyrównuje skos)',
            price: '70 / 110 / 150',
            duration: '1-2 dni',
          },
          {
            service: 'Naprawa czujników ADF (Usuwa błędy)',
            price: '90 / 140 / 190',
            duration: '1-3 dni',
          },
          {
            service: 'Wymiana paska ADF (Przywraca płynny ruch)',
            price: '140 / 190 / 240',
            duration: '1-3 dni',
          },
          {
            service: 'Diagnostyka CIS/CCD (Weryfikacja modułu)',
            price: '60 / 90 / 120',
            duration: '1 dzień',
          },
          {
            service: 'Wymiana modułu CIS/CCD (Przywraca jakość)',
            price: '220 / 290 / 360',
            duration: '2-5 dni',
          },
          {
            service: 'Wymiana szkła skanera (Gdy pęknięte)',
            price: '150 / 200 / 250',
            duration: '2-5 dni',
          },
        ],
      },
      {
        id: 'naprawy-software',
        title: 'Oprogramowanie i konfiguracja',
        items: [
          {
            service: 'Instalacja sterowników (Konfiguracja sieci)',
            price: '50 / 100 / 150',
            duration: '1-2 dni',
          },
          {
            service: 'Instalacja aplikacji mobilnych (Drukowanie ze smartfona)',
            price: '50 / 80 / 110',
            duration: '1 dzień',
          },
          {
            service: 'Aktualizacja firmware (Usuwa błędy)',
            price: '80 / 120 / 160',
            duration: '1-2 dni',
          },
          {
            service: 'Reset liczników serwisowych (Odblokowuje funkcje)',
            price: '60 / 90 / 120',
            duration: '1 dzień',
          },
          {
            service: 'Przywrócenie ustawień fabrycznych (Rozwiązuje problemy)',
            price: '60 / 90 / 120',
            duration: '1 dzień',
          },
          {
            service: 'Usunięcie błędów systemowych (Drukarka wraca do pracy)',
            price: '80 / 120 / 160',
            duration: '1-2 dni',
          },
          {
            service: 'Usuwanie konfliktów sterowników (Przywraca komunikację)',
            price: '50 / 80 / 110',
            duration: '1 dzień',
          },
          {
            service: 'Konfiguracja skanowania do komputera (SMB/FTP)',
            price: '70 / 110 / 150',
            duration: '1-2 dni',
          },
          {
            service: 'Konfiguracja skanowania do e-mail (SMTP/Cloud)',
            price: '100 / 150 / 200',
            duration: '1-2 dni',
          },
          {
            service: 'Konfiguracja panelu webowego (Ustawienia sieci)',
            price: '60 / 100 / 140',
            duration: '1 dzień',
          },
          {
            service: 'Migracja drukarki (Nowy komputer)',
            price: '80 / 120 / 160',
            duration: '1 dzień',
          },
          {
            service: 'Zabezpieczenie dostępu (PIN/hasło)',
            price: '60 / 90 / 120',
            duration: '1 dzień',
          },
          {
            service: 'Szkolenie użytkownika (Podstawowa obsługa)',
            price: '30 / 50 / 70',
            duration: 'Na życzenie',
          },
          {
            service: 'Wsparcie zdalne (Konfiguracja/diagnostyka)',
            price: '120 zł/godz',
            duration: '1-2 dni',
          },
        ],
      },
      {
        id: 'naprawy-dodatkowe',
        title: 'Usługi dodatkowe',
        items: [
          {
            service: 'Czyszczenie po silnym zalaniu tonerem (Pełna dekontaminacja)',
            price: '200 / 280 / 360',
            duration: '1-3 dni',
          },
          {
            service: 'Ocena stanu urządzenia przed zakupem (Ekspertyza)',
            price: '40 / 60 / 80',
            duration: '1 dzień',
          },
          {
            service: 'Drukarka zastępcza (Na czas naprawy)',
            price: 'Link',
            duration: '-',
          },
          {
            service: 'Odnowienie obudowy (Bielenie UV)',
            price: '70 / 90 / 120',
            duration: '1-5 dni',
          },
        ],
      },
    ],
    items: [], // Pusta tablica, bo używamy subcategories
  },
]

// FAQ sekcja - dodawana automatycznie do wszystkich usług
const faqSection: PricingSection = {
  id: 'faq',
  title: 'Najczęściej zadawane pytania (FAQ)',
  subcategories: [
    {
      id: 'faq-1',
      title: 'Czy warto naprawiać, czy lepiej kupić nowe?',
      items: [],
      answer: 'To zależy od usterki i dostępności części. Zawsze wykonujemy bezpłatną diagnozę wstępną i informujemy, czy naprawa jest opłacalna. Jeżeli naprawa się nie opłaca – powiemy to otwarcie.',
    },
    {
      id: 'faq-2',
      title: 'Jak wygląda proces naprawy?',
      items: [],
      answer: 'Najpierw przeprowadzamy szybką diagnostykę, przygotowujemy wycenę, a po jej akceptacji przystępujemy do naprawy. W razie potrzeby zamawiamy niezbędne części i informujemy o czasie realizacji.',
    },
    {
      id: 'faq-3',
      title: 'Ile trwa naprawa?',
      items: [],
      answer: 'Typowo 1–3 dni robocze. Gdy trzeba zamówić części lub usterka jest złożona (np. płyta główna), czas może być dłuższy; na bieżąco informujemy o statusie.',
    },
    {
      id: 'faq-4',
      title: 'Czy oferujecie dojazd do Klienta? I czy mogę samodzielnie dostarczyć urządzenie do naprawy?',
      items: [],
      answer: 'Tak, działamy we Wrocławiu i okolicach.\n\n**Dojazd i diagnoza są GRATIS**, jeśli klient akceptuje koszt naprawy. W przypadku prostych usterek możemy naprawić urządzenie na miejscu, a w razie potrzeby zabierzemy ją do naszego serwisu.\n\nW przypadku rezygnacji koszt wynosi **50 zł brutto** (czas + dojazd derwisanta).\n\nI tak, również Państwo mogą samodzielnie dostarczyć do naszej siedziby we Wrocławiu. Przy dostawie urządzenia do naszej siedziby gwarantujemy kompleksową, szybką i bezpłatną diagnostykę w obecności klienta, ciepłe powitanie i darmową kawę (herbatę).',
    },
    {
      id: 'faq-5',
      title: 'Czy mogę dostarczyć urządzenie kurierem?',
      items: [],
      answer: 'Tak. Otrzymasz od nas instrukcję bezpiecznego pakowania.\n\nPo naprawie odeślemy urządzenie do Ciebie.',
    },
    {
      id: 'faq-6',
      title: 'Czy naprawa wpływa na gwarancję producenta?',
      items: [],
      answer: 'Jeżeli naprawa wymaga działań naruszających warunki gwarancji — poinformujemy Cię o tym przed jej wykonaniem.',
    },
    {
      id: 'faq-7',
      title: 'Czy udzielacie gwarancji na naprawy?',
      items: [],
      answer: 'Tak. **3–12 miesięcy**, w zależności od rodzaju naprawy i wymienionych części.',
    },
    {
      id: 'faq-8',
      title: 'Czy naprawiacie komputery / drukarki wszystkich marek?',
      items: [],
      answer: 'Tak. Naprawiamy m.in. HP, Dell, Lenovo, ASUS, Acer, MSI, Apple i inne.',
    },
    {
      id: 'faq-9',
      title: 'Czy oferujecie drukarkę zastępczą na czas naprawy?',
      items: [],
      answer: 'Tak. W razie potrzeby zapewniamy drukarkę zastępczą — bez przestoju w pracy.',
    },
    {
      id: 'faq-10',
      title: 'Czy utracę dane?',
      items: [],
      answer: 'Nie — w naprawach systemowych i mechanicznych chronimy dane. Przy operacjach ryzykownych (np. wymiana dysku, reinstalacja po awarii) proponujemy backup lub odzysk danych przed pracami.',
    },
    {
      id: 'faq-11',
      title: 'Czy odzyskacie dane po awarii?',
      items: [],
      answer: 'Tak — od prostych przypadków (logiczne uszkodzenia) po bardziej złożone (nośnik uszkodzony). Zawsze informujemy o szansach i kosztach przed startem prac.',
    },
    {
      id: 'faq-12',
      title: 'Czy naprawiacie po zalaniu?',
      items: [],
      answer: 'Tak. Wykonujemy mycie płyty w myjce ultradźwiękowej, usuwamy korozję, wymieniamy uszkodzone elementy. Czas i koszt zależą od skali, im szybciej sprzęt trafi do serwisu, tym większa szansa powodzenia.',
    },
    {
      id: 'faq-13',
      title: 'To ceny brutto czy netto?',
      items: [],
      answer: 'Wszystkie podane ceny są **brutto (z VAT)**.',
    },
  ],
  items: [], // Pusta tablica, bo używamy subcategories
}

// Funkcja dodająca FAQ do sekcji cennika
const cloneSections = <T>(data: T): T => JSON.parse(JSON.stringify(data))

const createDefaultPricingSections = (): PricingSection[] => cloneSections(defaultPricingSections)

const createFaqSection = (): PricingSection => cloneSections(faqSection)

const createPricingSections = (): PricingSection[] => {
  return [...createDefaultPricingSections(), createFaqSection()]
}

const createLaptopPricingSections = (): PricingSection[] => {
  const sections = createPricingSections()
  const diagnosisSection = sections.find(section => section.id === 'diagnoza')
  const targetItem = diagnosisSection?.items?.find(item =>
    item.service.startsWith('Diagnoza i wycena w formie pisemnej (bez naprawy')
  )
  if (targetItem) {
    targetItem.price = '90'
  }
  const transportSection = sections.find(section => section.id === 'dojazd')
  const transportItem = transportSection?.items?.find(item =>
    item.service.startsWith('Dojazd (przy rezygnacji z naprawy)')
  )
  if (transportItem) {
    transportItem.price = '100'
  }
  const cleaningSection = sections.find(section => section.id === 'konserwacja')
  if (cleaningSection) {
    cleaningSection.items = [
      {
        service:
          'PODSTAWOWY do 30 min. (przegląd i profilaktyka, zmniejsza ryzyko awarii i stresu) (czyszczenie zewnętrzne i wewnętrzne laptopa, czyszczenie wentylatora i radiatora, wymiana past termoprzewodzących CPU/GPU, usunięcie kurzu i zanieczyszczeń, testy obciążeniowe + test temperatur)',
        price: '120',
        duration: '1-3 dni',
      },
      {
        service:
          'STANDARD do 1 godziny (standardowa konserwacja) (Zakres PODSTAWOWY + Wymiana / dopasowanie termopadów, Konserwacja portów, Krótki test pamięci RAM i dysku SMART)',
        price: '160',
        duration: '1-3 dni',
      },
      {
        service:
          'PREMIUM do 2 godzin (pełna konserwacja) (Zakres STANDARD + Porządkowanie okablowania i kanałów powietrznych, Czyszczenie klawiatury i portów wewnętrznych, Aktualizacja BIOS/UEFI (jeśli wskazana), Długie testy obciążeniowe (CPU / GPU / RAM))',
        price: '200',
        duration: '1-3 dni',
      },
      {
        service:
          'SPECIALNE do 2 godzin (po zalaniu laptopa)\n(Uwaga!!! Prosimy o wyłączenie laptopa i wyciągnięcie baterii natychmiast po zalaniu. Demontaż całego laptopa, identyfikacja obszarów zalania, czyszczenie lub naprawa niesprawnych elementów i zabezpieczenie antykorozyjne płyty głównej i podzespołów, czyszczenie klawiatury i portów wewnętrznych, testy diagnostyczne elektroniczne i programowe, montaż laptopa. Odkurzenie i oczyszczenie wnętrza laptopa oraz uzupełnienie brakujących śrub – gratis.)',
        price: '200\n+ części',
        duration: '1-3 dni',
      },
    ]
  }
  return sections
}

export const services: ServiceData[] = [
  {
    slug: 'serwis-laptopow',
    title: 'Serwis Laptopów',
    subtitle: 'Pełny wykaz usług i cen, bez ukrytych kosztów (nie „naprawa od 50 zł” lub „cena do uzgodnienia")',
    icon: manifest['01_serwis_laptopow'],
    description: 'Kompleksowa naprawa i konserwacja laptopów wszystkich marek.',
    pricingSections: createLaptopPricingSections(),
  },
  {
    slug: 'serwis-komputerow-stacjonarnych',
    title: 'Serwis Komputerów Stacjonarnych',
    subtitle: 'Pełny wykaz usług i cen, bez ukrytych kosztów',
    icon: manifest['02_serwis_komputerow_stacjonarnych'],
    description: 'Diagnostyka, naprawa i modernizacja jednostek centralnych.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'outsourcing-it',
    title: 'Outsourcing IT',
    subtitle: 'Obsługa informatyczna dla firm',
    icon: manifest['03_outsourcing_it'],
    description: 'Pełna obsługa informatyczna dla Twojej firmy.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'serwis-drukarek-laserowych',
    title: 'Serwis Drukarek Laserowych i MFU',
    subtitle: 'Profesjonalna naprawa drukarek laserowych i urządzeń wielofunkcyjnych',
    icon: manifest['04_serwis_drukarek_laserowych'],
    description: 'Profesjonalna naprawa i serwis drukarek laserowych.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'serwis-drukarek-atramentowych',
    title: 'Serwis Drukarek Atramentowych',
    subtitle: 'Specjalistyczna naprawa drukarek atramentowych',
    icon: manifest['05_serwis_drukarek_atramentowych'],
    description: 'Naprawa, udrażnianie głowic i konserwacja drukarek atramentowych.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'serwis-drukarek-termicznych',
    title: 'Serwis Drukarek Termiczno-etykietowych',
    subtitle: 'Naprawa drukarek etykiet i kodów kreskowych',
    icon: manifest['06_serwis_drukarek_termicznych'],
    description: 'Serwis drukarek etykiet i kodów kreskowych.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'serwis-drukarek-iglowych',
    title: 'Serwis Drukarek Igłowych',
    subtitle: 'Naprawa specjalistycznych drukarek igłowych',
    icon: manifest['07_serwis_drukarek_iglowych'],
    description: 'Naprawa specjalistycznych drukarek igłowych.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'serwis-ploterow',
    title: 'Serwis Ploterów',
    subtitle: 'Serwis i konserwacja ploterów wielkoformatowych',
    icon: manifest['08_serwis_ploterow'],
    description: 'Serwis i konserwacja ploterów wielkoformatowych.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'serwis-niszczarek',
    title: 'Serwis Niszczarek',
    subtitle: 'Naprawa i konserwacja niszczarek dokumentów',
    icon: manifest['09_serwis_niszczarek'],
    description: 'Naprawa i konserwacja niszczarek dokumentów.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'wynajem-drukarek',
    title: 'Wynajem (Dzierżawa) Drukarek',
    subtitle: 'Dzierżawa urządzeń drukujących dla biur',
    icon: manifest['10_wynajem_drukarek'],
    description: 'Dzierżawa urządzeń drukujących dla biur i firm.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'drukarka-zastepcza',
    title: 'Drukarka Zastępcza',
    subtitle: 'Urządzenie zastępcze na czas naprawy',
    icon: manifest['11_drukarka_zastepcza'],
    description: 'Oferujemy urządzenie zastępcze na czas naprawy.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'regeneracja-tonerow',
    title: 'Wymiana tuszy, regeneracja tonerów',
    subtitle: 'Wymiana tuszy i regeneracja tonerów',
    icon: manifest['12_wymiana_tuszy_regeneracja_tonerow'],
    description: 'Wymiana tuszy i profesjonalna regeneracja tonerów.',
    pricingSections: createPricingSections(),
  },
  {
    slug: 'odkup-komputerow',
    title: 'Odkup Komputerów i Laptopów',
    subtitle: 'Skup używanych laptopów i komputerów',
    icon: manifest['13_odkup_komputerow_laptopow'],
    description: 'Odkup używanych komputerów i laptopów.',
    pricingSections: createPricingSections(),
  },
]
