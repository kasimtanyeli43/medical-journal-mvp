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

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()

        // Find article
        const article = await prisma.article.findUnique({
            where: { id: params.id }
        })

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 })
        }

        // Only author can edit, and only if not PUBLISHED (or maybe allow edits if revision requested)
        // For MVP, allow edits if author
        if (article.authorId !== session.user.id) {
            return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
        }

        // Update article
        const updatedArticle = await prisma.article.update({
            where: { id: params.id },
            data: {
                title: data.title,
                abstract: data.abstract,
                keywords: data.keywords,
                pdfUrl: data.pdfUrl,
                // If status was REVISION_REQUESTED, maybe change back to SUBMITTED or UNDER_REVIEW?
                // For now, let's keep status as is or update if specifically requested
                status: data.status || article.status
            }
        })

        return NextResponse.json({ success: true, article: updatedArticle })
    } catch (error) {
        console.error('Update article error:', error)
        return NextResponse.json(
            { error: 'Failed to update article' },
            { status: 500 }
        )
    }
}
