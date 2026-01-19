import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { ArticleCard } from '@/components/ui/ArticleCard'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz, {user.name}</h1>
                    <p className="text-gray-500 mt-2">Makalelerinizin durumunu takip edin ve yönetin</p>
                </div>
                <Link href="/dashboard/author/submit" className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-200">
                    <Plus className="w-4 h-4" />
                    Yeni Makale
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Toplam Makale"
                    value={stats.total}
                    subtitle="Tüm zamanlar"
                    icon={<FileText className="w-6 h-6" />}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="İnceleniyor"
                    value={stats.underReview}
                    subtitle="Aktif süreçte"
                    icon={<Clock className="w-6 h-6" />}
                    iconBgColor="bg-yellow-50"
                    iconColor="text-yellow-600"
                />
                <StatCard
                    title="Kabul Edildi"
                    value={stats.accepted}
                    subtitle="Yayına hazır/yayınlandı"
                    icon={<CheckCircle className="w-6 h-6" />}
                    iconBgColor="bg-green-50"
                    iconColor="text-green-600"
                    trend={{ value: 100, isPositive: true, label: "başarı oranı" }}
                />
                <StatCard
                    title="Reddedildi"
                    value={stats.rejected}
                    subtitle="Revizyon gerekebilir"
                    icon={<XCircle className="w-6 h-6" />}
                    iconBgColor="bg-red-50"
                    iconColor="text-red-600"
                />
            </div>

            {/* Articles List */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Son Makaleler</h2>
                    <Link href="#" className="text-sm text-blue-600 font-medium hover:text-blue-700">Tümünü Gör</Link>
                </div>

                {articles.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz makale göndermediniz</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">Akademik çalışmalarınızı paylaşmak için ilk adımınızı atın.</p>
                        <Link href="/dashboard/author/submit" className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Makale Gönder
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                abstract={article.abstract}
                                author={user.name || 'Ben'}
                                date={article.submittedAt.toISOString()}
                                status={article.status}
                                category={article.keywords[0] || 'Genel Tıp'}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
