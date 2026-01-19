'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Email veya şifre hatalı')
                setLoading(false)
                return
            }

            // Redirect based on user role will be handled by middleware
            router.push('/dashboard')
            router.refresh()
        } catch (err) {
            setError('Bir hata oluştu, lütfen tekrar deneyin')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
                        <BookOpen className="w-8 h-8 text-primary-600" />
                        Tıp Dergisi
                    </Link>
                </div>

                {/* Login Card */}
                <div className="card">
                    <h1 className="text-2xl font-bold text-center mb-6">Giriş Yap</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                required
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Şifre
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Hesabınız yok mu?{' '}
                        <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                            Kayıt Olun
                        </Link>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Demo Hesapları:</p>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p>Yazar: author@demo.com / demo123</p>
                            <p>Editör: editor@demo.com / demo123</p>
                            <p>Hakem: reviewer@demo.com / demo123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
