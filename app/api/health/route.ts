import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`

        return NextResponse.json(
            { status: 'healthy', message: 'All systems operational' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Health check failed:', error)
        return NextResponse.json(
            { status: 'unhealthy', message: 'System check failed' },
            { status: 503 }
        )
    }
}