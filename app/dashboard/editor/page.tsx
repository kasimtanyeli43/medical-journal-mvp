import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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

export default async function EditorDashboard() {
    await requireRole(['EDITOR'])

    const articles = await prisma.article.findMany({
        include: {
            author: true,
            reviews: true,
        },
        orderBy: { submittedAt: 'desc' },
    })

    const stats = {
        total: articles.length,
        submitted: articles.filter((a) => a.status === 'SUBMITTED').length,
        underReview: articles.filter((a) => a.status === 'UNDER_REVIEW').length,
        needsDecision: articles.filter(
            (a) => a.status === 'UNDER_REVIEW' && a.reviews.some((r) => r.status === 'COMPLETED')
        ).length,
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Editör Paneli</h1>
                <p className="text-gray-600 mt-2">Tüm makaleleri yönetin ve hakem atayın</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-gray-600">Toplam Makale</p>
                </div>
                <div className="card">
                    <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
                    <p className="text-sm text-gray-600">Yeni Gönderimler</p>
                </div>
                <div className="card">
                    <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
                    <p className="text-sm text-gray-600">Değerlendirmede</p>
                </div>
                <div className="card">
                    <p className="text-2xl font-bold text-orange-600">{stats.needsDecision}</p>
                    <p className="text-sm text-gray-600">Karar Bekliyor</p>
                </div>
            </div>

            {/* Articles Table */}
            <div className="card">
                <h2 className="text-xl font-bold mb-6">Tüm Makaleler</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazar</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hakemler</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-gray-900 max-w-md truncate">{article.title}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{article.author.name}</td>
                                    <td className="px-4 py-4">
                                        <span className={getStatusBadge(article.status)}>
                                            {getStatusText(article.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">
                                        {article.reviews.length} / {article.reviews.filter((r) => r.status === 'COMPLETED').length} tamamlandı
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">
                                        {new Date(article.submittedAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Link
                                            href={`/dashboard/editor/article/${article.id}`}
                                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                        >
                                            Detay
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
