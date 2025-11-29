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

const updateDiagnosisPrice = (sections: PricingSection[], price: string) => {
  const diagnosisSection = sections.find(section => section.id === 'diagnoza')
  const targetItem = diagnosisSection?.items?.find(item =>
    item.service.startsWith('Diagnoza i wycena w formie pisemnej (bez naprawy')
  )
  if (targetItem) {
    targetItem.price = price
  }
}

const updateDojazdReturnPrice = (sections: PricingSection[], price: string) => {
  const transportSection = sections.find(section => section.id === 'dojazd')
  const targetItem = transportSection?.items?.find(item =>
    item.service.startsWith('Dojazd (przy rezygnacji z naprawy)')
  )
  if (targetItem) {
    targetItem.price = price
  }
}

const createLaptopPricingSections = (): PricingSection[] => {
  const sections = createPricingSections()
  updateDiagnosisPrice(sections, '90')
  updateDojazdReturnPrice(sections, '100')
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
  const serviceSection = sections.find(section => section.id === 'naprawy')
  const softwareSubcategory = serviceSection?.subcategories?.[0]
  if (softwareSubcategory) {
    softwareSubcategory.title = 'Oprogramowanie'
    softwareSubcategory.items = [
      {
        service:
          'Instalacja systemu Windows/Linux z aktualizacjami i sterownikami (bez zachowania danych) (Nie instalujemy oprogramowania bez ważnej i legalnej licencji. Pomagamy w zakupie licencji.)',
        price: '150',
        duration: '1-2 dni',
      },
      {
        service: 'Instalacja systemu z zachowaniem danych',
        price: '200',
        duration: '1-2 dni',
      },
      {
        service: 'Instalacja systemu operacyjnego MAC OS X',
        price: '250',
        duration: '1-2 dni',
      },
      {
        service:
          'Instalacja i konfiguracja oprogramowania (pakietów biurowych/multimedialnych) / sterowników',
        price: '120 / godzinę',
        duration: '1-2 dni',
      },
      {
        service:
          'Naprawa i optymalizacja systemu operacyjnego Windows (problemy z uruchomieniem systemu, zapętlanie się przy starcie, restartowanie się, zawieszanie się lub wolna praca)',
        price: '100',
        duration: '1-2 dni',
      },
      {
        service:
          'Kopia (odzyskanie) danych z uszkodzonego systemu\n(w przypadku awarii systemu Windows, aby odzyskać dokumenty, zdjęcia, filmy i inne pliki)',
        price: '150',
        duration: '1-3 dni',
      },
      {
        service: 'Przywracanie systemu z partycji Recovery (jeśli dostępne)',
        price: '100',
        duration: '1-2 dni',
      },
      {
        service: 'Rozwiązywanie problemów z aktualizacjami Windows (odzyskiwanie systemu po błędnej aktualizacji / BSOD)',
        price: '100-180',
        duration: '1-2 dni',
      },
      {
        service:
          'Odwirusownie (usunięcie wirusów, trojanów, spyware, malware, adware, ransomware i innych złośliwych programów)',
        price: '100',
        duration: '1-2 dni',
      },
      {
        service:
          'Usunięcie haseł systemowych, zabezpieczających system operacyjny, dysk lub BIOS (jeśli legalne i możliwe)',
        price: '100',
        duration: '1-2 dni',
      },
      {
        service: 'Odzyskiwanie haseł użytkownika (jeśli legalne)',
        price: '100',
        duration: '1-2 dni',
      },
      {
        service: 'Upgrade (aktualizacja) BIOS-u (bez uszkodzenia kości i wylutowania)',
        price: '50',
        duration: '1-2 dni',
      },
      {
        service: 'Reset / naprawa / rekonstrukcja UEFI/BIOS ustawień',
        price: '80-120',
        duration: '1-2 dni',
      },
      {
        service: 'Reset/odzyskiwanie BIOS/UEFI (po błędnym flashu / update)',
        price: '100',
        duration: '1-2 dni',
      },
      {
        service: 'Programowanie BIOS (odczyt / rewrite / flash z pliku)',
        price: '100',
        duration: '1-2 dni',
      },
      {
        service: 'Programowanie BIOSu po wylutowaniu w programatorze',
        price: '150',
        duration: '1-2 dni',
      },
      {
        service: 'Indywidualna konfiguracja/naprawa systemu Windows',
        price: '120 / godzinę',
        duration: '-',
      },
      {
        service: 'Zdalna pomoc informatyka',
        price: '120 / godzinę',
        duration: '-',
      },
    ]
  }
  const boardSubcategory = serviceSection?.subcategories?.[1]
  if (boardSubcategory) {
    boardSubcategory.title = 'Płyta główna / zasilanie / podzespoły'
    boardSubcategory.items = [
      {
        service: 'Wymiana płyty głównej (przekładka + konfiguracja)',
        price: '180 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Naprawa płyty głównej (przerwane ścieżki, zimne luty, mikrolutowanie)',
        price: '200-350 + części',
        duration: '2-7 dni',
      },
      {
        service: 'Wymiana gniazda USB / HDMI / Audio / DC-jack, …',
        price: '150 + część',
        duration: '2-5 dni',
      },
      {
        service:
          'Wymiana lub przelutowanie uszkodzonego gniazda zasilającego (częste wkładanie/wyciąganie wtyczki zasilacza bądź spowodowane upadkiem laptopa)',
        price: '150 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana baterii dla układu CMOS (BIOS) na płycie głównej',
        price: '50-150',
        duration: '1-3 dni',
      },
      {
        service: 'Naprawa układu ładowania (charge controller / MOSFET / BQ / ISL)',
        price: '180-260 + części',
        duration: '2-7 dni',
      },
      {
        service: 'Wymiana układów zasilania (PU, PD, KBC/EC)',
        price: '220-360 + części',
        duration: '3-7 dni',
      },
      {
        service: 'Wymiana przewodu (zewnętrzny kabel) / gniazda zasilacza',
        price: '50 + część',
        duration: '1 dzień',
      },
      {
        service: 'Wymiana / rozbudowa pamięci RAM + test stabilności',
        price: '70 + część',
        duration: '1-2 dni',
      },
      {
        service: 'Naprawa problemów z kartą sieciową (sterowniki / usługi / reset)',
        price: '60-120',
        duration: '1 dzień',
      },
      {
        service: 'Wymiana karty Wi-Fi (M.2 / miniPCIe) + konfiguracja',
        price: '90 + część',
        duration: '1-2 dni',
      },
      {
        service: 'Naprawa Bluetooth (sterowniki / konflikty / parowanie urządzeń)',
        price: '50-120',
        duration: '1-2 dni',
      },
      {
        service: 'Wymiana napędu / nagrywarki',
        price: '50 + część',
        duration: '1-3 dni',
      },
    ]
  }
  const coolingSubcategory = serviceSection?.subcategories?.[2]
  if (coolingSubcategory) {
    coolingSubcategory.title = 'Układ chłodzenia i czystość'
    coolingSubcategory.items = [
      {
        service: 'Diagnostyka układu chłodzenia (pomiar temperatur przed/po czyszczeniu)',
        price: '40',
        duration: '1 dzień',
      },
      {
        service: 'Wymiana wentylatora chłodzenia (montaż nowego)',
        price: '100 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana radiatora',
        price: '100 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Czyszczenie układu chłodzenia w laptopach gamingowych (2-3 wentylatory)',
        price: '220',
        duration: '1-3 dni',
      },
    ]
  }
  const disksSubcategory = serviceSection?.subcategories?.[3]
  if (disksSubcategory) {
    disksSubcategory.title = 'Dyski i dane'
    disksSubcategory.items = [
      {
        service: 'Diagnoza dysku + SMART / test powierzchni',
        price: '50',
        duration: '1-2 dni',
      },
      {
        service: 'Kopia zapasowa danych',
        price: '120',
        duration: '1-2 dni',
      },
      {
        service: 'Migracja danych / klonowanie dysku (stary dysk -> nowy dysk)',
        price: '80-140',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana dysku HDD -> SSD + migracja danych',
        price: '130 + nośnik',
        duration: '1-3 dni',
      },
      {
        service: 'Montaż dysku M.2 NVMe / SATA (z konfiguracją)',
        price: '120 + część',
        duration: '1-2 dni',
      },
    ]
  }
  const recoverySubcategory = serviceSection?.subcategories?.[4]
  if (recoverySubcategory) {
    recoverySubcategory.title = 'Odzyskanie / usuwanie danych'
    recoverySubcategory.items = getRecoveryItems()
  }
  const screenSubcategory = serviceSection?.subcategories?.[5]
  if (screenSubcategory) {
    screenSubcategory.title = 'Ekran i obudowa'
    screenSubcategory.items = [
      {
        service: 'Wymiana uszkodzonej matrycy LCD/LED (standard, bez klejenia)',
        price: '180 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana taśmy sygnałowej matrycy (brak podświetlenia matrycy)',
        price: '120 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana ramki ekranu (front bezel)',
        price: '100 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana zawiasów',
        price: '120 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Naprawa pękniętych mocowań zawiasów, obudowy (wzmocnienie / klejenie)',
        price: '140-240',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana obudowy – klapy ekranu (pokrywa matrycy) lub obudowy dolnej',
        price: '180 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana kamery internetowej / mikrofonu / audio',
        price: '100 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana lub uzupełnienie pojedynczych elementów obudowy (śruby, mocowania, klipsy)',
        price: '20-60',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana baterii wewnętrznej (integralnej w zamkniętej obudowie)',
        price: '120 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Naprawa lub wymiana przycisku zasilania',
        price: '100 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Przełożenie podzespołów do nowej obudowy',
        price: '250',
        duration: '1-3 dni',
      },
    ]
  }
  const keyboardSubcategory = serviceSection?.subcategories?.[6]
  if (keyboardSubcategory) {
    keyboardSubcategory.title = 'Klawiatura / touchpad'
    keyboardSubcategory.items = [
      {
        service: 'Czyszczenie klawiatury + dezynfekcja (bez rozbierania)',
        price: '40',
        duration: 'od ręki',
      },
      {
        service: 'Wymiana pojedynczego klawisza (keycap / stabilizator, jeśli możliwe)',
        price: '20-40 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Naprawa lub wymiana klawiatury przykręcanej',
        price: '120 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Naprawa lub wymiana klawiatury zintegrowanej z obudową (lutowanej lub klejonej)',
        price: '150 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Wymiana klawiatury podświetlanej (RGB / LED)',
        price: '150 + część',
        duration: '1-3 dni',
      },
      {
        service: 'Naprawa lub wymiana touchpada (trackpad)',
        price: '120 + część',
        duration: '1-3 dni',
      },
    ]
  }
  return sections
}

