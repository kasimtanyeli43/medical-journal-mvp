import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
    const publishedArticles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: { author: true },
        orderBy: { publishedAt: 'desc' }
    })

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

                {publishedArticles.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <p className="text-gray-500">Henüz yayınlanmış makale bulunmamaktadır.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publishedArticles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.id}`}
                                className="article-card group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="badge badge-category">{article.keywords[0] || 'Genel'}</span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                        Yayınlandı
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                    {article.title}
                                </h3>

                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {article.abstract}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                                    <span>{article.author.name}</span>
                                    <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
