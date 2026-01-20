'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Download } from 'lucide-react'
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

export default function ReviewArticlePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        recommendation: '',
        comments: '',
        confidential: ''
    })

    useEffect(() => {
        fetchArticle()
    }, [params.id])

    async function fetchArticle() {
        try {
            const res = await fetch(`/api/articles/${params.id}`)
            if (res.ok) {
                const data = await res.json()
                setArticle(data.article)
            } else {
                setError('Makale yüklenemedi')
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
                            PDF İndir
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

            {/* Review Form */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Değerlendirme Formu</h3>

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
                            Bu notlar sadece editör tarafından görülecektir
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
        </div>
    )
}
