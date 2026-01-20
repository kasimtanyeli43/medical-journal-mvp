
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const userCount = await prisma.user.count()
    const articleCount = await prisma.article.count()
    const reviewCount = await prisma.review.count()

    console.log(`Users: ${userCount}`)
    console.log(`Articles: ${articleCount}`)
    console.log(`Reviews: ${reviewCount}`)

    const reviews = await prisma.review.findMany()
    console.log('Reviews:', JSON.stringify(reviews))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
