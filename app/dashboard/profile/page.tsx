import { requireAuth } from '@/lib/auth'
import { User, Mail, Shield } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const user = await requireAuth()

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Bilgileri</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-8 border-b border-gray-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 text-3xl font-bold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="bg-white p-2 rounded-md shadow-sm">
                            <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                            <p className="text-gray-900 font-medium">{user.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="bg-white p-2 rounded-md shadow-sm">
                            <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">E-posta Adresi</p>
                            <p className="text-gray-900 font-medium">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="bg-white p-2 rounded-md shadow-sm">
                            <Shield className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Hesap Tipi</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                {user.role === 'AUTHOR' ? 'Yazar' : user.role === 'EDITOR' ? 'Editör' : 'Hakem'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
