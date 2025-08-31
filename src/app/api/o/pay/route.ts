import { generateRandomId } from '@/lib/db/helpers/utils'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { orderId, payVia }: { orderId: string; payVia: string } = await req.json()

    return NextResponse.json(
      {
        transactionId: 'pi_3NXY789012345678',
        via: payVia,
        date: new Date().getTime(),
        id: generateRandomId({ length: 6 }),
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
