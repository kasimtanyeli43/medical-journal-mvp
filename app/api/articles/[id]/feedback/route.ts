import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'EDITOR') {
            return NextResponse.json(
                { error: 'Unauthorized - Only editors can send feedback' },
                { status: 401 }
            )
        }

        const { feedback } = await request.json()

        if (!feedback) {
            return NextResponse.json(
                { error: 'Feedback is required' },
                { status: 400 }
            )
        }

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

        // Update article with editor feedback
        const updateData: any = {
            editorFeedback: feedback
        }

        // If article is ACCEPTED, publish it
        if (article.status === 'ACCEPTED') {
            updateData.status = 'PUBLISHED'
            updateData.publishedAt = new Date()
        }

        await prisma.article.update({
            where: { id: params.id },
            data: updateData
        })

        // Send notification to author
        await prisma.notification.create({
            data: {
                userId: article.authorId,
                type: 'EDITOR_FEEDBACK',
                title: 'Editör Geri Bildirimi',
                message: `Makaleniz "${article.title}" için editör geri bildirimi: ${feedback}`,
                link: `/articles/${article.id}`
            }
        })

        // Send email to author
        await sendEmail({
            to: article.author.email,
            subject: `Editör Geri Bildirimi - ${article.title}`,
            html: `
                <h2>Editör Geri Bildirimi</h2>
                <p>Merhaba ${article.author.name},</p>
                <p>Makaleniz "<strong>${article.title}</strong>" için editör geri bildirimi aldınız:</p>
                <blockquote style="padding: 15px; background: #f5f5f5; border-left: 4px solid #3b82f6;">
                    ${feedback}
                </blockquote>
                ${article.status === 'ACCEPTED' ? '<p><strong>Makaleniz yayınlandı!</strong></p>' : ''}
                <p><a href="${process.env.NEXTAUTH_URL}/articles/${article.id}">Makaleyi Görüntüle</a></p>
            `
        })

        return NextResponse.json({
            success: true,
            published: article.status === 'ACCEPTED'
        })
    } catch (error) {
        console.error('Feedback error:', error)
        return NextResponse.json(
            { error: 'Failed to send feedback' },
            { status: 500 }
        )
    }
}
