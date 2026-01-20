
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } })
    console.log('--- USERS ---')
    console.log(JSON.stringify(users, null, 2))

    const articles = await prisma.article.findMany({ select: { id: true, title: true, status: true, reviewerId: true } })
    console.log('\n--- ARTICLES ---')
    console.log(JSON.stringify(articles, null, 2))

    const reviews = await prisma.review.findMany({ select: { id: true, articleId: true, reviewerId: true, status: true } })
    console.log('\n--- REVIEWS ---')
    console.log(JSON.stringify(reviews, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
