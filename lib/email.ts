import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string
    subject: string
    html: string
}) {
    try {
        if (!process.env.RESEND_API_KEY) {
            // Test mode - just log to console
            console.log('📧 [TEST MODE] Email would be sent:')
            console.log(`To: ${to}`)
            console.log(`Subject: ${subject}`)
            console.log(`Body: ${html.substring(0, 100)}...`)
            return { success: true, messageId: 'test-mode' }
        }

        if (!resend) {
            console.log('📧 [NO API KEY] Email would be sent (mock):')
            console.log(`To: ${to}`)
            console.log(`Subject: ${subject}`)
            return { success: true, messageId: 'mock-sent' }
        }

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        })

        return { success: true, messageId: data?.data?.id || 'sent' }
    } catch (error) {
        console.error('Failed to send email:', error)
        return { success: false, error }
    }
}

// Email Templates
export function articleSubmittedEmail(authorName: string, articleTitle: string) {
    return {
        subject: 'Makale Gönderiminiz Alındı',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">Makale Gönderiminiz Alındı</h2>
        <p>Sayın ${authorName},</p>
        <p><strong>"${articleTitle}"</strong> başlıklı makaleniz başarıyla sistemimize kaydedilmiştir.</p>
        <p>Makaleniz editörlerimiz tarafından incelenecek ve değerlendirme sürecine alınacaktır. Süreç hakkında size email ile bilgi verilecektir.</p>
        <p>Saygılarımızla,<br>Tıp Dergisi Editörlüğü</p>
      </div>
    `,
    }
}

export function reviewerAssignedEmail(
    reviewerName: string,
    articleTitle: string,
    articleId: string
) {
    return {
        subject: 'Yeni Makale Değerlendirme Talebi',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">Yeni Değerlendirme Talebi</h2>
        <p>Sayın ${reviewerName},</p>
        <p>Aşağıdaki makale için hakem olarak atanmış bulunmaktasınız:</p>
        <p><strong>${articleTitle}</strong></p>
        <p>Lütfen sisteme giriş yaparak makaleyi inceleyiniz ve değerlendirme raporunuzu gönderiniz.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/dashboard/reviewer/review/${articleId}" style="background: #0369a1; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">Makaleyi İncele</a></p>
        <p>Saygılarımızla,<br>Tıp Dergisi Editörlüğü</p>
      </div>
    `,
    }
}

export function reviewCompletedEmail(editorName: string, articleTitle: string) {
    return {
        subject: 'Hakem Değerlendirmesi Tamamlandı',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">Değerlendirme Tamamlandı</h2>
        <p>Sayın ${editorName},</p>
        <p><strong>"${articleTitle}"</strong> başlıklı makale için hakem değerlendirmesi tamamlanmıştır.</p>
        <p>Değerlendirme raporunu incelemek için sisteme giriş yapınız.</p>
        <p>Saygılarımızla,<br>Tıp Dergisi Sistemi</p>
      </div>
    `,
    }
}

export function decisionEmail(
    authorName: string,
    articleTitle: string,
    decision: string,
    comments?: string
) {
    const decisionText = {
        ACCEPTED: 'Kabul Edildi',
        REJECTED: 'Reddedildi',
        REVISION_REQUESTED: 'Revizyon İsteniyor',
    }[decision] || decision

    return {
        subject: `Makale Kararı: ${decisionText}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">Makale Değerlendirme Sonucu</h2>
        <p>Sayın ${authorName},</p>
        <p><strong>"${articleTitle}"</strong> başlıklı makaleniz için editör kararı:</p>
        <p style="font-size: 18px; font-weight: bold; color: ${decision === 'ACCEPTED' ? '#059669' : decision === 'REJECTED' ? '#dc2626' : '#f59e0b'
            };">${decisionText}</p>
        ${comments ? `<p><strong>Editör Yorumu:</strong><br>${comments}</p>` : ''}
        <p>Detaylı bilgi için lütfen sisteme giriş yapınız.</p>
        <p>Saygılarımızla,<br>Tıp Dergisi Editörlüğü</p>
      </div>
    `,
    }
}

export function welcomeEmail(userName: string) {
    return {
        subject: 'Tıp Dergisine Hoş Geldiniz',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">Aramıza Hoş Geldiniz!</h2>
        <p>Sayın ${userName},</p>
        <p>Tıp Dergisi sistemine kaydınız başarıyla oluşturulmuştur.</p>
        <p>Hesabınızla giriş yaparak makale gönderebilir veya size atanan görevleri takip edebilirsiniz.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/login" style="background: #0369a1; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px; margin-top: 10px;">Giriş Yap</a></p>
        <p>Saygılarımızla,<br>Tıp Dergisi Ekibi</p>
      </div>
    `,
    }
}
