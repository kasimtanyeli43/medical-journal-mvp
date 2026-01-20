import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { sendEmail, userApprovedEmail } from '@/lib/email'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'EDITOR') {
            return NextResponse.json(
                { error: 'Unauthorized - Only editors can approve users' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: params.id }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        if (user.approvalStatus === 'APPROVED') {
            return NextResponse.json(
                { error: 'User is already approved' },
                { status: 400 }
            )
        }

        // Update user to APPROVED
        await prisma.user.update({
            where: { id: params.id },
            data: { approvalStatus: 'APPROVED' }
        })

        // Send approval email to user
        if (user.email) {
            await sendEmail({
                to: user.email,
                ...userApprovedEmail(user)
            })
        }

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId: user.id,
                type: 'USER_APPROVED',
                title: 'Hesabınız Onaylandı',
                message: 'Artık sisteme giriş yapabilirsiniz.',
                link: '/login'
            }
        })

        return NextResponse.json({
            success: true,
            message: 'User approved successfully'
        })
    } catch (error) {
        console.error('User approval error:', error)
        return NextResponse.json(
            { error: 'Failed to approve user' },
            { status: 500 }
        )
    }
}
