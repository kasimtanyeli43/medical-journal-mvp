import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { LogOut, BookOpen } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    // Redirect to role-specific dashboard
    if (user.role === 'AUTHOR') {
        redirect('/dashboard/author')
    } else if (user.role === 'EDITOR') {
        redirect('/dashboard/editor')
    } else if (user.role === 'REVIEWER') {
        redirect('/dashboard/reviewer')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary-600" />
                            <span className="font-semibold text-gray-900">Tıp Dergisi</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{user.name}</span>
                            <Link href="/api/auth/signout" className="text-sm text-red-600 hover:text-red-700">
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-custom py-8">
                <h1 className="text-2xl font-bold mb-4">Hoş Geldiniz</h1>
                <p>Yönlendiriliyor...</p>
            </div>
        </div>
    )
}
