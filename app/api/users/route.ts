import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'EDITOR') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')

        if (!role) {
            return NextResponse.json(
                { error: 'Role parameter is required' },
                { status: 400 }
            )
        }

        const users = await prisma.user.findMany({
            where: { role: role as any },
            select: {
                id: true,
                name: true,
                email: true,
                affiliation: true
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Get users error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}
