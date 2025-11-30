'use client'

import { useEffect } from 'react'

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
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal content */}
      <div
        className="relative z-10 w-full max-w-3xl px-2 animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-lg border-2 border-[rgba(200,169,107,0.5)] overflow-hidden modal-card-outer">
          <div className="relative px-4 py-6 md:px-8 md:py-10">
            <div className="rounded-lg border border-[#bfa76a]/15 px-6 py-8 md:px-10 md:py-10 text-center space-y-6 modal-card-inner">
              <div>
                <h3 className="text-white text-[34px] md:text-[40px] font-cormorant font-bold leading-tight drop-shadow-[0_0_8px_rgba(0,0,0,0.45)]">
                  Dziękujemy za zgłoszenie!
                </h3>
              </div>

              <div className="space-y-2 font-table-main text-[rgba(255,255,245,0.9)] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                <p>Twoja wiadomość została pomyślnie wysłana.</p>
                <p>Skontaktujemy się z Tobą w najbliższym czasie, aby potwierdzić szczegóły.</p>
                <p>Prosimy o cierpliwość — Twoje zgłoszenie jest już w dobrych rękach.</p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={onClose}
                  className="relative group px-10 py-3 bg-white/10 hover:bg-white/20 border border-black/30 hover:border-2 hover:border-black/80 hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.1),0_0_4px_rgba(0,0,0,0.3)] focus:border-2 focus:border-black/80 focus:shadow-[inset_0_0_20px_rgba(0,0,0,0.1),0_0_4px_rgba(0,0,0,0.3)] rounded-full transition-all duration-300"
                >
                  <span className="font-cormorant font-bold text-2xl text-black tracking-wide group-hover:text-black/80">
                    OK
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

