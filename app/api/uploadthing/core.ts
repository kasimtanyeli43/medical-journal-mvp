import { createUploadthing, type FileRouter } from 'uploadthing/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

const f = createUploadthing()

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: '8MB', maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            console.log("UploadThing Middleware: Starting (Auth Bypassed)")
            // No auth check for debugging
            return { userId: "debug-user-v7-test" }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('Upload complete for userId:', metadata.userId)
            console.log('File URL:', file.url)
            return { uploadedBy: metadata.userId, url: file.url }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
