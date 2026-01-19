import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Hash password for all demo users
    const hashedPassword = await bcrypt.hash('demo123', 10)

    // Create demo users
    const author = await prisma.user.upsert({
        where: { email: 'author@demo.com' },
        update: {},
        create: {
            email: 'author@demo.com',
            password: hashedPassword,
            name: 'Dr. Ahmet Yılmaz',
            role: 'AUTHOR',
            affiliation: 'İstanbul Üniversitesi Tıp Fakültesi',
            bio: 'Göğüs hastalıkları uzmanı',
        },
    })

    const editor = await prisma.user.upsert({
        where: { email: 'editor@demo.com' },
        update: {},
        create: {
            email: 'editor@demo.com',
            password: hashedPassword,
            name: 'Prof. Dr. Ayşe Demir',
            role: 'EDITOR',
            affiliation: 'Hacettepe Üniversitesi',
            bio: 'Baş editör',
        },
    })

    const reviewer = await prisma.user.upsert({
        where: { email: 'reviewer@demo.com' },
        update: {},
        create: {
            email: 'reviewer@demo.com',
            password: hashedPassword,
            name: 'Doç. Dr. Mehmet Kaya',
            role: 'REVIEWER',
            affiliation: 'Ankara Üniversitesi',
            bio: 'Solunum sistemi hastalıkları araştırmacısı',
        },
    })

    console.log('✅ Created demo users')

    // Create a journal issue
    const issue = await prisma.issue.create({
        data: {
            volume: 1,
            number: 1,
            year: 2024,
            publishedAt: new Date('2024-01-15'),
        },
    })

    console.log('✅ Created journal issue')

    // Create sample articles with different statuses
    const article1 = await prisma.article.create({
        data: {
            title: 'COVID-19 Pnömonisinde Yüksek Çözünürlüklü BT Bulguları',
            abstract: 'Bu çalışmada COVID-19 pnömonisi olan hastalarda yüksek çözünürlüklü bilgisayarlı tomografi bulgularını değerlendirdik. 150 hasta dahil edildi ve en sık bulgular buzlu cam opasiteleri ve konsolidasyonlardı.',
            keywords: ['COVID-19', 'Pnömoni', 'HRCT', 'Radyoloji'],
            authors: ['Dr. Ahmet Yılmaz', 'Dr. Zeynep Arslan'],
            authorId: author.id,
            status: 'PUBLISHED',
            publishedAt: new Date('2024-01-20'),
            issueId: issue.id,
        },
    })

    const article2 = await prisma.article.create({
        data: {
            title: 'Kronik Obstrüktif Akciğer Hastalığında Yeni Tedavi Yaklaşımları',
            abstract: 'KOAH tedavisinde son yıllarda geliştirilen yeni ilaçların etkinliğini araştırdık. Çift bronkodilatör tedavilerin kombinasyonu umut verici sonuçlar gösterdi.',
            keywords: ['KOAH', 'Tedavi', 'Bronkodilatör'],
            authors: ['Dr. Ahmet Yılmaz'],
            authorId: author.id,
            status: 'UNDER_REVIEW',
        },
    })

    const article3 = await prisma.article.create({
        data: {
            title: 'İnterstisyel Akciğer Hastalıklarında Tanı Algoritması',
            abstract: 'İnterstisyel akciğer hastalıklarının tanısında multidisipliner yaklaşımın önemini vurguladık. HRCT, bronkoskopi ve patolojik değerlendirme birlikte yapılmalıdır.',
            keywords: ['İAH', 'Tanı', 'Algoritma', 'HRCT'],
            authors: ['Dr. Ahmet Yılmaz', 'Prof. Dr. Ayşe Demir'],
            authorId: author.id,
            status: 'SUBMITTED',
        },
    })

    console.log('✅ Created sample articles')

    // Create sample review for article2
    await prisma.review.create({
        data: {
            articleId: article2.id,
            reviewerId: reviewer.id,
            comments: 'Metodoloji bölümü güçlendirilmeli. İstatistiksel analiz detayları eksik.',
            confidential: 'Yazar deneyimsiz görünüyor ama konu ilginç.',
            recommendation: 'MINOR_REVISION',
            status: 'COMPLETED',
            submittedAt: new Date(),
        },
    })

    console.log('✅ Created sample review')

    console.log('🎉 Seed completed successfully!')
    console.log('\n📝 Demo Credentials:')
    console.log('Author: author@demo.com / demo123')
    console.log('Editor: editor@demo.com / demo123')
    console.log('Reviewer: reviewer@demo.com / demo123')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
