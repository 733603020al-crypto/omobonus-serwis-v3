import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendFrom = process.env.RESEND_FROM_EMAIL || 'Omobonus Formularz <no-reply@resend.dev>'
const resendTo = process.env.RESEND_TO_EMAIL || 'omobonus.pl@gmail.com'

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Brak RESEND_API_KEY' }, { status: 500 })
  }

  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from: resendFrom,
      to: resendTo,
      subject: 'Test z /api/send-email-test',
      text: 'To tylko test wysyłki Resend.',
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Nie udało się wysłać testowego e-maila' }, { status: 500 })
  }
}

