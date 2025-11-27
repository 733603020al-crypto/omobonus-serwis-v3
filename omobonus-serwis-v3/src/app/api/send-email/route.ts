import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Инициализируем Resend только если есть API ключ
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      email,
      address,
      deviceType,
      deviceModel,
      problemDescription,
      replacementPrinter,
    } = body

    // Формируем содержимое email
    const emailContent = `
Nowe zgłoszenie serwisowe:

Imię i nazwisko: ${name}
Numer telefonu: ${phone}
Adres e-mail: ${email}
Adres: ${address}
Typ urządzenia: ${deviceType === 'printer' ? 'Drukarka' : deviceType === 'computer' ? 'Komputer / Laptop' : 'Inne urządzenie'}
Model urządzenia: ${deviceModel || 'Nie podano'}
Opis problemu: ${problemDescription}
Potrzebuję drukarki zastępczej: ${replacementPrinter ? 'Tak' : 'Nie'}
    `.trim()

    // Если нет API ключа, просто логируем и возвращаем успех (для тестирования UI)
    if (!resend) {
      console.log('RESEND_API_KEY не установлен. Данные формы:', {
        name,
        phone,
        email,
        address,
        deviceType,
        deviceModel,
        problemDescription,
        replacementPrinter,
      })
      return NextResponse.json({ success: true, message: 'Form data logged (RESEND_API_KEY not set)' })
    }

    // Отправляем email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL || 'onboarding@resend.dev',
      subject: `Nowe zgłoszenie serwisowe od ${name}`,
      text: emailContent,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Nie udało się wysłać wiadomości' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości' },
      { status: 500 }
    )
  }
}
