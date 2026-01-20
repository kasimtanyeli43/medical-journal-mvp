import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PublishedArticlesList } from './PublishedArticlesList'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
    const publishedArticles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: { author: true },
        orderBy: { publishedAt: 'desc' } // Newest first
    })

    // Serialize dates
    const serializedArticles = publishedArticles.map(article => ({
        ...article,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        publishedAt: article.publishedAt?.toISOString() || null,
        submittedAt: article.submittedAt.toISOString(),
        author: {
            ...article.author,
            createdAt: article.author.createdAt.toISOString(),
            updatedAt: article.author.updatedAt.toISOString()
        }
    }))

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-12">
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Anasayfaya Dön
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900">Yayınlanan Makaleler</h1>
                    <p className="text-gray-600 mt-2">Dergimizde yayınlanmış akademik makalelere göz atın</p>
                </div>

                <PublishedArticlesList articles={serializedArticles} />
            </div>
        </div>
    )
}
