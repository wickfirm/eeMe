import { NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'https://apis.eeme.io/api'
const API_HOST = process.env.API_HOST || 'eeme.io'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await fetch(`${API_URL}/order?host=${API_HOST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || 'Order failed' },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
