import Link from 'next/link'
import { FileText, BookOpen } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-8 h-8 text-primary-600" />
                            <h1 className="text-xl font-bold text-gray-900">Tıp Dergisi</h1>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/articles" className="text-gray-600 hover:text-primary-600 transition-colors">
                                Makaleler
                            </Link>
                            <Link href="/login" className="btn-primary">
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container-custom py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        Akademik Tıp Araştırmalarınızı Paylaşın
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Hakemli tıp dergimize makale gönderin, değerlendirme sürecini takip edin ve
                        araştırmalarınızı bilim dünyasıyla paylaşın.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/register" className="btn-primary text-lg px-8 py-3">
                            Makale Gönder
                        </Link>
                        <Link href="/articles" className="btn-outline text-lg px-8 py-3">
                            Yayınları İncele
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container-custom py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Kolay Makale Gönderimi</h3>
                        <p className="text-gray-600">
                            PDF formatında makalenizi yükleyin ve gönderim sürecini takip edin.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Hakemli Değerlendirme</h3>
                        <p className="text-gray-600">
                            Uzman hakemlerimiz tarafından bilimsel değerlendirme süreci.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Hızlı Yayın</h3>
                        <p className="text-gray-600">
                            Kabul edilen makaleleriniz dijital ortamda hızlıca yayınlanır.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t mt-20">
                <div className="container-custom py-8">
                    <p className="text-center text-gray-600">
                        © 2024 Tıp Dergisi. Tüm hakları saklıdır.
                    </p>
                </div>
            </footer>
        </div>
    )
}
