'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Article {
    id: string
    title: string
    abstract: string
    keywords: string[]
    pdfUrl: string | null
    author: {
        name: string
        email: string
        affiliation: string | null
    }
}

interface Review {
    id: string
    status: 'PENDING' | 'COMPLETED'
    recommendation: string | null
    comments: string | null
    confidentialComments: string | null
    submittedAt: Date | null
}

export default function ReviewArticlePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [article, setArticle] = useState<Article | null>(null)
    const [review, setReview] = useState<Review | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        recommendation: '',
        comments: '',
        confidential: ''
    })

    useEffect(() => {
        fetchData()
    }, [params.id])

    async function fetchData() {
        try {
            // Fetch article
            const articleRes = await fetch(`/api/articles/${params.id}`)
            if (articleRes.ok) {
                const articleData = await articleRes.json()
                setArticle(articleData.article)
            } else {
                setError('Makale yüklenemedi')
                setLoading(false)
                return
            }

            // Fetch review
            const reviewRes = await fetch(`/api/articles/${params.id}/review`)
            if (reviewRes.ok) {
                const reviewData = await reviewRes.json()
                setReview(reviewData.review)

                // If review is pending, show form immediately
                if (!reviewData.review || reviewData.review.status === 'PENDING') {
                    setShowForm(true)
                }
            }
        } catch (err) {
            setError('Bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!formData.recommendation) {
            setError('Lütfen bir öneri seçin')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const res = await fetch(`/api/articles/${params.id}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Görüş gönderilemedi')
            }

            router.push('/dashboard/reviewer')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">Yükleniyor...</div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Makale bulunamadı'}</p>
                <Link href="/dashboard/reviewer" className="btn-outline mt-4">
                    Geri Dön
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/dashboard/reviewer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Geri Dön
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">Makale İnceleme</h1>

            {/* Article Details */}
            <div className="card mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{article.title}</h2>
                            <p className="text-sm text-gray-600">
                                {article.author.name} • {article.author.affiliation || 'Bağımsız Araştırmacı'}
                            </p>
                        </div>
                    </div>
                    {article.pdfUrl && (
                        <a
                            href={article.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Makaleyi İndir
                        </a>
                    )}
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Özet</h3>
                    <p className="text-gray-700 leading-relaxed">{article.abstract}</p>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Anahtar Kelimeler</h3>
                    <div className="flex flex-wrap gap-2">
                        {article.keywords.map((keyword, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Completed Review Results */}
            {review && review.status === 'COMPLETED' && !showForm && (
                <div className="card mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">Değerlendirme Sonuçlarınız</h3>
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-outline flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Yeniden Değerlendir
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Recommendation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Öneriniz
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${review.recommendation === 'ACCEPT' ? 'bg-green-100 text-green-800' :
                                        review.recommendation === 'MINOR_REVISION' ? 'bg-yellow-100 text-yellow-800' :
                                            review.recommendation === 'MAJOR_REVISION' ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'
                                    }`}>
                                    {review.recommendation === 'ACCEPT' ? 'Kabul Et' :
                                        review.recommendation === 'MINOR_REVISION' ? 'Küçük Revizyonla Kabul' :
                                            review.recommendation === 'MAJOR_REVISION' ? 'Büyük Revizyon Gerekli' :
                                                'Reddet'}
                                </span>
                            </div>
                        </div>

                        {/* Public Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yazara İletilen Görüşler
                            </label>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap">{review.comments || 'Yorum eklenmemiş'}</p>
                            </div>
                        </div>

                        {/* Confidential Comments */}
                        {review.confidentialComments && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Editöre Özel Notlar
                                </label>
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-gray-700 whitespace-pre-wrap">{review.confidentialComments}</p>
                                </div>
                            </div>
                        )}

                        {/* Submission Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gönderim Tarihi
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-700">
                                    {review.submittedAt ? new Date(review.submittedAt).toLocaleString('tr-TR') : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Form */}
            {showForm && (
                <div className="card">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            {review?.status === 'COMPLETED' ? 'Yeniden Değerlendirme' : 'Değerlendirme Formu'}
                        </h3>
                        {review?.status === 'COMPLETED' && (
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                İptal
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Recommendation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Öneriniz <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.recommendation}
                                onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                                className="input"
                                required
                            >
                                <option value="">Seçiniz</option>
                                <option value="ACCEPT">Kabul Et</option>
                                <option value="MINOR_REVISION">Küçük Revizyonla Kabul</option>
                                <option value="MAJOR_REVISION">Büyük Revizyon Gerekli</option>
                                <option value="REJECT">Reddet</option>
                            </select>
                        </div>

                        {/* Public Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yazara İletilecek Görüşler <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.comments}
                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                rows={6}
                                className="input"
                                placeholder="Makalenin güçlü ve zayıf yönlerini, iyileştirme önerilerinizi belirtin..."
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Bu görüşler yazar ile paylaşılacaktır
                            </p>
                        </div>

                        {/* Confidential Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Editöre Özel Notlar (Opsiyonel)
                            </label>
                            <textarea
                                value={formData.confidential}
                                onChange={(e) => setFormData({ ...formData, confidential: e.target.value })}
                                rows={4}
                                className="input"
                                placeholder="Sadece editör ile paylaşmak istediğiniz görüşler..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Bu notlar sadece editör tarafından görülecektır
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 border-t">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary flex-1"
                            >
                                {submitting ? 'Gönderiliyor...' : 'Görüşü Gönder'}
                            </button>
                            <Link
                                href="/dashboard/reviewer"
                                className="btn-outline flex-1 text-center"
                            >
                                İptal
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
