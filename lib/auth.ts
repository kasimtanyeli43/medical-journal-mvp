import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'

export async function getSession() {
    return await getServerSession(authOptions)
}

export async function getCurrentUser() {
    const session = await getSession()
    return session?.user
}

export async function requireAuth() {
    const user = await getCurrentUser()
    if (!user) {
        redirect('/login')
    }
    return user
}

export async function requireRole(allowedRoles: string[]) {
    const user = await requireAuth()
    if (!allowedRoles.includes(user.role)) {
        redirect('/dashboard')
    }
    return user
}
