'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

export function PublishedArticlesList({ articles }: { articles: any[] }) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredArticles = articles.filter(article => {
        const searchLower = searchTerm.toLowerCase()
        return (
            article.title.toLowerCase().includes(searchLower) ||
            article.abstract.toLowerCase().includes(searchLower) ||
            article.keywords.some((k: string) => k.toLowerCase().includes(searchLower)) ||
            article.author.name.toLowerCase().includes(searchLower)
        )
    })

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Makale başlığı, özet, anahtar kelime veya yazar adı ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
                {searchTerm && (
                    <p className="mt-2 text-sm text-gray-600">
                        {filteredArticles.length} makale bulundu
                    </p>
                )}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">
                        {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz yayınlanmış makale bulunmamaktadır.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/articles/${article.id}`}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {article.keywords[0] || 'Genel'}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                    Yayınlandı
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {article.abstract}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                                <span className="font-medium">{article.author.name}</span>
                                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
