import { createUploadthing, type FileRouter } from 'uploadthing/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

const f = createUploadthing()

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: '8MB', maxFileCount: 1 } })
        .onUploadComplete(async ({ file }) => {
            console.log('Upload complete. File URL:', file.url)
            // No metadata returned since no middleware
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
