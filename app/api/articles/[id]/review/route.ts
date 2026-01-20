import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { sendEmail, reviewSubmittedEmail } from '@/lib/email'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'REVIEWER') {
            return NextResponse.json(
                { error: 'Unauthorized - Only reviewers can submit reviews' },
                { status: 401 }
            )
        }

        const { recommendation, comments, confidential } = await request.json()

        if (!recommendation || !comments) {
            return NextResponse.json(
                { error: 'Recommendation and comments are required' },
                { status: 400 }
            )
        }

        // Get article
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

        // Check if reviewer is assigned to this article
        if (article.reviewerId !== session.user.id) {
            return NextResponse.json(
                { error: 'You are not assigned to review this article' },
                { status: 403 }
            )
        }

        // Check if review already exists
        const existingReview = await prisma.review.findFirst({
            where: {
                articleId: params.id,
                reviewerId: session.user.id
            }
        })

        if (existingReview) {
            // Update existing review
            await prisma.review.update({
                where: { id: existingReview.id },
                data: {
                    recommendation,
                    comments,
                    confidential: confidential || null,
                    status: 'COMPLETED',
                    submittedAt: new Date()
                }
            })
        } else {
            // Create new review
            await prisma.review.create({
                data: {
                    articleId: params.id,
                    reviewerId: session.user.id,
                    recommendation,
                    comments,
                    confidential: confidential || null,
                    status: 'COMPLETED',
                    submittedAt: new Date()
                }
            })
        }

        // Map reviewer recommendation to article status
        let newArticleStatus: 'ACCEPTED' | 'REJECTED' | 'REVISION_REQUESTED' | 'UNDER_REVIEW' = 'UNDER_REVIEW'

        if (recommendation === 'ACCEPT') {
            newArticleStatus = 'ACCEPTED'
        } else if (recommendation === 'REJECT') {
            newArticleStatus = 'REJECTED'
        } else if (recommendation === 'MAJOR_REVISION' || recommendation === 'MINOR_REVISION') {
            newArticleStatus = 'REVISION_REQUESTED'
        }

        // Update article status based on reviewer decision
        await prisma.article.update({
            where: { id: params.id },
            data: {
                status: newArticleStatus
            }
        })

        // Create notification for editor(s)
        const editors = await prisma.user.findMany({
            where: { role: 'EDITOR' }
        })

        for (const editor of editors) {
            // Create notification
            await prisma.notification.create({
                data: {
                    userId: editor.id,
                    type: 'REVIEW_SUBMITTED',
                    title: 'Hakem Görüşü Alındı',
                    message: `"${article.title}" makalesi için hakem görüşü gönderildi.`,
                    articleId: article.id,
                    link: `/dashboard/editor/article/${article.id}`
                }
            })

            // Send email
            if (editor.email) {
                await sendEmail({
                    to: editor.email,
                    ...reviewSubmittedEmail({
                        editor,
                        article,
                        reviewer: session.user,
                        recommendation
                    })
                })
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully'
        })
    } catch (error) {
        console.error('Review submission error:', error)
        return NextResponse.json(
            { error: 'Failed to submit review' },
            { status: 500 }
        )
    }
}

// GET - Get current user's review for this article
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'REVIEWER') {
            return NextResponse.json(
                { error: 'Unauthorized - Only reviewers can access reviews' },
                { status: 401 }
            )
        }

        // Find the review for this article by this reviewer
        const review = await prisma.review.findFirst({
            where: {
                articleId: params.id,
                reviewerId: session.user.id
            }
        })

        return NextResponse.json({ review }, { status: 200 })
    } catch (error: any) {
        console.error('Error fetching review:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