const applyDesktopCleaningSection = (sections: PricingSection[]) => {
  const cleaningSection = sections.find(section => section.id === 'konserwacja')
  if (!cleaningSection) return
  cleaningSection.items = [
    {
      service:
        'PODSTAWOWY do 30 min.\n(przegląd i profilaktyka, zmniejsza ryzyko awarii i stresu – demontaż obudowy, czyszczenie wentylatorów i radiatorów, wymiana past termoprzewodzących CPU/GPU, usunięcie kurzu i zanieczyszczeń, testy obciążeniowe + test temperatur)',
      price: '120',
      duration: '1-3 dni',
    },
    {
      service:
        'STANDARD do 1 godziny (standardowa konserwacja)\n(Zakres PODSTAWOWY + wymiana / dopasowanie termopadów, konserwacja portów, krótki test pamięci RAM i dysku SMART)',
      price: '160',
      duration: '1-3 dni',
    },
    {
      service:
        'PREMIUM do 2 godzin (pełna konserwacja)\n(Zakres STANDARD + porządkowanie okablowania i kanałów powietrznych, czyszczenie klawiatury i portów wewnętrznych, aktualizacja BIOS/UEFI (jeśli wskazana), długie testy obciążeniowe (CPU / GPU / RAM))',
      price: '200',
      duration: '1-3 dni',
    },
  ]
}

