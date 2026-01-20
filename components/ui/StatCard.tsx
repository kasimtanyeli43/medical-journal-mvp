import React from 'react'

interface StatCardProps {
    title: string
    value: number | string
    subtitle?: string
    icon: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
        label?: string
    }
    iconBgColor?: string
    iconColor?: string
}

export function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    iconBgColor = 'bg-blue-50',
    iconColor = 'text-blue-600'
}: StatCardProps) {
    return (
        <div className="stat-card group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-gray-900">{value}</div>
                </div>
                <div className={`p-3 rounded-lg ${iconBgColor} ${iconColor} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>

            {(trend || subtitle) && (
                <div className="flex items-center justify-between mt-1">
                    {trend && (
                        <div className={trend.isPositive ? 'trend-positive' : 'trend-negative'}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{trend.value}%</span>
                            <span className="text-gray-400 font-normal ml-1 text-xs">
                                {trend.label || 'geçen aya göre'}
                            </span>
                        </div>
                    )}
                    {subtitle && (
                        <div className="text-xs text-gray-400">{subtitle}</div>
                    )}
                </div>
            )}
        </div>
    )
}
