import React from 'react'
import Link from 'next/link'
import { Calendar, User, Eye, ArrowRight } from 'lucide-react'

interface ArticleCardProps {
    id: string
    title: string
    abstract?: string
    author: string
    date: string
    category?: string
    status: string
    views?: number
    href?: string
    showStatus?: boolean
    compact?: boolean
}

export function ArticleCard({
    id,
    title,
    abstract,
    author,
    date,
    category = 'General',
    status,
    views,
    href,
    showStatus = true,
    compact = false
}: ArticleCardProps) {

    // Status badge logic - handles both Turkish text and English codes
    const getStatusStyle = (status: string) => {
        const statusLower = status.toLowerCase()

        if (status === 'SUBMITTED' || statusLower.includes('gönderildi')) {
            return 'bg-blue-100 text-blue-800'
        }
        if (status === 'UNDER_REVIEW' || statusLower.includes('inceleniyor')) {
            return 'bg-yellow-100 text-yellow-800'
        }
        if (status === 'ACCEPTED' || statusLower.includes('kabul')) {
            return 'bg-green-100 text-green-800'
        }
        if (status === 'REJECTED' || statusLower.includes('red')) {
            return 'bg-red-100 text-red-800'
        }
        if (status === 'PUBLISHED' || statusLower.includes('yayınlandı')) {
            return 'bg-purple-100 text-purple-800'
        }
        if (status === 'REVISION_REQUESTED' || statusLower.includes('revizyon') || statusLower.includes('minör') || statusLower.includes('majör')) {
            return 'bg-orange-100 text-orange-800'
        }
        if (statusLower.includes('tamamlandı') || statusLower.includes('completed')) {
            return 'bg-blue-100 text-blue-800'
        }

        return 'bg-gray-100 text-gray-800'
    }

    const formatStatus = (s: string) => s.replace('_', ' ')

    const Content = (
        <div className={`article-card h-full flex flex-col ${compact ? 'p-3' : 'p-5'}`}>
            <div className="flex justify-between items-start mb-3">
                <span className="badge-category bg-slate-100 text-slate-600 border border-slate-200">
                    {category}
                </span>
                {showStatus && (
                    <span className={`badge ${getStatusStyle(status)}`}>
                        {formatStatus(status)}
                    </span>
                )}
            </div>

            <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${compact ? 'text-sm' : 'text-lg'}`}>
                {title}
            </h3>

            {!compact && abstract && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {abstract}
                </p>
            )}

            <div className={`flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100`}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <User size={14} />
                        <span className="truncate max-w-[100px]">{author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(date).toLocaleDateString()}</span>
                    </div>
                </div>

                {views !== undefined && (
                    <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{views}</span>
                    </div>
                )}
            </div>
        </div>
    )

    if (href) {
        return <Link href={href} className="block h-full">{Content}</Link>
    }

    return Content
}