const applyDesktopSoftwareSubcategory = (sections: PricingSection[]) => {
  const serviceSection = sections.find(section => section.id === 'naprawy')
  const softwareSubcategory = serviceSection?.subcategories?.[0]
  if (!softwareSubcategory) return
  softwareSubcategory.title = 'Oprogramowanie'
  softwareSubcategory.items = [
    {
      service:
        'Instalacja systemu Windows/Linux z aktualizacjami i sterownikami (bez zachowania danych) (Nie instalujemy oprogramowania bez ważnej i legalnej licencji (pirackich wersji). Pomagamy w zakupie licencji.)',
      price: '150',
      duration: '1-2 dni',
    },
    {
      service: 'Instalacja systemu z zachowaniem danych',
      price: '200',
      duration: '1-2 dni',
    },
    {
      service: 'Instalacja systemu operacyjnego MAC OS X',
      price: '250',
      duration: '1-2 dni',
    },
    {
      service:
        'Instalacja i konfiguracja oprogramowania\n(pakietów biurowych/multimedialnych) / sterowników',
      price: '120 / godzinę',
      duration: '1-2 dni',
    },
    {
      service:
        'Naprawa i optymalizacja systemu operacyjnego Windows (problemy z uruchomieniem systemu, zapętlanie się przy starcie, restartowanie się, zawieszanie się lub wolna praca)',
      price: '100',
      duration: '1-2 dni',
    },
    {
      service:
        'Kopia (odzyskanie) danych z uszkodzonego systemu\n(w przypadku awarii systemu Windows, aby odzyskać dokumenty (word, excel, itp), zdjęcia, filmy i inne pliki)',
      price: '150',
      duration: '1-3 dni',
    },
    {
      service: 'Przywracanie systemu z partycji Recovery (jeśli dostępne)',
      price: '100',
      duration: '1-2 dni',
    },
    {
      service:
        'Rozwiązywanie problemów z aktualizacjami Windows (odzyskiwanie systemu po błędnej aktualizacji / BSOD)',
      price: '100-180',
      duration: '1-2 dni',
    },
    {
      service:
        'Odwirusownie (usunięcie wirusów, trojanów, spyware, malware, adware, ransomware i innych złośliwych programów)',
      price: '100',
      duration: '1-2 dni',
    },
    {
      service:
        'Usunięcie haseł systemowych, zabezpieczających system operacyjny, dysk lub BIOS (jeśli legalne i możliwe)',
      price: '100',
      duration: '1-2 dni',
    },
    {
      service: 'Odzyskiwanie haseł użytkownika (jeśli legalne)',
      price: '100',
      duration: '1-2 dni',
    },
    {
      service: 'Upgrade (aktualizacja) BIOS-u (bez uszkodzenia kości i wylutowania)',
      price: '50',
      duration: '1-2 dni',
    },
    {
      service: 'Reset / naprawa / rekonstrukcja UEFI/BIOS ustawień',
      price: '80-120',
      duration: '1-2 dni',
    },
    {
      service: 'Reset/odzyskiwanie BIOS/UEFI (po błędnym flashu / update)',
      price: '100',
      duration: '1-2 dni',
    },
    {
      service: 'Programowanie BIOS (odczyt / rewrite / flash z pliku)',
      price: '100',
      duration: '1-2 dni',
    },
    {
      service: 'Programowanie BIOSu po wylutowaniu w programatorze',
      price: '150',
      duration: '1-2 dni',
    },
    {
      service: 'Konfiguracja RAID (0/1/5/10)',
      price: '180',
      duration: '1-3 dni',
    },
    {
      service: 'Indywidualna konfiguracja/naprawa systemu Windows',
      price: '120 / godzinę',
      duration: '-',
    },
    {
      service: 'Zdalna pomoc informatyka',
      price: '120 / godzinę',
      duration: '-',
    },
  ]
}

