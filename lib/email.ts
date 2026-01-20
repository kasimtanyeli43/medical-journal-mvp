import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
        if (!resend) {
            console.log('Email (test mode):', { to, subject })
            return { success: true, messageId: 'test' }
        }
        const data = await resend.emails.send({ from: FROM_EMAIL, to, subject, html })
        return { success: true, messageId: data?.data?.id || 'sent' }
    } catch (error) {
        console.error('Email error:', error)
        return { success: false, error }
    }
}

export function articleSubmittedEmail(authorName: string, articleTitle: string) {
    return {
        subject: 'Makale Gonderim Onay',
        html: `<h2>Merhaba ${authorName}</h2><p>Makaleniz alindi: ${articleTitle}</p>`
    }
}

export function welcomeEmail(userName: string) {
    return {
        subject: 'Hos Geldiniz',
        html: `<h2>Hos geldiniz ${userName}</h2>`
    }
}

export function reviewerAssignedEmail({ reviewer, article, author }: any) {
    return {
        subject: 'Yeni Inceleme Talebi',
        html: `<h2>Merhaba ${reviewer.name}</h2><p>Makale: ${article.title}</p><a href="${process.env.NEXTAUTH_URL}/dashboard/reviewer">Incele</a>`
    }
}

export function reviewSubmittedEmail({ editor, article, recommendation }: any) {
    return {
        subject: 'Hakem Gorusu Alindi',
        html: `<h2>Merhaba ${editor.name}</h2><p>Makale: ${article.title}</p><p>Oneri: ${recommendation}</p>`
    }
}

export function userApprovedEmail(user: any) {
    return {
        subject: 'Hesabınız Onaylandı - Tıp Dergisi',
        html: `
            <h2>Hesabınız Onaylandı!</h2>
            <p>Merhaba ${user.name},</p>
            <p>Tıp Dergisi hesabınız editör tarafından onaylandı. Artık sisteme giriş yapabilirsiniz.</p>
            <p><a href="${process.env.NEXTAUTH_URL}/login">Giriş Yap</a></p>
            <p>İyi çalışmalar dileriz!</p>
        `
    }
}

export function userRejectedEmail(user: any, reason?: string) {
    return {
        subject: 'Hesap Başvurunuz Hakkında - Tıp Dergisi',
        html: `
            <h2>Hesap Başvurunuz</h2>
            <p>Merhaba ${user.name},</p>
            <p>Tıp Dergisi hesap başvurunuz editör tarafından değerlendirildi.</p>
            ${reason ? `<p><strong>Açıklama:</strong> ${reason}</p>` : ''}
            <p>Daha fazla bilgi için lütfen bizimle iletişime geçin.</p>
        `
    }
}

export function newUserRegisteredEmail(user: any) {
    return {
        subject: 'Yeni Kullanıcı Kaydı - Tıp Dergisi',
        html: `
            <h2>Yeni Kullanıcı Kaydı</h2>
            <p>Yeni bir kullanıcı sisteme kayıt oldu ve onayınızı bekliyor.</p>
            <p><strong>İsim:</strong> ${user.name}</p>
            <p><strong>E-posta:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${user.role === 'AUTHOR' ? 'Yazar' : 'Hakem'}</p>
            <p><strong>Kurum:</strong> ${user.affiliation || 'Belirtilmemiş'}</p>
            <p><a href="${process.env.NEXTAUTH_URL}/dashboard/editor/users">Kullanıcıyı İncele</a></p>
        `
    }
}
