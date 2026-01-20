
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Checking Reviewer View...')

    // 1. Get the Demo Reviewer
    const reviewer = await prisma.user.findUnique({
        where: { email: 'reviewer@demo.com' }
    })

    if (!reviewer) {
        console.log('❌ Error: User "reviewer@demo.com" not found in DB!')
        return
    }

    console.log(`✅ Found Reviewer: ${reviewer.name} (${reviewer.id})`)

    // 2. Check Reviews for this reviewer
    const reviews = await prisma.review.findMany({
        where: { reviewerId: reviewer.id },
        include: { article: true }
    })

    console.log(`\n📋 Review Count: ${reviews.length}`)

    if (reviews.length > 0) {
        reviews.forEach(r => {
            console.log(` - Review ID: ${r.id} | Status: ${r.status}`)
            console.log(`   Article: ${r.article.title} (${r.article.id})`)
        })
    } else {
        console.log('   (No reviews found for this user)')
    }

    // 3. Check Articles assigned to this reviewer (Directly on Article Table)
    const assignedArticles = await prisma.article.findMany({
        where: { reviewerId: reviewer.id }
    })

    console.log(`\n🔗 Articles with reviewerId = ${reviewer.id}: ${assignedArticles.length}`)
    assignedArticles.forEach(a => {
        console.log(` - Article: ${a.title} (${a.id}) | Status: ${a.status}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
