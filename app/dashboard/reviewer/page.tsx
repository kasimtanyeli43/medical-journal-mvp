import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function getStatusBadge(status: string) {
    const badges = {
        PENDING: 'badge bg-yellow-100 text-yellow-800',
        COMPLETED: 'badge bg-green-100 text-green-800',
    }
    return badges[status as keyof typeof badges] || 'badge'
}

export default async function ReviewerDashboard() {
    const user = await requireRole(['REVIEWER'])

    const reviews = await prisma.review.findMany({
        where: { reviewerId: user.id },
        include: {
            article: {
                include: {
                    author: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    const pending = reviews.filter((r) => r.status === 'PENDING')
    const completed = reviews.filter((r) => r.status === 'COMPLETED')

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Hakem Paneli</h1>
                <p className="text-gray-600 mt-2">Size atanan makaleleri değerlendirin</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <p className="text-2xl font-bold">{reviews.length}</p>
                    <p className="text-sm text-gray-600">Toplam Atama</p>
                </div>
                <div className="card">
                    <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
                    <p className="text-sm text-gray-600">Bekleyen</p>
                </div>
                <div className="card">
                    <p className="text-2xl font-bold text-green-600">{completed.length}</p>
                    <p className="text-sm text-gray-600">Tamamlanan</p>
                </div>
            </div>

            {/* Pending Reviews */}
            {pending.length > 0 && (
                <div className="card mb-6">
                    <h2 className="text-xl font-bold mb-6">Bekleyen Değerlendirmeler</h2>
                    <div className="space-y-4">
                        {pending.map((review) => (
                            <div
                                key={review.id}
                                className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">{review.article.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Yazar: {review.article.author.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Atanma: {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/dashboard/reviewer/review/${review.id}`}
                                        className="btn-primary ml-4"
                                    >
                                        İncele & Değerlendir
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Reviews */}
            <div className="card">
                <h2 className="text-xl font-bold mb-6">Tamamlanan Değerlendirmeler</h2>

                {completed.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Henüz tamamlanmış değerlendirme yok</p>
                ) : (
                    <div className="space-y-4">
                        {completed.map((review) => (
                            <div
                                key={review.id}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">{review.article.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Yazar: {review.article.author.name}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Tamamlanma: {review.submittedAt ? new Date(review.submittedAt).toLocaleDateString('tr-TR') : 'N/A'}</span>
                                            <span className="badge bg-gray-100 text-gray-800">
                                                {review.recommendation === 'ACCEPT'
                                                    ? 'Kabul'
                                                    : review.recommendation === 'REJECT'
                                                        ? 'Red'
                                                        : review.recommendation === 'MAJOR_REVISION'
                                                            ? 'Büyük Revizyon'
                                                            : 'Küçük Revizyon'}
                                            </span>
                                        </div>
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
