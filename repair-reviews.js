
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🔧 Starting Review Repair...')

    // 1. Find articles that have a reviewer assigned but might be missing a Review record
    const articles = await prisma.article.findMany({
        where: {
            reviewerId: { not: null }
        },
        include: {
            reviews: true
        }
    })

    console.log(`Found ${articles.length} articles with assigned reviewers.`)

    let fixedCount = 0

    for (const article of articles) {
        // Check if there is a review record for this reviewer
        const hasReview = article.reviews.some(r => r.reviewerId === article.reviewerId)

        if (!hasReview) {
            console.log(`⚠️  Article "${article.title}" (${article.id}) has reviewer ${article.reviewerId} but NO Review record. Fixing...`)

            if (article.reviewerId) {
                await prisma.review.create({
                    data: {
                        articleId: article.id,
                        reviewerId: article.reviewerId,
                        status: 'PENDING'
                    }
                })
                fixedCount++
                console.log(`✅ Created missing review record for Article ${article.id}`)
            }
        } else {
            console.log(`✓ Article "${article.title}" is OK.`)
        }
    }

    console.log(`\n🎉 Repair completed. Fixed ${fixedCount} articles.`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
