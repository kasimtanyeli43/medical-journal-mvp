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
            { name: 'Kullanıcı Yönetimi', href: '/dashboard/editor/users', icon: Users },
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
            <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
                <div className="container-custom py-3 max-w-full px-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">Tıp Dergisi</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end mr-2">
                                <span className="text-sm font-medium text-gray-900">
                                    {session?.user?.name}
                                </span>
                                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                                    {userRole === 'AUTHOR' ? 'Yazar' : userRole === 'EDITOR' ? 'Editör' : 'Hakem'}
                                </span>
                            </div>
                            <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-2 transition-colors px-3 py-2 hover:bg-red-50 rounded-md"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Çıkış</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 sidebar-dark border-r border-gray-800 min-h-[calc(100vh-65px)] flex flex-col justify-between sticky top-[65px] h-[calc(100vh-65px)]">
                    <div className="p-4">
                        <div className="mb-6 px-4 py-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menü</p>
                        </div>
                        <nav className="space-y-1">
                            {links.map((link) => {
                                const Icon = link.icon
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{link.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="p-4 border-t border-gray-800">
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-white">
                                {session?.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">Profili Düzenle</p>
                            </div>
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 bg-gray-50 min-h-[calc(100vh-65px)]">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
