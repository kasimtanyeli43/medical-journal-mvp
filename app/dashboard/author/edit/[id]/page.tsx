import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ArticleEditForm } from '@/components/ArticleEditForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
    const user = await requireRole(['AUTHOR'])

    const article = await prisma.article.findUnique({
        where: { id: params.id }
    })

    if (!article) {
        notFound()
    }

    // Authorization check
    if (article.authorId !== user.id) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
                <p className="text-gray-600">Bu makaleyi düzenleme yetkiniz yok.</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <Link
                    href="/dashboard/author"
                    className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Panele Dön
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Makaleyi Düzenle</h1>
                <p className="text-gray-600 mt-2">"{article.title}" makalesini güncelliyorsunuz.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <ArticleEditForm article={article} />
            </div>
        </div>
    )
}
