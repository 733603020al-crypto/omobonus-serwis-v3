'use client'

import Link from 'next/link'
import manifest from '@/config/KANONICZNY_MANIFEST.json'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const scrollToSection = (id: string) => {
    if (pathname !== '/') {
      window.location.href = `/#${id}`
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full h-[65px] border-b border-border">
      {/* Tło */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${manifest.Background_1}')` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Zawartość */}
      <div className="relative max-w-6xl mx-auto px-[32px] md:px-[48px] h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault()
              scrollToTop()
            }
          }}
          className="text-[22px] font-cormorant tracking-wide flex gap-2 z-10"
        >
          <span className="text-white">Omobonus</span>
          <span className="text-[#bfa76a]">serwis</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-[28px] z-10 ml-[35px]">
          <Link
            href="/#uslugi"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('uslugi')
            }}
            className="text-[18px] text-[#bfa76a] font-cormorant hover:text-[#bfa76a] transition-colors"
          >
            Usługi
          </Link>
          <Link
            href="/#o-nas"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('o-nas')
            }}
            className="text-[18px] text-[#bfa76a] font-cormorant hover:text-[#bfa76a] transition-colors"
          >
            O nas
          </Link>
          <Link
            href="/#kontakt"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('kontakt')
            }}
            className="text-[18px] text-[#bfa76a] font-cormorant hover:text-[#bfa76a] transition-colors"
          >
            Kontakt
          </Link>
          <Link
            href="https://omobonus.com.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[18px] text-[#bfa76a] font-cormorant hover:text-[#bfa76a] transition-colors"
          >
            Sklep
          </Link>
          <Button
            variant="outline"
            className="text-[18px] text-[#bfa76a] font-cormorant px-4 py-1.5 rounded-full bg-transparent border-[#bfa76a]/80 hover:bg-[#bfa76a]/10 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('kontakt')
            }}
          >
            Wyślij zgłoszenie
          </Button>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden z-10">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border">
            <div className="flex flex-col gap-6 mt-8">
              <Link
                href="/"
                className="text-foreground font-serif text-xl font-bold"
                onClick={(e) => {
                  if (pathname === '/') {
                    e.preventDefault()
                    scrollToTop()
                  }
                  setIsOpen(false)
                }}
              >
                Omobonus serwis
              </Link>
              <Link
                href="/#uslugi"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('uslugi')
                }}
                className="text-foreground hover:text-primary transition-colors"
              >
                Usługi
              </Link>
              <Link
                href="/#o-nas"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('o-nas')
                }}
                className="text-foreground hover:text-primary transition-colors"
              >
                O nas
              </Link>
              <Link
                href="/#kontakt"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('kontakt')
                }}
                className="text-foreground hover:text-primary transition-colors"
              >
                Kontakt
              </Link>
              <Link
                href="https://omobonus.com.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
              >
                Sklep
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('kontakt')
                }}
              >
                Wyślij zgłoszenie
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
