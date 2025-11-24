'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast, Toaster } from 'sonner'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import manifest from '@/config/KANONICZNY_MANIFEST.json'

// Schemat walidacji Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Imię i nazwisko musi mieć min. 2 znaki' }),
  phone: z.string().min(9, { message: 'Numer telefonu jest za krótki' }),
  email: z.string().email({ message: 'Niepoprawny adres e-mail' }),
  address: z.string().min(5, { message: 'Adres musi mieć min. 5 znaków' }),
  deviceType: z.enum(['printer', 'computer'], { required_error: 'Wybierz typ urządzenia' }),
  deviceModel: z.string().optional(),
  problemDescription: z.string().min(10, { message: 'Opis problemu musi mieć min. 10 znaków' }),
  replacementPrinter: z.boolean().default(false),
  agreements: z.literal(true, { errorMap: () => ({ message: 'Musisz zaakceptować regulamin' }) }),
})

type FormValues = z.infer<typeof formSchema>

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      deviceType: undefined,
      deviceModel: '',
      problemDescription: '',
      replacementPrinter: false,
      agreements: undefined,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    // Symulacja wysyłki
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Form data:', data)
    setIsSubmitting(false)
    toast.success('Zgłoszenie wysłane pomyślnie!')
    reset()
  }

  return (
    <section id="kontakt" className="relative py-12 md:py-20">
      <Toaster position="bottom-center" />
      
      {/* Tło sekcji */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${manifest.services_background}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
        
        {/* Tekst nad formularzem */}
        <p className="text-white/90 text-lg md:text-xl text-center mb-8 drop-shadow-md font-serif italic">
          „Chcesz zamówić serwis lub potrzebujesz wsparcia? Napisz lub zadzwoń”
        </p>

        {/* Karta formularza */}
        <div className="w-full max-w-3xl bg-paper-texture shadow-2xl rounded-sm p-6 md:p-10 border border-[#3a2e24]/20">
          
          {/* Nagłówek formularza */}
          <h2 className="text-[#3a2e24] text-3xl md:text-4xl font-cormorant font-bold text-center mb-8 border-b border-[#3a2e24]/10 pb-4">
            Formularz zgłoszeniowy
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Imię i Telefon - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Imię i nazwisko */}
              <div className="space-y-2">
                <label className="block text-[#3a2e24] font-bold font-cormorant text-lg">
                  Imię i nazwisko
                </label>
                <input
                  {...register('name')}
                  placeholder="Jan Kowalski"
                  className="w-full bg-transparent border border-[#3a2e24]/60 rounded-sm px-4 py-2 text-[#3a2e24] placeholder:text-[#3a2e24]/50 focus:outline-none focus:border-[#bfa76a] focus:ring-1 focus:ring-[#bfa76a] transition-all"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Telefon */}
              <div className="space-y-2">
                <label className="block text-[#3a2e24] font-bold font-cormorant text-lg">
                  Numer telefonu
                </label>
                <div className="phone-input-container">
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        country={'ua'}
                        value={field.value}
                        onChange={(phone) => field.onChange(phone)}
                        onlyCountries={['ua', 'pl', 'de', 'cz', 'sk', 'lt', 'gb']}
                        inputClass="!w-full !bg-transparent !border-[#3a2e24]/60 !text-[#3a2e24] !h-[42px] !rounded-sm !pl-[48px]"
                        buttonClass="!bg-transparent !border-[#3a2e24]/60 !rounded-l-sm !border-r-0"
                        dropdownClass="!bg-[#f5f5f0] !text-[#3a2e24]"
                      />
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <label className="block text-[#3a2e24] font-bold font-cormorant text-lg">
                Adres e-mail
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="jan.kowalski@example.com"
                className="w-full bg-transparent border border-[#3a2e24]/60 rounded-sm px-4 py-2 text-[#3a2e24] placeholder:text-[#3a2e24]/50 focus:outline-none focus:border-[#bfa76a] focus:ring-1 focus:ring-[#bfa76a] transition-all"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Adres */}
            <div className="space-y-2">
              <label className="block text-[#3a2e24] font-bold font-cormorant text-lg">
                Adres
              </label>
              <input
                {...register('address')}
                placeholder="ul. Przykładowa 1, 50-001 Wrocław"
                className="w-full bg-transparent border border-[#3a2e24]/60 rounded-sm px-4 py-2 text-[#3a2e24] placeholder:text-[#3a2e24]/50 focus:outline-none focus:border-[#bfa76a] focus:ring-1 focus:ring-[#bfa76a] transition-all"
              />
              {errors.address && (
                <p className="text-red-600 text-sm">{errors.address.message}</p>
              )}
            </div>

            {/* Typ urządzenia */}
            <div className="space-y-2">
              <label className="block text-[#3a2e24] font-bold font-cormorant text-lg mb-2">
                Typ urządzenia
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="printer"
                    {...register('deviceType')}
                    className="accent-[#bfa76a] w-5 h-5"
                  />
                  <span className="text-[#3a2e24]">Drukarka</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="computer"
                    {...register('deviceType')}
                    className="accent-[#bfa76a] w-5 h-5"
                  />
                  <span className="text-[#3a2e24]">Komputer / Laptop</span>
                </label>
              </div>
              {errors.deviceType && (
                <p className="text-red-600 text-sm">{errors.deviceType.message}</p>
              )}
            </div>

            {/* Model urządzenia */}
            <div className="space-y-2">
              <label className="block text-[#3a2e24] font-bold font-cormorant text-lg">
                Model urządzenia
              </label>
              <input
                {...register('deviceModel')}
                placeholder="np. HP LaserJet Pro M404dn"
                className="w-full bg-transparent border border-[#3a2e24]/60 rounded-sm px-4 py-2 text-[#3a2e24] placeholder:text-[#3a2e24]/50 focus:outline-none focus:border-[#bfa76a] focus:ring-1 focus:ring-[#bfa76a] transition-all"
              />
            </div>

            {/* Opis problemu */}
            <div className="space-y-2">
              <label className="block text-[#3a2e24] font-bold font-cormorant text-lg">
                Opis problemu
              </label>
              <textarea
                {...register('problemDescription')}
                rows={4}
                placeholder="Proszę opisać problem z urządzeniem..."
                className="w-full bg-transparent border border-[#3a2e24]/60 rounded-sm px-4 py-2 text-[#3a2e24] placeholder:text-[#3a2e24]/50 focus:outline-none focus:border-[#bfa76a] focus:ring-1 focus:ring-[#bfa76a] transition-all resize-y"
              />
              {errors.problemDescription && (
                <p className="text-red-600 text-sm">{errors.problemDescription.message}</p>
              )}
            </div>

            {/* Checkboxy */}
            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('replacementPrinter')}
                  className="mt-1 accent-[#bfa76a] w-5 h-5"
                />
                <span className="text-[#3a2e24] group-hover:text-[#bfa76a] transition-colors">
                  Potrzebuję drukarki zastępczej na czas naprawy.
                </span>
              </label>

              <div className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('agreements')}
                    className="mt-1 accent-[#bfa76a] w-5 h-5"
                  />
                  <span className="text-[#3a2e24] text-sm">
                    Oświadczam, że zapoznałem/am się z{' '}
                    <Link href="/polityka-prywatnosci" className="underline hover:text-[#bfa76a]">
                      Polityką Prywatności
                    </Link>{' '}
                    oraz{' '}
                    <Link href="/regulamin" className="underline hover:text-[#bfa76a]">
                      Regulaminem
                    </Link>{' '}
                    i akceptuję ich postanowienia.
                  </span>
                </label>
                {errors.agreements && (
                  <p className="text-red-600 text-sm ml-8">{errors.agreements.message}</p>
                )}
              </div>
            </div>

            {/* Przycisk Submit */}
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative group px-10 py-3 bg-white/10 hover:bg-white/20 border border-[#3a2e24]/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] rounded-sm transition-all duration-300"
              >
                <span className="font-cormorant font-bold text-2xl text-[#3a2e24] tracking-wide group-hover:text-black flex items-center gap-2">
                  {isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
                  Wyślij zgłoszenie
                </span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  )
}
