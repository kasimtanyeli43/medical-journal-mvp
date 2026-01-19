/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['uploadthing.com', 'utfs.io'],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
}

module.exports = nextConfig
