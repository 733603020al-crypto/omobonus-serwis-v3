import type { Metadata } from 'next'
import { Cormorant_Garamond, Lora } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: 'Omobonus Serwis — Serwis drukarek i komputerów Wrocław',
  description:
    'Profesjonalny serwis komputerów i drukarek we Wrocławiu — uczciwa wycena, brak ukrytych kosztów.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${lora.variable}`}>
      <body className="font-sans antialiased scroll-smooth">
        {children}
      </body>
    </html>
  )
}