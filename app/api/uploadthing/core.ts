import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getServerSession } from 'next-auth'

const f = createUploadthing()

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: '10MB', maxFileCount: 1 } })
        .middleware(async () => {
            const session = await getServerSession()

            if (!session?.user) {
                throw new Error('Unauthorized')
            }

            return { userId: session.user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('Upload complete for userId:', metadata.userId)
            console.log('File URL:', file.url)

            return { uploadedBy: metadata.userId, url: file.url }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
