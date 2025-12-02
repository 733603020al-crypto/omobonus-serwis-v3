'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Paperclip, X } from 'lucide-react'
import Link from 'next/link'
import manifest from '@/config/KANONICZNY_MANIFEST.json'
import { CustomPhoneInput } from '@/components/ui/custom-phone-input'
import { CustomRadio } from '@/components/ui/custom-radio'
import { CustomCheckbox } from '@/components/ui/custom-checkbox'
import { SuccessModal } from '@/components/ui/success-modal'

// Schemat walidacji Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Imię i nazwisko musi mieć min. 2 znaki' }),
  phone: z.string().min(9, { message: 'Numer telefonu jest za krótki' }),
  email: z.string().email({ message: 'Niepoprawny adres e-mail' }),
  address: z.string().min(5, { message: 'Adres musi mieć min. 5 znaków' }),
  deviceType: z.enum(['printer', 'computer', 'other'], { message: 'Wybierz typ urządzenia' }),
  deviceModel: z.string().optional(),
  problemDescription: z.string().min(10, { message: 'Opis problemu musi mieć min. 10 znaków' }),
  replacementPrinter: z.boolean().default(false),
  agreements: z.literal(true, { message: 'Musisz zaakceptować regulamin' }),
})

type FormValues = z.infer<typeof formSchema>

const defaultFormValues: Partial<FormValues> = {
  name: '',
  phone: '',
  email: '',
  address: '',
  deviceType: undefined,
  deviceModel: '',
  problemDescription: '',
  replacementPrinter: false,
  agreements: undefined,
}

const MAX_FILE_SIZE_MB = 25
const ACCEPTED_PREFIXES = [
  'image/',
  'video/',
  'text/',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
]

