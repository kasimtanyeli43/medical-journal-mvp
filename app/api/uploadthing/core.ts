import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

const f = createUploadthing()

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: '8MB', maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            console.log("UploadThing Middleware: Starting")

            try {
                const session = await getServerSession(authOptions)

                if (!session || !session.user) {
                    console.error("UploadThing Middleware: Unauthorized - No valid session found. USING DEBUG FALLBACK.")
                    // TEMPORARY DEBUG: Allow upload even if auth fails to verify if upload mechanism works
                    return { userId: "debug-fallback-user" }
                    // throw new Error('Unauthorized') <--- Commented out for debugging
                }

                console.log("UploadThing Middleware: Authorized user", session.user.id)
                return { userId: session.user.id }
            } catch (error) {
                console.error("UploadThing Middleware Error:", error)
                throw new Error('UploadThing Middleware Failed')
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('Upload complete for userId:', metadata.userId)
            console.log('File URL:', file.url)

            return { uploadedBy: metadata.userId, url: file.url }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
