'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, FileText, Loader2, Save } from 'lucide-react'

const articleSchema = z.object({
    title: z.string().min(5, 'Başlık en az 5 karakter olmalıdır'),
    abstract: z.string().min(20, 'Özet en az 20 karakter olmalıdır'),
    keywords: z.string().min(2, 'En az 1 anahtar kelime giriniz'),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleEditFormProps {
    article: {
        id: string
        title: string
        abstract: string
        keywords: string[]
        pdfUrl: string | null
    }
}

export function ArticleEditForm({ article }: ArticleEditFormProps) {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(article.pdfUrl)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: article.title,
            abstract: article.abstract,
            keywords: article.keywords.join(', '),
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (selectedFile.type !== 'application/pdf') {
                setUploadError('Lütfen sadece PDF dosyası yükleyiniz')
                setFile(null)
                return
            }
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
                setUploadError('Dosya boyutu 10MB\'dan küçük olmalıdır')
                setFile(null)
                return
            }
            setUploadError(null)
            setFile(selectedFile)
        }
    }

    const onSubmit = async (data: ArticleFormData) => {
        try {
            setIsUploading(true)
            let finalPdfUrl = currentPdfUrl

            // 1. If new file selected, upload it
            if (file) {
                const formData = new FormData()
                formData.append('file', file)

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!uploadRes.ok) throw new Error('Dosya yüklenemedi')
                const uploadData = await uploadRes.json()
                finalPdfUrl = uploadData.url

                // 2. If upload successful and there was an old file, delete it
                if (currentPdfUrl && currentPdfUrl !== finalPdfUrl) {
                    try {
                        await fetch('/api/upload/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: currentPdfUrl }),
                        })
                    } catch (err) {
                        console.error('Failed to delete old file:', err)
                        // Don't block update if delete fails
                    }
                }
            }

            // 3. Update Article
            const updateRes = await fetch(`/api/articles/${article.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: data.title,
                    abstract: data.abstract,
                    keywords: data.keywords.split(',').map(k => k.trim()).filter(k => k),
                    pdfUrl: finalPdfUrl,
                }),
            })

            if (!updateRes.ok) throw new Error('Makale güncellenemedi')

            router.push('/dashboard/author')
            router.refresh()
        } catch (error) {
            console.error('Submit error:', error)
            let errorMessage = 'Bir hata oluştu.'
            if (error instanceof Error) {
                errorMessage = error.message
            }
            alert(`İşlem başarısız: ${errorMessage}`)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Makale Başlığı
                </label>
                <input
                    {...register('title')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
            </div>

            {/* Abstract */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Özet
                </label>
                <textarea
                    {...register('abstract')}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
                {errors.abstract && (
                    <p className="mt-1 text-sm text-red-600">{errors.abstract.message}</p>
                )}
            </div>

            {/* Keywords */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anahtar Kelimeler (virgül ile ayırın)
                </label>
                <input
                    {...register('keywords')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.keywords && (
                    <p className="mt-1 text-sm text-red-600">{errors.keywords.message}</p>
                )}
            </div>

            {/* File Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Makale Dosyası (PDF)
                </label>

                {currentPdfUrl && !file ? (
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg mb-2">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-900">Mevcut Dosya Yüklü</p>
                                <a href={currentPdfUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">Görüntüle</a>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setCurrentPdfUrl(null)}
                            className="text-gray-500 hover:text-red-600 p-2"
                            title="Dosyayı Değiştir"
                        >
                            <span className="text-xs font-bold text-blue-600 hover:underline">Değiştir</span>
                        </button>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors bg-gray-50">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-2">Maksimum 10MB. PDF, DOC veya DOCX.</p>
                        {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {(isSubmitting || isUploading) ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Değişiklikleri Kaydet
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
