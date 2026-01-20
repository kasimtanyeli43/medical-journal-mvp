import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const article = await prisma.article.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        affiliation: true
                    }
                }
            }
        })

        if (!article) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            )
        }

        // Check permissions based on role
        const canView =
            session.user.role === 'EDITOR' ||
            session.user.role === 'ADMIN' ||
            article.authorId === session.user.id ||
            article.reviewerId === session.user.id ||
            article.status === 'PUBLISHED'

        if (!canView) {
            return NextResponse.json(
                { error: 'You do not have permission to view this article' },
                { status: 403 }
            )
        }

        return NextResponse.json({ article })
    } catch (error) {
        console.error('Get article error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch article' },
            { status: 500 }
        )
    }
}
