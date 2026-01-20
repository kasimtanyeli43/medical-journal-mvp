import { notFound } from 'next/navigation'
import { EditorFeedbackForm } from '@/components/EditorFeedbackForm'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, Download, User, Calendar, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

function getStatusText(status: string) {
    const texts: Record<string, string> = {
        SUBMITTED: 'Gönderildi',
        UNDER_REVIEW: 'İnceleniyor',
        ACCEPTED: 'Kabul Edildi',
        REJECTED: 'Reddedildi',
        PUBLISHED: 'Yayınlandı',
        REVISION_REQUESTED: 'Revizyon İstendi',
    }
    return texts[status] || status
}

function getRecommendationText(recommendation: string) {
    const texts: Record<string, string> = {
        ACCEPT: 'Kabul Et',
        REJECT: 'Reddet',
        MAJOR_REVISION: 'Büyük Revizyon',
        MINOR_REVISION: 'Küçük Revizyon',
    }
    return texts[recommendation] || recommendation
}

export default async function EditorArticleDetailPage({ params }: { params: { id: string } }) {
    await requireRole(['EDITOR'])

    const article = await prisma.article.findUnique({
        where: { id: params.id },
        include: {
            author: true,
            reviewer: true,
            reviews: {
                include: {
                    reviewer: true
                }
            }
        }
    })

    if (!article) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Link
                href="/dashboard/editor"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Editör Paneline Dön
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                {/* Article Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${article.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                            article.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                                article.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                    article.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                            }`}>
                            {getStatusText(article.status)}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Yazar</p>
                            <p className="font-medium">{article.author.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Gönderim Tarihi</p>
                            <p className="font-medium">{new Date(article.submittedAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                    </div>
                </div>

                {/* Abstract */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Özet</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{article.abstract}</p>
                </div>

                {/* Keywords */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Anahtar Kelimeler</h2>
                    <div className="flex flex-wrap gap-2">
                        {article.keywords.map((keyword, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>

                {/* PDF */}
                {article.pdfUrl && (
                    <div className="mb-6">
                        <a
                            href={article.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            PDF İndir
                        </a>
                    </div>
                )}

                {/* Reviews */}
                {article.reviews.length > 0 && (
                    <div className="mt-8 pt-8 border-t">
                        <h2 className="text-xl font-bold mb-4">Hakem Değerlendirmeleri</h2>
                        {article.reviews.map((review) => (
                            <div key={review.id} className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium">{review.reviewer.name}</p>
                                    <span className={`px-2 py-1 rounded text-xs ${review.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {review.status === 'COMPLETED' ? 'Tamamlandı' : 'Bekliyor'}
                                    </span>
                                </div>
                                {review.recommendation && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong>Öneri:</strong> {getRecommendationText(review.recommendation)}
                                    </p>
                                )}
                                {review.comments && (
                                    <p className="text-sm text-gray-700">{review.comments}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Editor Feedback Form */}
                {(article.status === 'ACCEPTED' || article.status === 'REVISION_REQUESTED') && (
                    <div className="mt-8 pt-8 border-t">
                        <EditorFeedbackForm articleId={article.id} />
                    </div>
                )}
            </div>
        </div>
    )
}
