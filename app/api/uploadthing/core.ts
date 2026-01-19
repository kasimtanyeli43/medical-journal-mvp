import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: '8MB', maxFileCount: 1 } })
        .middleware(async () => {
            console.log("UploadThing Middleware: MINIMAL DEBUG MODE START")
            // No auth check, no env check, just success
            return { userId: "minimal-debug-user" }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('Upload complete for userId:', metadata.userId)
            console.log('File URL:', file.url)
            return { uploadedBy: metadata.userId, url: file.url }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
