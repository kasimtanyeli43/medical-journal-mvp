'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'AUTHOR',
        affiliation: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Kayıt başarısız')
                setLoading(false)
                return
            }

            // Redirect to login after successful registration
            router.push('/login?registered=true')
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

                {/* Register Card */}
                <div className="card">
                    <h1 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="label">
                                Ad Soyad
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                                required
                                placeholder="Dr. Ahmet Yılmaz"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field"
                                required
                                minLength={6}
                                placeholder="En az 6 karakter"
                            />
                        </div>

                        <div>
                            <label htmlFor="affiliation" className="label">
                                Kurum
                            </label>
                            <input
                                id="affiliation"
                                type="text"
                                value={formData.affiliation}
                                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                                className="input-field"
                                placeholder="Üniversite / Hastane"
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="label">
                                Rol
                            </label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="input-field"
                            >
                                <option value="AUTHOR">Yazar</option>
                                <option value="REVIEWER">Hakem</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Editör hesapları sistem yöneticisi tarafından oluşturulur
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Zaten hesabınız var mı?{' '}
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
