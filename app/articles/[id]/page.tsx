import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Calendar, User, Tag } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    const article = await prisma.article.findUnique({
        where: { id: params.id },
        include: {
            author: true,
            issue: true,
        }
    })

    if (!article) {
        notFound()
    }

    // Access Control
    const isPublished = article.status === 'PUBLISHED'
    const isAuthor = session?.user?.id === article.authorId
    const isEditor = session?.user?.role === 'EDITOR'
    const isReviewer = session?.user?.role === 'REVIEWER' && article.reviewerId === session?.user?.id

    // If not published, only authorized users can view
    if (!isPublished) {
        if (!session || (!isAuthor && !isEditor && !isReviewer)) {
            return (
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h1>
                    <p className="text-gray-600 mb-8">Bu makaleyi görüntüleme yetkiniz yok.</p>
                    <Link href="/" className="text-blue-600 hover:underline">Ana Sayfaya Dön</Link>
                </div>
            )
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Link
                        href={isAuthor ? "/dashboard/author" : isEditor ? "/dashboard/editor" : "/articles"}
                        className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Geri Dön
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {article.status.replace('_', ' ')}
                        </span>
                        {article.issue && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                Cilt {article.issue.volume}, Sayı {article.issue.number}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{article.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span>{new Date(article.submittedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Özet</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {article.abstract}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-gray-400" />
                                Anahtar Kelimeler
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {article.keywords.map((keyword, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-8">
                            <h3 className="font-bold text-gray-900 mb-4">İşlemler</h3>

                            {article.pdfUrl ? (
                                <a
                                    href={article.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full btn-primary flex items-center justify-center gap-2 mb-3"
                                >
                                    <Download className="w-4 h-4" />
                                    PDF İndir
                                </a>
                            ) : (
                                <div className="text-sm text-gray-500 mb-3 text-center p-3 bg-gray-50 rounded">
                                    PDF mevcut değil
                                </div>
                            )}

                            {isAuthor && article.status !== 'PUBLISHED' && (
                                <Link
                                    href={`/dashboard/author/edit/${article.id}`}
                                    className="w-full btn-secondary flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Düzenle
                                </Link>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Bilgiler</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Gönderim Tarihi</span>
                                    <span className="font-medium text-gray-900">{new Date(article.submittedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Durum</span>
                                    <span className="font-medium text-gray-900">{article.status}</span>
                                </div>
                                {article.reviewer && (isEditor || isAuthor) && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Hakem</span>
                                        <span className="font-medium text-gray-900">Atandı</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