const applyDesktopHardwareSubcategory = (sections: PricingSection[]) => {
  const serviceSection = sections.find(section => section.id === 'naprawy')
  const hardwareSubcategory = serviceSection?.subcategories?.[1]
  if (!hardwareSubcategory) return
  hardwareSubcategory.title = 'Płyta główna / zasilanie / podzespoły'
  hardwareSubcategory.items = [
    {
      service: 'Wymiana procesora',
      price: '50 + część',
      duration: '1-3 dni',
    },
    {
      service: 'Wymiana płyty głównej (przekładka + konfiguracja)',
      price: '120 + część',
      duration: '1-3 dni',
    },
    {
      service:
        'Naprawa płyty głównej (przerwane ścieżki, zimne luty, mikrolutowanie)',
      price: '200-350 + części',
      duration: '2-7 dni',
    },
    {
      service: 'Wymiana gniazda USB / HDMI / Audio / DC-jack, …',
      price: '150 + część',
      duration: '2-5 dni',
    },
    {
      service:
        'Wymiana baterii dla układu CMOS (BIOS) na płycie głównej',
      price: '50',
      duration: '1-3 dni',
    },
    {
      service:
        'Naprawa układu ładowania (charge controller / MOSFET / BQ / ISL)',
      price: '180-260 + części',
      duration: '2-7 dni',
    },
    {
      service: 'Wymiana układów zasilania (PU, PD, KBC/EC)',
      price: '220-360 + części',
      duration: '3-7 dni',
    },
    {
      service:
        'Wymiana części/podzespołów w komputerze stacjonarnym\n(karta grafiki, pamięć RAM, …). Testy diagnostyczne',
      price: '50 + część',
      duration: '1-2 dni',
    },
    {
      service: 'Wymiana zasilacza',
      price: '50-120 + część',
      duration: '1-2 dni',
    },
    {
      service:
        'Naprawa problemów z kartą sieciową (sterowniki / usługi / reset)',
      price: '60-120',
      duration: '1 dzień',
    },
    {
      service:
        'Naprawa Bluetooth (sterowniki / konflikty / parowanie urządzeń)',
      price: '50-120',
      duration: '1-2 dni',
    },
    {
      service: 'Wymiana napędu / nagrywarki',
      price: '50 + część',
      duration: '1-3 dni',
    },
    {
      service: 'Naprawa przycisku POWER / panelu przedniego',
      price: '70 + części',
      duration: '1-3 dni',
    },
    {
      service: 'Wymiana obudowy (pełna przekładka)',
      price: '200',
      duration: '1-2 dni',
    },
    {
      service:
        'Montaż komputera stacjonarnego\n(możemy zamontować z części dostarczonych przez Klienta, lub zakupionych przez nas)',
      price: '120 / godzinę',
      duration: '1-3 dni',
    },
  ]
}

