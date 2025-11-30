'use client'

import { useEffect } from 'react'
import Image from 'next/image'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 10000) // Auto-close after 10 seconds

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal content */}
      <div
        className="relative z-10 w-full max-w-lg rounded-lg shadow-2xl overflow-visible animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: "url('/images/services-background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Декоративная рамка */}
        <div className="absolute inset-0 border-2 border-[#bfa76a]/80 rounded-lg pointer-events-none">
          {/* Декоративные углы - верхний левый */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#bfa76a] rounded-tl-lg"></div>
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-[#bfa76a]/60"></div>
          
          {/* Декоративные углы - верхний правый */}
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#bfa76a] rounded-tr-lg"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r border-[#bfa76a]/60"></div>
          
          {/* Декоративные углы - нижний левый */}
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#bfa76a] rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l border-[#bfa76a]/60"></div>
          
          {/* Декоративные углы - нижний правый */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#bfa76a] rounded-br-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-[#bfa76a]/60"></div>
        </div>

        {/* Overlay for better text readability */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />

        <div className="relative z-10 p-8 md:p-10 text-center space-y-3">
          {/* Success message */}
          <h3 className="text-white text-3xl md:text-4xl font-cormorant font-bold mb-4 drop-shadow-lg">
            Dziękujemy za zgłoszenie!
          </h3>

          <p className="text-white/90 text-base md:text-lg font-sans drop-shadow-md">
            Twoja wiadomość została pomyślnie wysłana.
          </p>
          <p className="text-white/90 text-base md:text-lg font-sans drop-shadow-md">
            Skontaktujemy się z Tobą w najbliższym czasie, aby potwierdzić szczegóły.
          </p>
          <p className="text-white/90 text-base md:text-lg font-sans drop-shadow-md">
            Prosimy o cierpliwość — Twoje zgłoszenie jest już w dobrych rękach
          </p>

          {/* OK button */}
          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-white/20 hover:bg-white/30 border border-white/50 rounded-full text-white font-cormorant font-semibold text-lg transition-all duration-300 hover:scale-105"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

