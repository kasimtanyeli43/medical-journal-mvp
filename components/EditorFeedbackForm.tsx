'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function EditorFeedbackForm({ articleId }: { articleId: string }) {
    const router = useRouter()
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!feedback.trim()) return

        setLoading(true)
        try {
            const res = await fetch(`/api/articles/${articleId}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback })
            })

            if (res.ok) {
                const data = await res.json()
                alert(data.published ? 'Geri bildirim gönderildi ve makale yayınlandı!' : 'Geri bildirim gönderildi!')
                router.refresh()
                setFeedback('')
            } else {
                alert('Geri bildirim gönderilemedi')
            }
        } catch (error) {
            console.error(error)
            alert('Bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Yazara Geri Bildirim Gönder</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Makale hakkında geri bildiriminizi yazın..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    required
                />
                <button
                    type="submit"
                    disabled={loading || !feedback.trim()}
                    className="mt-3 btn-primary disabled:opacity-50"
                >
                    {loading ? 'Gönderiliyor...' : 'Geri Bildirim Gönder'}
                </button>
            </form>
        </div>
    )
}
