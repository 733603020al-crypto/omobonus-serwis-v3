import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Upewnij się, że w pliku .env.local ustawisz:
// RESEND_API_KEY=your_resend_api_key
// RESEND_FROM_EMAIL=Opcjonalne nadpisanie adresu nadawcy (np. "Omobonus Formularz <no-reply@twojadomena>")
// RESEND_TO_EMAIL=adres docelowy (domyślnie omobonus.pl@gmail.com)
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const DEFAULT_TO = 'omobonus.pl@gmail.com'
const DEFAULT_FROM = 'Omobonus Formularz <no-reply@resend.dev>'

const mapDeviceType = (value: string) => {
  if (value === 'printer') return 'Drukarka'
  if (value === 'computer') return 'Komputer / Laptop'
  return 'Inne urządzenie'
}

const boolToText = (value: string | null) =>
  value === 'true' || value === 'on' ? 'Tak' : 'Nie'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = (formData.get('name') as string) ?? ''
    const phone = (formData.get('phone') as string) ?? ''
    const email = (formData.get('email') as string) ?? ''
    const address = (formData.get('address') as string) ?? ''
    const deviceType = mapDeviceType((formData.get('deviceType') as string) ?? '')
    const deviceModel = (formData.get('deviceModel') as string) || 'Nie podano'
    const problemDescription = (formData.get('problemDescription') as string) ?? ''
    const replacementPrinter = boolToText(formData.get('replacementPrinter') as string | null)

    const attachmentFiles = formData
      .getAll('attachments')
      .filter(item => item instanceof File) as File[]

    const attachments =
      attachmentFiles.length > 0
        ? await Promise.all(
            attachmentFiles.map(async file => ({
              filename: file.name || 'attachment',
              content: Buffer.from(await file.arrayBuffer()),
            })),
          )
        : undefined

    const emailContent = `
Nowe zgłoszenie serwisowe:

Imię i nazwisko: ${name}
Numer telefonu: ${phone}
Adres e-mail: ${email}
Adres: ${address}
Typ urządzenia: ${deviceType}
Model urządzenia: ${deviceModel}
Opis problemu: ${problemDescription}
Potrzebuję drukarki zastępczej: ${replacementPrinter}
    `.trim()

    if (!resend) {
      console.log('RESEND_API_KEY nie jest ustawiony. Dane formularza:', {
        name,
        phone,
        email,
        address,
        deviceType,
        deviceModel,
        problemDescription,
        replacementPrinter,
        attachments: attachmentFiles.map(file => ({ name: file.name, size: file.size })),
      })
      return NextResponse.json({
        success: true,
        message: 'Form data logged locally because RESEND_API_KEY is missing',
      })
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
      to: (process.env.RESEND_TO_EMAIL || DEFAULT_TO).split(',').map(value => value.trim()),
      subject: `Nowe zgłoszenie serwisowe od ${name || 'anonim'}`,
      text: emailContent,
      attachments,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Nie udało się wysłać wiadomości' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości' },
      { status: 500 },
    )
  }
}
