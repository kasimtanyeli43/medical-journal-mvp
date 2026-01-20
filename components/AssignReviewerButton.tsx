'use client'

import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

interface User {
    id: string
    name: string
    email: string
}

interface AssignReviewerButtonProps {
    articleId: string
    currentReviewerId?: string | null
}

export function AssignReviewerButton({ articleId, currentReviewerId }: AssignReviewerButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [reviewers, setReviewers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [assigning, setAssigning] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isOpen) {
            fetchReviewers()
        }
    }, [isOpen])

    async function fetchReviewers() {
        setLoading(true)
        try {
            const res = await fetch('/api/users?role=REVIEWER')
            if (res.ok) {
                const data = await res.json()
                setReviewers(data.users || [])
            }
        } catch (err) {
            console.error('Failed to fetch reviewers:', err)
        } finally {
            setLoading(false)
        }
    }

    async function assignReviewer(reviewerId: string) {
        setAssigning(true)
        setError('')
        try {
            const res = await fetch(`/api/articles/${articleId}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewerId })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to assign reviewer')
            }

            // Success - refresh page
            window.location.reload()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setAssigning(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-outline flex items-center gap-2"
                disabled={assigning}
            >
                <Users className="w-4 h-4" />
                {currentReviewerId ? 'Hakemi Değiştir' : 'Hakem Ata'}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Hakem Seç</h3>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Hakemler yükleniyor...</div>
                            ) : reviewers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">Uygun hakem bulunamadı</div>
                            ) : (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {reviewers.map((reviewer) => (
                                        <button
                                            key={reviewer.id}
                                            onClick={() => assignReviewer(reviewer.id)}
                                            disabled={assigning || reviewer.id === currentReviewerId}
                                            className={`w-full text-left p-3 rounded border hover:bg-gray-50 transition ${reviewer.id === currentReviewerId
                                                    ? 'bg-blue-50 border-blue-300'
                                                    : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="font-medium">{reviewer.name}</div>
                                            <div className="text-sm text-gray-500">{reviewer.email}</div>
                                            {reviewer.id === currentReviewerId && (
                                                <div className="text-xs text-blue-600 mt-1">Mevcut Hakem</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="btn-outline"
                                    disabled={assigning}
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
