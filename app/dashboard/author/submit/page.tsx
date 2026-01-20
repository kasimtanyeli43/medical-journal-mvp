'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'

export default function SubmitArticlePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        keywords: '',
        authors: '',
    })
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Lütfen sadece PDF, DOC veya DOCX dosyası yükleyin')
                return
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('Dosya boyutu 10MB\'dan küçük olmalıdır')
                return
            }
            setFile(selectedFile)
            setError('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!file) {
            setError('Lütfen dosya yükleyin')
            return
        }

        setLoading(true)

        try {
            // Upload PDF first using FormData
            const uploadFormData = new FormData()
            uploadFormData.append('file', file)

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            })

            if (!uploadRes.ok) {
                throw new Error('Dosya yükleme başarısız')
            }

            const uploadData = await uploadRes.json()
            const pdfUrl = uploadData.url

            // Submit article data
            const res = await fetch('/api/articles/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    abstract: formData.abstract,
                    keywords: formData.keywords.split(',').map((k: string) => k.trim()),
                    authors: formData.authors.split(',').map((a: string) => a.trim()),
                    pdfUrl,
                    pdfKey: pdfUrl, // Using URL as key for now
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Makale gönderimi başarısız')
            }

            router.push('/dashboard/author')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu')
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Yeni Makale Gönder</h1>
                <p className="text-gray-600 mt-2">Makalenizin bilgilerini doldurun ve PDF dosyanızı yükleyin</p>
            </div>

            <div className="card max-w-3xl">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="label">
                            Makale Başlığı *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input-field"
                            required
                            placeholder="COVID-19 Pnömonisinde Yüksek Çözünürlüklü BT Bulguları"
                        />
                    </div>

                    <div>
                        <label htmlFor="authors" className="label">
                            Yazarlar * <span className="text-xs text-gray-500">(Virgülle ayırın)</span>
                        </label>
                        <input
                            id="authors"
                            type="text"
                            value={formData.authors}
                            onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                            className="input-field"
                            required
                            placeholder="Dr. Ahmet Yılmaz, Dr. Zeynep Arslan"
                        />
                    </div>

                    <div>
                        <label htmlFor="abstract" className="label">
                            Özet *
                        </label>
                        <textarea
                            id="abstract"
                            value={formData.abstract}
                            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                            className="input-field"
                            rows={6}
                            required
                            placeholder="Makalenizin özetini buraya yazın..."
                        />
                    </div>

                    <div>
                        <label htmlFor="keywords" className="label">
                            Anahtar Kelimeler * <span className="text-xs text-gray-500">(Virgülle ayırın)</span>
                        </label>
                        <input
                            id="keywords"
                            type="text"
                            value={formData.keywords}
                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            className="input-field"
                            required
                            placeholder="COVID-19, Pnömoni, HRCT, Radyoloji"
                        />
                    </div>

                    <div>
                        <label htmlFor="pdf" className="label">
                            Makale Dosyası * <span className="text-xs text-gray-500">(Maksimum 10MB)</span>
                        </label>
                        <div className="mt-1">
                            <label
                                htmlFor="pdf"
                                className="flex items-center justify-center w-full px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                            >
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    {file ? (
                                        <p className="text-sm text-gray-700">{file.name}</p>
                                    ) : (
                                        <p className="text-sm text-gray-600">Dosyanızı yüklemek için tıklayın (PDF, DOC, DOCX)</p>
                                    )}
                                </div>
                            </label>
                            <input
                                id="pdf"
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className="hidden"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? 'Gönderiliyor...' : 'Makale Gönder'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-outline"
                            disabled={loading}
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
