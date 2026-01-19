import Link from 'next/link'
import { FileText, BookOpen, Users } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
                <div className="container-custom py-3 max-w-full px-6 lg:px-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">Tıp Dergisi</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/articles" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
                                Makaleler
                            </Link>
                            <Link href="/login" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-white border-b border-gray-100">
                <div className="container-custom py-28 text-center max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                        Akademik Yayıncılıkta Yeni Dönem
                    </div>
                    <h2 className="text-6xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
                        Tıp Araştırmalarınızı <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dünyayla Paylaşın</span>
                    </h2>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Hakemli tıp dergimize makale gönderin, bilimsel değerlendirme sürecini şeffaf bir şekilde takip edin.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register" className="btn-primary text-lg px-8 py-4 shadow-xl shadow-blue-100 ring-1 ring-blue-600">
                            Hemen Makale Gönder
                        </Link>
                        <Link href="/articles" className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-sm">
                            Yayınları İncele
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container-custom py-24 px-4">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold text-gray-900">Neden Bizi Tercih Etmelisiniz?</h3>
                    <p className="text-gray-500 mt-4">Araştırmacı odaklı modern yayıncılık deneyimi</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                            <FileText className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Kolay Makale Gönderimi</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Kullanıcı dostu arayüzümüz ile PDF formatındaki makalelerinizi saniyeler içinde yükleyin ve süreci başlatın.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Adil Hakem Değerlendirmesi</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Alanında uzman hakemlerimiz tarafından gerçekleştirilen kör hakemlik (blind review) süreciyle objektif değerlendirme.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen className="w-7 h-7 text-teal-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Hızlı Yayın Süreci</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Kabul edilen makaleleriniz, DOI numarası atanarak dijital ortamda vakit kaybetmeden yayınlanır.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="container-custom max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="bg-gray-800 p-1.5 rounded-lg text-white">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl text-white tracking-tight">Tıp Dergisi</span>
                    </div>
                    <p className="text-sm">
                        © 2024 Tıp Dergisi. Bilimsel yayıncılıkta güvenilir adres.
                    </p>
                </div>
            </footer>
        </div>
    )
}
