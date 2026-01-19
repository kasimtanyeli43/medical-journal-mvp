'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, FileText, Users, CheckCircle, LogOut, PlusCircle, Home } from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session } = useSession()
    const pathname = usePathname()

    const navigation = {
        AUTHOR: [
            { name: 'Dashboard', href: '/dashboard/author', icon: Home },
            { name: 'Makalelerim', href: '/dashboard/author', icon: FileText },
            { name: 'Yeni Makale', href: '/dashboard/author/submit', icon: PlusCircle },
        ],
        EDITOR: [
            { name: 'Dashboard', href: '/dashboard/editor', icon: Home },
            { name: 'Tüm Makaleler', href: '/dashboard/editor', icon: FileText },
            { name: 'Hakemler', href: '/dashboard/editor/reviewers', icon: Users },
        ],
        REVIEWER: [
            { name: 'Dashboard', href: '/dashboard/reviewer', icon: Home },
            { name: 'Atanan Makaleler', href: '/dashboard/reviewer', icon: FileText },
            { name: 'Tamamlananlar', href: '/dashboard/reviewer/completed', icon: CheckCircle },
        ],
    }

    const userRole = session?.user?.role as keyof typeof navigation
    const links = navigation[userRole] || []

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary-600" />
                            <span className="font-semibold text-gray-900">Tıp Dergisi</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {session?.user?.name}
                                <span className="ml-2 text-xs text-gray-500">
                                    ({userRole === 'AUTHOR' ? 'Yazar' : userRole === 'EDITOR' ? 'Editör' : 'Hakem'})
                                </span>
                            </span>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" />
                                Çıkış
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)]">
                    <nav className="p-4 space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.name}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    )
}
