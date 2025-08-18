import { NextResponse } from 'next/server'

function generateDates(startMillis: number, count: number): string[] {
  const start = new Date(startMillis)
  const dates: string[] = []

  for (let i = 0; i < count; i++) {
    const d = new Date(startMillis + i * 24 * 60 * 60 * 1000)
    dates.push(d.toISOString().split('T')[0])
  }

  return dates
}

const DELIVERY_DESC = 'Available from 2 business days'

export async function GET(req: Request) {
  try {
    return NextResponse.json({
      availableDates: generateDates(new Date().getTime(), 10),
      deliveryDesc: DELIVERY_DESC,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
