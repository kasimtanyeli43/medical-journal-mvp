import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Hash password for all demo accounts
    const hashedPassword = await bcrypt.hash('demo123', 10)

    // Create demo users
    const author = await prisma.user.upsert({
        where: { email: 'author@demo.com' },
        update: {},
        create: {
            email: 'author@demo.com',
            password: hashedPassword,
            name: 'Demo Yazar',
            role: 'AUTHOR',
            affiliation: 'Demo Üniversitesi',
            bio: 'Demo yazar hesabı - Makale gönderme testi için',
        },
    })
    console.log('✅ Author created:', author.email)

    const editor = await prisma.user.upsert({
        where: { email: 'editor@demo.com' },
        update: {},
        create: {
            email: 'editor@demo.com',
            password: hashedPassword,
            name: 'Demo Editör',
            role: 'EDITOR',
            affiliation: 'Tıp Dergisi',
            bio: 'Demo editör hesabı - Hakem atama ve karar verme testi için',
        },
    })
    console.log('✅ Editor created:', editor.email)

    const reviewer = await prisma.user.upsert({
        where: { email: 'reviewer@demo.com' },
        update: {},
        create: {
            email: 'reviewer@demo.com',
            password: hashedPassword,
            name: 'Demo Hakem',
            role: 'REVIEWER',
            affiliation: 'Araştırma Enstitüsü',
            bio: 'Demo hakem hesabı - Makale inceleme testi için',
        },
    })
    console.log('✅ Reviewer created:', reviewer.email)

    console.log('🎉 Seeding completed!')
    console.log('\n📋 Demo Hesaplar:')
    console.log('  Author:   author@demo.com   / demo123')
    console.log('  Editor:   editor@demo.com   / demo123')
    console.log('  Reviewer: reviewer@demo.com / demo123')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seeding error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
