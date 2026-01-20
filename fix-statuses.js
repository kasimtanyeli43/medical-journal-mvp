const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🔧 Fixing article statuses based on completed reviews...')

    // Find all articles that are UNDER_REVIEW
    const articles = await prisma.article.findMany({
        where: {
            status: 'UNDER_REVIEW'
        },
        include: {
            reviews: true
        }
    })

    console.log(`Found ${articles.length} articles under review.`)

    let fixedCount = 0

    for (const article of articles) {
        // Check if there are any completed reviews
        const completedReview = article.reviews.find(r => r.status === 'COMPLETED')

        if (completedReview && completedReview.recommendation) {
            console.log(`Fixing article: ${article.title}`)

            let newStatus = 'UNDER_REVIEW'

            if (completedReview.recommendation === 'ACCEPT') {
                newStatus = 'ACCEPTED'
            } else if (completedReview.recommendation === 'REJECT') {
                newStatus = 'REJECTED'
            } else if (completedReview.recommendation === 'MAJOR_REVISION' || completedReview.recommendation === 'MINOR_REVISION') {
                newStatus = 'REVISION_REQUESTED'
            }

            if (newStatus !== 'UNDER_REVIEW') {
                await prisma.article.update({
                    where: { id: article.id },
                    data: { status: newStatus }
                })
                console.log(`  ✅ Updated to: ${newStatus}`)
                fixedCount++
            }
        }
    }

    console.log(`\n🎉 Fixed ${fixedCount} articles.`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
