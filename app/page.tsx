'use client'

import Link from 'next/link'
import { FileText, BookOpen, Users, Sparkles } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 font-sans">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100/50 sticky top-0 z-30">
                <div className="container-custom py-3 max-w-full px-6 lg:px-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1.5 rounded-lg text-white">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent tracking-tight">Tıp Dergisi</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/articles" className="text-gray-600 font-medium hover:text-purple-600 transition-colors">
                                Makaleler
                            </Link>
                            <Link href="/login" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 hover:-translate-y-0.5 duration-200">
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-b border-purple-100/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url(/hero-background.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}></div>
                </div>

                {/* Animated floating elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative container-custom py-28 text-center max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm text-purple-700 text-sm font-medium mb-6 shadow-sm border border-purple-100/50 hover:shadow-md transition-shadow">
                        <Sparkles className="w-4 h-4" />
                        Akademik Yayıncılıkta Yeni Dönem
                    </div>
                    <h2 className="text-6xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight animate-fade-in">
                        Tıp Araştırmalarınızı <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">Dünyayla Paylaşın</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
                        Hakemli tıp dergimize makale gönderin, bilimsel değerlendirme sürecini şeffaf bir şekilde takip edin.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
                        <Link href="/register" className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-xl shadow-purple-200/50 hover:shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Hemen Makale Gönder
                                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                        <Link href="/articles" className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl hover:bg-white transition-all border border-purple-100/50 shadow-sm hover:shadow-md hover:-translate-y-1 duration-200">
                            Yayınları İncele
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container-custom py-24 px-4">
                <div className="text-center mb-16 animate-fade-in">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Neden Bizi Tercih Etmelisiniz?</h3>
                    <p className="text-gray-600 text-lg">Araştırmacı odaklı modern yayıncılık deneyimi</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="group bg-white p-8 rounded-2xl border border-purple-100/50 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-7 h-7 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Kolay Makale Gönderimi</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Kullanıcı dostu arayüzümüz ile PDF, DOC ve DOCX formatlarındaki makalelerinizi saniyeler içinde yükleyin ve süreci başlatın.
                        </p>
                    </div>

                    <div className="group bg-white p-8 rounded-2xl border border-purple-100/50 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Adil Hakem Değerlendirmesi</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Alanında uzman hakemlerimiz tarafından gerçekleştirilen kör hakemlik (blind review) süreciyle objektif değerlendirme.
                        </p>
                    </div>

                    <div className="group bg-white p-8 rounded-2xl border border-purple-100/50 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-7 h-7 text-teal-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Hızlı Yayın Süreci</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Kabul edilen makaleleriniz, DOI numarası atanarak dijital ortamda vakit kaybetmeden yayınlanır.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="container-custom max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1.5 rounded-lg text-white">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">Tıp Dergisi</span>
                        </div>
                        <p className="text-sm">
                            © 2024 Tıp Dergisi. Bilimsel yayıncılıkta güvenilir adres.
                        </p>
                    </div>
                    <div className="text-center pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-500 font-light tracking-wide flex items-center justify-center gap-2">
                            Designed by
                            <img
                                src="/kasim-logo.png"
                                alt="Kasım Tanyeli"
                                className="h-4 inline-block opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out;
                }
            `}</style>
        </div>
    )
}
