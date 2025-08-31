import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    console.log(email)

    await new Promise((resolve) => setTimeout(resolve, 5000))

    return NextResponse.json({ email }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
