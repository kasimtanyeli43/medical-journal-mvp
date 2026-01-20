const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🔧 Updating existing users to APPROVED...')

    const result = await prisma.user.updateMany({
        data: {
            approvalStatus: 'APPROVED'
        }
    })

    console.log(`✅ Updated ${result.count} users to APPROVED`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
