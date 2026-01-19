import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

function getStatusBadge(status: string) {
    const badges = {
        SUBMITTED: 'badge badge-submitted',
        UNDER_REVIEW: 'badge badge-under-review',
        ACCEPTED: 'badge badge-accepted',
        REJECTED: 'badge badge-rejected',
        PUBLISHED: 'badge badge-published',
        REVISION_REQUESTED: 'badge badge-revision',
    }
    return badges[status as keyof typeof badges] || 'badge'
}

function getStatusText(status: string) {
    const texts = {
        SUBMITTED: 'Gönderildi',
        UNDER_REVIEW: 'İnceleniyor',
        ACCEPTED: 'Kabul Edildi',
        REJECTED: 'Reddedildi',
        PUBLISHED: 'Yayınlandı',
        REVISION_REQUESTED: 'Revizyon İstendi',
    }
    return texts[status as keyof typeof texts] || status
}

export default async function AuthorDashboard() {
    const user = await requireRole(['AUTHOR'])

    const articles = await prisma.article.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: 'desc' },
    })

    const stats = {
        total: articles.length,
        underReview: articles.filter((a) => a.status === 'UNDER_REVIEW').length,
        accepted: articles.filter((a) => a.status === 'ACCEPTED' || a.status === 'PUBLISHED').length,
        rejected: articles.filter((a) => a.status === 'REJECTED').length,
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz, {user.name}</h1>
                <p className="text-gray-600 mt-2">Makalelerinizi yönetin ve yeni makale gönderin</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-sm text-gray-600">Toplam Makale</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.underReview}</p>
                            <p className="text-sm text-gray-600">İnceleniyor</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.accepted}</p>
                            <p className="text-sm text-gray-600">Kabul Edildi</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.rejected}</p>
                            <p className="text-sm text-gray-600">Reddedildi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Articles List */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Makalelerim</h2>
                    <Link href="/dashboard/author/submit" className="btn-primary">
                        Yeni Makale Gönder
                    </Link>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Henüz makale göndermediniz</p>
                        <Link href="/dashboard/author/submit" className="btn-primary">
                            İlk Makalenizi Gönderin
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.abstract}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Gönderim: {new Date(article.submittedAt).toLocaleDateString('tr-TR')}</span>
                                            {article.keywords.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    {article.keywords.slice(0, 3).map((keyword, i) => (
                                                        <span key={i} className="bg-gray-100 px-2 py-0.5 rounded">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <span className={getStatusBadge(article.status)}>
                                            {getStatusText(article.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
