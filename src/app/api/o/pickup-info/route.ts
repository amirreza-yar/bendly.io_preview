import { NextResponse } from 'next/server'

const PICKUP_DESC = 'Open: Mon-Fri, 9:00 AM - 6:00 PM'
const PICKUP_ADDRESS = {
  streetAddress: 'Warehouse A',
  suburb: 'Wattle Downs',
  state: 'SA',
  postcode: 5162,
}

export async function GET(req: Request) {
  try {
    return NextResponse.json({ pickupDesc: PICKUP_DESC, pickupAddr: PICKUP_ADDRESS })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
