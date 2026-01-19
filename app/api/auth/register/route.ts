import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password, name, role, affiliation } = body

        // Validate input
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Lütfen tüm gerekli alanları doldurun' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Şifre en az 6 karakter olmalıdır' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Bu email adresi zaten kullanılıyor' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'AUTHOR',
                affiliation,
            },
        })

        return NextResponse.json({
            message: 'Kayıt başarılı',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Kayıt sırasında bir hata oluştu' },
            { status: 500 }
        )
    }
}
