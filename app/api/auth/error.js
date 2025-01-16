import { NextResponse } from 'next/server'

export async function GET(request) {
  return NextResponse.json({ error: "Authentication error" }, { status: 500 })
}

