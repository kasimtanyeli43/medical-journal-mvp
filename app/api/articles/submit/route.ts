import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth-options'
import { sendEmail, articleSubmittedEmail } from '@/lib/email'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { title, abstract, keywords, authors, pdfUrl, pdfKey } = body

        if (!title || !abstract || !keywords || !authors || !pdfUrl) {
            return NextResponse.json(
                { error: 'Lütfen tüm gerekli alanları doldurun' },
                { status: 400 }
            )
        }

        // Create article
        const article = await prisma.article.create({
            data: {
                title,
                abstract,
                keywords,
                authors,
                pdfUrl,
                pdfKey,
                authorId: session.user.id,
                status: 'SUBMITTED',
            },
        })

        // Send email notification
        const emailContent = articleSubmittedEmail(session.user.name || 'User', title)
        if (session.user.email) {
            await sendEmail({
                to: session.user.email,
                ...emailContent,
            })
        }

        return NextResponse.json({ success: true, article })
    } catch (error) {
        console.error('Article submission error:', error)
        return NextResponse.json(
            { error: 'Makale gönderimi sırasında bir hata oluştu' },
            { status: 500 }
        )
    }
}
