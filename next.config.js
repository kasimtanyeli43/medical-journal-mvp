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
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig
