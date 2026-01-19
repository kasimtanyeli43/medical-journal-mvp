import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Search, Download } from 'lucide-react'

export default async function ArticlesPage() {
    const articles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: { issue: true },
        orderBy: { publishedAt: 'desc' },
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold text-gray-900">
                            Tıp Dergisi
                        </Link>
                        <div className="flex gap-4">
                            <Link href="/articles" className="text-gray-700">
                                Makaleler
                            </Link>
                            <Link href="/login" className="btn-primary">
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-custom py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Yayınlanan Makaleler</h1>
                    <p className="text-gray-600">
                        Tıp dergimizde yayınlanan son makaleleri inceleyin ve PDF olarak indirin.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Makale ara (başlık, anahtar kelime, yazar...)"
                            className="input-field pl-10"
                        />
                    </div>
                </div>

                {/* Articles Grid */}
                {articles.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-600">Henüz yayınlanmış makale bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {articles.map((article) => (
                            <div key={article.id} className="card hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h2>

                                        <p className="text-sm text-gray-600 mb-4">
                                            {article.authors.join(', ')}
                                        </p>

                                        <p className="text-gray-700 mb-4 line-clamp-3">{article.abstract}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {article.keywords.map((keyword, i) => (
                                                <span key={i} className="badge bg-blue-100 text-blue-800">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            {article.issue && (
                                                <span>
                                                    Cilt {article.issue.volume}, Sayı {article.issue.number} ({article.issue.year})
                                                </span>
                                            )}
                                            {article.publishedAt && (
                                                <span>
                                                    Yayın: {new Date(article.publishedAt).toLocaleDateString('tr-TR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={`/articles/${article.id}`}
                                            className="btn-primary whitespace-nowrap"
                                        >
                                            Detay
                                        </Link>
                                        {article.pdfUrl && (
                                            <a
                                                href={article.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-outline flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <Download className="w-4 h-4" />
                                                PDF İndir
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 border-t mt-20">
                <div className="container-custom py-8">
                    <p className="text-center text-gray-600">© 2024 Tıp Dergisi. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </div>
    )
}