const applyDesktopCoolingSubcategory = (sections: PricingSection[]) => {
  const serviceSection = sections.find(section => section.id === 'naprawy')
  const coolingSubcategory = serviceSection?.subcategories?.[2]
  if (!coolingSubcategory) return
  coolingSubcategory.title = 'Układ chłodzenia i czystość'
  coolingSubcategory.items = [
    {
      service:
        'Diagnostyka układu chłodzenia (pomiar temperatur przed/po czyszczeniu)',
      price: '40',
      duration: '1 dzień',
    },
    {
      service: 'Wymiana wentylatora chłodzenia (montaż nowego)',
      price: '50 + część',
      duration: '1-3 dni',
    },
    {
      service: 'Wymiana radiatora',
      price: '50 + część',
      duration: '1-3 dni',
    },
  ]
}

const applyDesktopStorageSubcategory = (sections: PricingSection[]) => {
  const serviceSection = sections.find(section => section.id === 'naprawy')
  const storageSubcategory = serviceSection?.subcategories?.[3]
  if (!storageSubcategory) return
  storageSubcategory.title = 'Dyski i dane'
  storageSubcategory.items = [
    {
      service: 'Diagnoza dysku + SMART / test powierzchni',
      price: '50',
      duration: '1-2 dni',
    },
    {
      service: 'Kopia zapasowa danych',
      price: '120',
      duration: '1-2 dni',
    },
    {
      service:
        'Migracja danych / klonowanie dysku (stary dysk → nowy dysk)',
      price: '80-140',
      duration: '1-3 dni',
    },
    {
      service: 'Wymiana dysku HDD → SSD + migracja danych',
      price: '130 + nośnik',
      duration: '1-3 dni',
    },
    {
      service: 'Montaż dysku M.2 NVMe / SATA (z konfiguracją)',
      price: '120 + część',
      duration: '1-2 dni',
    },
  ]
}

