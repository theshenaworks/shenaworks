import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'

export async function GET() {
  const filePath = path.resolve(process.cwd(), 'public/downloads/shena-works-company-profile.pdf')

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Company profile not found.', { status: 404 })
  }

  const fileBuffer = fs.readFileSync(filePath)

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Shena-Works-Company-Profile.pdf"',
      'Content-Length': String(fileBuffer.length),
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
