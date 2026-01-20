import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'EDITOR') {
            return NextResponse.json(
                { error: 'Unauthorized - Only editors can delete users' },
                { status: 401 }
            )
        }

        // Prevent deleting yourself
        if (session.user.id === params.id) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            )
        }

        // Check if user has articles or reviews
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                articles: true,
                reviews: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Delete user (cascade will handle related records based on schema)
        await prisma.user.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.error('User deletion error:', error)
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}
