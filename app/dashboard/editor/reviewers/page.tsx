import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Users, Mail, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReviewersPage() {
    await requireRole(['EDITOR'])

    const reviewers = await prisma.user.findMany({
        where: { role: 'REVIEWER' },
        include: {
            reviews: {
                include: {
                    article: true
                }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Hakemler</h1>
                <p className="text-gray-600 mt-2">Tüm hakemlerin listesi ve değerlendirme durumları</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewers.map((reviewer) => {
                    const totalReviews = reviewer.reviews.length
                    const completedReviews = reviewer.reviews.filter(r => r.status === 'COMPLETED').length
                    const pendingReviews = reviewer.reviews.filter(r => r.status === 'PENDING').length

                    return (
                        <div key={reviewer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{reviewer.name}</h3>
                                    <p className="text-sm text-gray-500">{reviewer.affiliation || 'Bağımsız'}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{reviewer.email}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
                                    <p className="text-xs text-gray-500">Toplam</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-yellow-600">{pendingReviews}</p>
                                    <p className="text-xs text-gray-500">Bekleyen</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{completedReviews}</p>
                                    <p className="text-xs text-gray-500">Tamamlandı</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {reviewers.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz hakem bulunmuyor</h3>
                    <p className="text-gray-500">Sistemde kayıtlı hakem bulunmamaktadır.</p>
                </div>
            )}
        </div>
    )
}
