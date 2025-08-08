import { NextRequest, NextResponse } from 'next/server'
import { executeGraphQL, buildExecutableSchema } from '@/lib/fakeBackend/engine'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const { query, variables } = await req.json()
    const result = await executeGraphQL(query, variables)
    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ errors: [{ message: error.message }] }, { status: 400 })
  }
}
