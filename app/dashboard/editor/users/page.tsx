import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserManagementClient } from './UserManagementClient'

export const dynamic = 'force-dynamic'

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
