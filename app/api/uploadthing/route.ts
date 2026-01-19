import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from './core'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
    config: { isDev: true }, // Enable verbose logs
})
