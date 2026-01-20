
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚑 Starting Force Repair (Round 3)...')

    const articles = await prisma.article.findMany({
        where: {
            reviewerId: { not: null },
            status: 'UNDER_REVIEW'
        }
    })

    for (const article of articles) {
        console.log(`Processing Article: ${article.title} (${article.id})`)

        const existingReview = await prisma.review.findFirst({
            where: {
                articleId: article.id,
                reviewerId: article.reviewerId
            }
        })

        if (!existingReview) {
            console.log(` - ❌ Missing Review record! Attempting to create with ALL fields filled...`)
            try {
                // Providing dummy values for ALL fields to satisfy strict constraints
                // Recommendation is provided but Status is kept PENDING, so it should still show as "Pending" in UI
                const newReview = await prisma.review.create({
                    data: {
                        articleId: article.id,
                        reviewerId: article.reviewerId,
                        status: 'PENDING',
                        comments: 'Otomatik onarım ile oluşturuldu.',
                        confidential: '',
                        recommendation: 'MINOR_REVISION' // Dummy value to satisfy DB, ignoring logic for now
                    }
                })
                console.log(` - ✅ SUCCESS: Created Review (ID: ${newReview.id})`)
            } catch (err) {
                console.error(` - 💥 ERROR creating review: ${err.message}`)
            }
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
