import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { sendEmail, reviewerAssignedEmail } from '@/lib/email'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'EDITOR') {
            return NextResponse.json(
                { error: 'Unauthorized - Only editors can assign reviewers' },
                { status: 401 }
            )
        }

        const { reviewerId } = await request.json()

        if (!reviewerId) {
            return NextResponse.json(
                { error: 'Reviewer ID is required' },
                { status: 400 }
            )
        }

        // Get article and reviewer details
        const article = await prisma.article.findUnique({
            where: { id: params.id },
            include: { author: true }
        })

        if (!article) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            )
        }

        const reviewer = await prisma.user.findUnique({
            where: { id: reviewerId }
        })

        if (!reviewer || reviewer.role !== 'REVIEWER') {
            return NextResponse.json(
                { error: 'Invalid reviewer' },
                { status: 400 }
            )
        }

        // Use transaction to ensure data integrity
        await prisma.$transaction(async (tx) => {
            // 1. Create a pending review record
            const review = await tx.review.create({
                data: {
                    articleId: article.id,
                    reviewerId: reviewerId,
                    status: 'PENDING'
                }
            })

            // 2. Update article with reviewer and change status
            await tx.article.update({
                where: { id: params.id },
                data: {
                    reviewerId,
                    status: 'UNDER_REVIEW'
                }
            })

            // 3. Create notification for reviewer
            await tx.notification.create({
                data: {
                    userId: reviewerId,
                    type: 'ARTICLE_ASSIGNED',
                    title: 'Yeni Makale Atandı',
                    message: `"${article.title}" makalesi incelemeniz için atandı.`,
                    articleId: article.id,
                    link: `/dashboard/reviewer/review/${article.id}` // Correct Link using Article ID as per previous fix
                }
            })
        })

        // Send email (outside transaction)
        if (reviewer.email) {
            await sendEmail({
                to: reviewer.email,
                ...reviewerAssignedEmail({
                    reviewer,
                    article,
                    author: article.author
                })
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Reviewer assigned successfully'
        })
    } catch (error) {
        console.error('Reviewer assignment error:', error)
        return NextResponse.json(
            { error: 'Failed to assign reviewer' },
            { status: 500 }
        )
    }
}