const getRecoveryItems = (): PricingItem[] => [
  {
    service: 'Oszacowanie możliwości odzyskania danych z uszkodzonego nośnika',
    price: '50',
    duration: '1-2 dni',
  },
  {
    service:
      'Odzyskanie danych (usuniętych plików) po skasowaniu ze sprawnego nośnika (dokumenty, zdjęcia lub filmy, przez przypadkowe ich usunięcie, sformatowanie dysku lub przywrócenie systemu Windows)',
    price: '120-200',
    duration: '1-5 dni',
  },
  {
    service:
      'Odzyskiwanie danych (uszkodzenia logiczne – nośnik (np. dysk twardy) zachował sprawność)',
    price: '180-260',
    duration: '1-5 dni',
  },
  {
    service:
      'Odzyskanie danych z uszkodzonego nośnika (fizycznie lub elektronicznie uszkodzonych dysków HDD i SSD)',
    price: 'od 500',
    duration: '5-15 dni',
  },
  {
    service: 'Trwałe usuwanie danych',
    price: '50',
    duration: '1-2 dni',
  },
]

const applyDesktopRecoverySubcategory = (sections: PricingSection[]) => {
  const serviceSection = sections.find(section => section.id === 'naprawy')
  const recoverySubcategory = serviceSection?.subcategories?.[4]
  if (!recoverySubcategory) return
  recoverySubcategory.title = 'Odzyskanie / usuwanie danych'
  recoverySubcategory.items = getRecoveryItems()
}

const removeDesktopExtraSubcategories = (sections: PricingSection[]) => {
  const serviceSection = sections.find(section => section.id === 'naprawy')
  if (!serviceSection?.subcategories) return
  serviceSection.subcategories = serviceSection.subcategories.filter(
    subcategory =>
      subcategory.title !== 'Oprogramowanie i konfiguracja' &&
      subcategory.title !== 'Usługi dodatkowe'
  )
}

const createDesktopPricingSections = (): PricingSection[] => {
  const sections = createPricingSections()
  updateDiagnosisPrice(sections, '90')
  updateDojazdReturnPrice(sections, '100')
  applyDesktopCleaningSection(sections)
  applyDesktopSoftwareSubcategory(sections)
  applyDesktopHardwareSubcategory(sections)
  applyDesktopCoolingSubcategory(sections)
  applyDesktopStorageSubcategory(sections)
  applyDesktopRecoverySubcategory(sections)
  removeDesktopExtraSubcategories(sections)
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
    pricingSections: createDesktopPricingSections(),
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
