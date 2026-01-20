import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { sendEmail, userRejectedEmail } from '@/lib/email'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'EDITOR') {
            return NextResponse.json(
                { error: 'Unauthorized - Only editors can reject users' },
                { status: 401 }
            )
        }

        const { reason } = await request.json()

        const user = await prisma.user.findUnique({
            where: { id: params.id }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        if (user.approvalStatus === 'REJECTED') {
            return NextResponse.json(
                { error: 'User is already rejected' },
                { status: 400 }
            )
        }

        // Update user to REJECTED
        await prisma.user.update({
            where: { id: params.id },
            data: { approvalStatus: 'REJECTED' }
        })

        // Send rejection email to user
        if (user.email) {
            await sendEmail({
                to: user.email,
                ...userRejectedEmail(user, reason)
            })
        }

        return NextResponse.json({
            success: true,
            message: 'User rejected successfully'
        })
    } catch (error) {
        console.error('User rejection error:', error)
        return NextResponse.json(
            { error: 'Failed to reject user' },
            { status: 500 }
        )
    }
}
