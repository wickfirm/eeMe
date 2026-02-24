import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'https://apis.eeme.io/api'
const API_HOST = process.env.API_HOST || 'eeme.io'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${API_URL}/subscribe/newsletter?host=${API_HOST}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
