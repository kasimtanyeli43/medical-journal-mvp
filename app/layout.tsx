import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
    title: 'Tıp Dergisi - Makale Yönetim Sistemi',
    description: 'Akademik tıp dergisi makale gönderimi ve hakemlik sistemi',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="tr">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