type AttachmentPreview = {
  id: string
  file: File
  url: string
  kind: 'image' | 'video' | 'file'
}

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([])
  const [attachmentError, setAttachmentError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob)
      })
      attachments.forEach(preview => {
        formData.append('attachments', preview.file)
      })

      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Błąd podczas wysyłania formularza')
      }

      setShowSuccessModal(true)
      reset(defaultFormValues)
      attachments.forEach(preview => URL.revokeObjectURL(preview.url))
      setAttachments([])
      setAttachmentError(null)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <section id="kontakt" className="relative pb-6 md:pb-10 pt-0">
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
        <p className="text-white/90 text-lg md:text-xl text-center mb-8 drop-shadow-md font-serif italic pt-4 md:pt-6">
          „Chcesz zamówić serwis lub potrzebujesz wsparcia? Napisz lub zadzwoń"
        </p>

        {/* Karta formularza - масштабирована на 20% */}
        <div className="w-full max-w-3xl bg-paper-texture shadow-2xl rounded-sm p-4 md:p-6 border border-[#3a2e24]/20 scale-[0.8] origin-top -mb-[15%]">
          
          {/* Nagłówek formularza */}
          <h2 className="text-[#3a2e24] text-3xl md:text-4xl font-cormorant font-bold text-center mb-4 md:mb-5">
            Formularz zgłoszeniowy
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
            
            {/* Imię i Telefon - Grid */}
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {/* Imię i nazwisko */}
              <div className="space-y-2">
                <label className="block text-black font-bold font-sans text-base md:text-lg">
                  Imię i nazwisko
                </label>
                <input
                  {...register('name')}
                  placeholder="Jan Kowalski"
                  className="w-full !bg-transparent border border-black/60 rounded-sm px-4 py-2 text-black text-lg md:text-xl font-sans font-medium placeholder:text-black/60 focus:outline-none hover:border-2 hover:border-black/80 hover:bg-[rgba(0,0,0,0.05)] hover:shadow-[0_0_4px_rgba(0,0,0,0.3)] focus:border-2 focus:border-black/80 focus:bg-[rgba(0,0,0,0.05)] focus:shadow-[0_0_4px_rgba(0,0,0,0.3)] transition-all duration-250"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Telefon */}
              <div className="space-y-2">
                <label className="block text-black font-bold font-sans text-base md:text-lg">
                  Numer telefonu
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <CustomPhoneInput
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <label className="block text-black font-bold font-sans text-base md:text-lg">
                Adres e-mail
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="jan.kowalski@example.com"
                className="w-full !bg-transparent border border-black/60 rounded-sm px-4 py-2 text-black text-lg md:text-xl font-sans font-medium placeholder:text-black/60 focus:outline-none hover:border-2 hover:border-black/80 hover:bg-[rgba(0,0,0,0.05)] hover:shadow-[0_0_4px_rgba(0,0,0,0.3)] focus:border-2 focus:border-black/80 focus:bg-[rgba(0,0,0,0.05)] focus:shadow-[0_0_4px_rgba(0,0,0,0.3)] transition-all duration-250"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Adres */}
            <div className="space-y-2">
              <label className="block text-black font-bold font-sans text-base md:text-lg">
                Adres
              </label>
              <input
                {...register('address')}
                placeholder="ul. Przykładowa 1, 50-001 Wrocław"
                className="w-full !bg-transparent border border-black/60 rounded-sm px-4 py-2 text-black text-lg md:text-xl font-sans font-medium placeholder:text-black/60 focus:outline-none hover:border-2 hover:border-black/80 hover:bg-[rgba(0,0,0,0.05)] hover:shadow-[0_0_4px_rgba(0,0,0,0.3)] focus:border-2 focus:border-black/80 focus:bg-[rgba(0,0,0,0.05)] focus:shadow-[0_0_4px_rgba(0,0,0,0.3)] transition-all duration-250"
              />
              {errors.address && (
                <p className="text-red-600 text-sm">{errors.address.message}</p>
              )}
            </div>

            {/* Typ urządzenia */}
            <div className="space-y-2">
              <label className="block text-black font-bold font-sans text-base md:text-lg mb-2">
                Typ urządzenia
              </label>
              <div className="flex flex-wrap gap-3">
                <Controller
                  name="deviceType"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CustomRadio
                        id="device-printer"
                        name="deviceType"
                        value="printer"
                        checked={field.value === 'printer'}
                        onChange={field.onChange}
                        label="Drukarka"
                      />
                      <CustomRadio
                        id="device-computer"
                        name="deviceType"
                        value="computer"
                        checked={field.value === 'computer'}
                        onChange={field.onChange}
                        label="Komputer / Laptop"
                      />
                      <CustomRadio
                        id="device-other"
                        name="deviceType"
                        value="other"
                        checked={field.value === 'other'}
                        onChange={field.onChange}
                        label="Inne urządzenie"
                      />
                    </>
                  )}
                />
              </div>
              {errors.deviceType && (
                <p className="text-red-600 text-sm">{errors.deviceType.message}</p>
              )}
            </div>

            {/* Model urządzenia */}
            <div className="space-y-2">
              <label className="block text-black font-bold font-sans text-base md:text-lg">
                Model urządzenia
              </label>
              <input
                {...register('deviceModel')}
                placeholder="np. HP LaserJet Pro M404dn"
                className="w-full !bg-transparent border border-black/60 rounded-sm px-4 py-2 text-black text-lg md:text-xl font-sans font-medium placeholder:text-black/60 focus:outline-none hover:border-2 hover:border-black/80 hover:bg-[rgba(0,0,0,0.05)] hover:shadow-[0_0_4px_rgba(0,0,0,0.3)] focus:border-2 focus:border-black/80 focus:bg-[rgba(0,0,0,0.05)] focus:shadow-[0_0_4px_rgba(0,0,0,0.3)] transition-all duration-250"
              />
            </div>

            {/* Opis problemu */}
            <div className="space-y-2">
              <label className="block text-black font-bold font-sans text-base md:text-lg">
                Opis problemu
              </label>
              <textarea
                {...register('problemDescription')}
                rows={4}
                placeholder="Proszę opisać problem z urządzeniem..."
                className="w-full !bg-transparent border border-black/60 rounded-sm px-4 py-2 text-black text-lg md:text-xl font-sans font-medium placeholder:text-black/60 focus:outline-none hover:border-2 hover:border-black/80 hover:bg-[rgba(0,0,0,0.05)] hover:shadow-[0_0_4px_rgba(0,0,0,0.3)] focus:border-2 focus:border-black/80 focus:bg-[rgba(0,0,0,0.05)] focus:shadow-[0_0_4px_rgba(0,0,0,0.3)] transition-all duration-250 resize-y"
              />
              {errors.problemDescription && (
                <p className="text-red-600 text-sm">{errors.problemDescription.message}</p>
              )}
            </div>

            {/* Załączniki */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-black font-bold font-sans text-base md:text-lg">
                  Załącz zdjęcia / filmy (opcjonalnie)
                </label>
                <label
                  htmlFor="attachments"
                  className="inline-flex items-center gap-1 text-[#3a2e24] text-sm font-semibold cursor-pointer border border-[#3a2e24]/40 rounded-full px-3 py-1 hover:bg-[#3a2e24]/10 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  Dodaj
                </label>
              </div>
              <p className="text-[#3a2e24] text-sm italic font-sans">
                Załączone materiały pomogą nam szybciej i dokładniej zidentyfikować problem oraz
                przygotować wycenę naprawy
              </p>
              <input
                id="attachments"
                type="file"
                accept="image/*,video/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
                multiple
                className="hidden"
                onChange={event => {
                  const files = Array.from(event.target.files ?? [])
                  if (!files.length) return

                  let error: string | null = null
                  const nextPreviews: AttachmentPreview[] = []

                  files.forEach(file => {
                    const typeValid = ACCEPTED_PREFIXES.some(prefix => file.type.startsWith(prefix))
                    const sizeValid = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024

                    if (!typeValid) {
                      error = 'Możesz przesłać tylko zdjęcia lub wideo.'
                      return
                    }

                    if (!sizeValid) {
                      error = `Plik ${file.name} jest zbyt duży (maks. ${MAX_FILE_SIZE_MB} MB).`
                      return
                    }

                    const kind = file.type.startsWith('image/')
                      ? 'image'
                      : file.type.startsWith('video/')
                      ? 'video'
                      : 'file'

                    nextPreviews.push({
                      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
                      file,
                      url: URL.createObjectURL(file),
                      kind,
                    })
                  })

                  setAttachmentError(error)
                  if (nextPreviews.length) {
                    setAttachments(prev => [...prev, ...nextPreviews])
                  }
                  event.target.value = ''
                }}
              />

              {attachments.length > 0 && (
                <div className="bg-white/5 border border-[#3a2e24]/20 rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {attachments.map(preview => (
                      <div key={preview.id} className="relative group">
                        <button
                          type="button"
                          onClick={() => {
                            setAttachments(prev => {
                              const rest = prev.filter(item => {
                                if (item.id === preview.id) {
                                  URL.revokeObjectURL(item.url)
                                }
                                return item.id !== preview.id
                              })
                              return rest
                            })
                          }}
                          className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Usuń ${preview.file.name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="w-full aspect-video border border-[#3a2e24]/30 rounded-md overflow-hidden bg-black/20 flex items-center justify-center">
                          {preview.kind === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={preview.url}
                              alt={preview.file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-[#bfa76a] text-xs text-center px-2 leading-tight">
                              <p className="font-semibold mb-1">
                                {preview.kind === 'video' ? 'VIDEO' : 'PLIK'}
                              </p>
                              <p className="break-all">{preview.file.name}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {attachmentError && <p className="text-red-600 text-sm">{attachmentError}</p>}
            </div>

            {/* Checkboxy */}
            <div className="space-y-3 pt-1">
              <Controller
                name="replacementPrinter"
                control={control}
                render={({ field }) => (
                  <CustomCheckbox
                    id="replacement-printer"
                    name="replacementPrinter"
                    checked={field.value || false}
                    onChange={field.onChange}
                    label="Potrzebuję drukarki zastępczej na czas naprawy."
                  />
                )}
              />

              <div className="space-y-1">
                <Controller
                  name="agreements"
                  control={control}
                  render={({ field }) => (
                    <CustomCheckbox
                      id="agreements"
                      name="agreements"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      label={
                        <>
                          Oświadczam, że zapoznałem/am się z{' '}
                          <Link href="/polityka-prywatnosci" className="underline hover:text-black/70">
                            Polityką Prywatności
                          </Link>{' '}
                          oraz{' '}
                          <Link href="/regulamin" className="underline hover:text-black/70">
                            Regulaminem
                          </Link>{' '}
                          i akceptuję ich postanowienia.
                        </>
                      }
                    />
                  )}
                />
                {errors.agreements && (
                  <p className="text-red-600 text-sm ml-8">{errors.agreements.message}</p>
                )}
              </div>
            </div>

            {/* Przycisk Submit */}
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative group px-10 py-3 bg-white/10 hover:bg-white/20 border border-black/30 hover:border-2 hover:border-black/80 hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.1),0_0_4px_rgba(0,0,0,0.3)] focus:border-2 focus:border-black/80 focus:shadow-[inset_0_0_20px_rgba(0,0,0,0.1),0_0_4px_rgba(0,0,0,0.3)] rounded-full transition-all duration-250"
              >
                <span className="font-cormorant font-bold text-2xl text-black tracking-wide group-hover:text-black/80 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
                  Wyślij zgłoszenie
                </span>
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={onCloseSuccessModal} />
    </section>
  )
}
