import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { ArticleCard } from '@/components/ui/ArticleCard'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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
                <p className="text-gray-600 mt-2">Size atanan makaleleri bilimsel kriterlere göre değerlendirin</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Toplam Atama"
                    value={reviews.length}
                    icon={<FileText className="w-6 h-6" />}
                />
                <StatCard
                    title="Bekleyen"
                    value={pending.length}
                    icon={<Clock className="w-6 h-6" />}
                    iconBgColor="bg-yellow-50"
                    iconColor="text-yellow-600"
                    subtitle="Değerlendirme bekleniyor"
                />
                <StatCard
                    title="Tamamlanan"
                    value={completed.length}
                    icon={<CheckCircle className="w-6 h-6" />}
                    iconBgColor="bg-green-50"
                    iconColor="text-green-600"
                />
            </div>

            {/* Pending Reviews */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    Bekleyen Değerlendirmeler
                </h2>
                {pending.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pending.map((review) => (
                            <ArticleCard
                                key={review.id}
                                id={review.article.id}
                                title={review.article.title}
                                author={review.article.author.name || 'Unknown'}
                                date={review.createdAt.toISOString()}
                                status="PENDING"
                                category="Değerlendirme Bekliyor"
                                href={`/dashboard/reviewer/review/${review.id}`}
                                showStatus={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg p-8 text-center border border-gray-200 text-gray-500">
                        Bekleyen değerlendirmeniz bulunmuyor.
                    </div>
                )}
            </div>

            {/* Completed Reviews */}
            <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Tamamlanan Değerlendirmeler
                </h2>

                {completed.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Henüz tamamlanmış değerlendirme yok</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {completed.map((review) => (
                            <ArticleCard
                                key={review.id}
                                id={review.article.id}
                                title={review.article.title}
                                author={review.article.author.name || 'Unknown'}
                                date={review.submittedAt ? new Date(review.submittedAt).toISOString() : new Date().toISOString()}
                                status={review.recommendation || 'COMPLETED'}
                                category="Tamamlandı"
                                showStatus={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
