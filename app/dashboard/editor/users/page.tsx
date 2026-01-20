'use client'

import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Check, X, Clock, UserCheck, UserX } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

function getStatusBadge(status: string) {
    if (status === 'PENDING') {
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Beklemede
        </span>
    }
    if (status === 'APPROVED') {
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            Onaylandı
        </span>
    }
    if (status === 'REJECTED') {
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1">
            <UserX className="w-4 h-4" />
            Reddedildi
        </span>
    }
    return null
}

function getRoleText(role: string) {
    if (role === 'AUTHOR') return 'Yazar'
    if (role === 'REVIEWER') return 'Hakem'
    if (role === 'EDITOR') return 'Editör'
    return role
}

function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)

    const handleApprove = async (userId: string) => {
        setLoading(userId)
        try {
            const res = await fetch(`/api/users/${userId}/approve`, {
                method: 'POST'
            })
            if (res.ok) {
                router.refresh()
            } else {
                alert('Onaylama başarısız oldu')
            }
        } catch (error) {
            console.error(error)
            alert('Bir hata oluştu')
        } finally {
            setLoading(null)
        }
    }

    const handleReject = async (userId: string) => {
        setLoading(userId)
        try {
            const res = await fetch(`/api/users/${userId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: '' })
            })
            if (res.ok) {
                router.refresh()
            } else {
                alert('Reddetme başarısız oldu')
            }
        } catch (error) {
            console.error(error)
            alert('Bir hata oluştu')
        } finally {
            setLoading(null)
        }
    }

    const pendingUsers = initialUsers.filter(u => u.approvalStatus === 'PENDING')
    const approvedUsers = initialUsers.filter(u => u.approvalStatus === 'APPROVED')
    const rejectedUsers = initialUsers.filter(u => u.approvalStatus === 'REJECTED')

    return (
        <div className="max-w-7xl mx-auto">
            <Link
                href="/dashboard/editor"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Editör Paneline Dön
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
                <p className="text-gray-500 mt-2">Kullanıcı başvurularını inceleyin ve onaylayın</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Bekleyen</p>
                            <p className="text-3xl font-bold text-yellow-900 mt-1">{pendingUsers.length}</p>
                        </div>
                        <Clock className="w-12 h-12 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Onaylı</p>
                            <p className="text-3xl font-bold text-green-900 mt-1">{approvedUsers.length}</p>
                        </div>
                        <UserCheck className="w-12 h-12 text-green-400" />
                    </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-600 text-sm font-medium">Reddedilen</p>
                            <p className="text-3xl font-bold text-red-900 mt-1">{rejectedUsers.length}</p>
                        </div>
                        <UserX className="w-12 h-12 text-red-400" />
                    </div>
                </div>
            </div>

            {/* Pending Users */}
            {pendingUsers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Bekleyen Başvurular</h2>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İsim</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurum</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pendingUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{getRoleText(user.role)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.affiliation || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(user.id)}
                                                    disabled={loading === user.id}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    {loading === user.id ? 'Bekle...' : 'Onayla'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(user.id)}
                                                    disabled={loading === user.id}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Reddet
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Users */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">Tüm Kullanıcılar</h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İsim</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {initialUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{getRoleText(user.role)}</td>
                                    <td className="px-6 py-4 text-sm">{getStatusBadge(user.approvalStatus)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default async function UsersManagementPage() {
    await requireRole(['EDITOR'])

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        where: {
            role: {
                in: ['AUTHOR', 'REVIEWER']
            }
        }
    })

    const serializedUsers = users.map(u => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString()
    }))

    return <UserManagementClient initialUsers={serializedUsers} />
}
