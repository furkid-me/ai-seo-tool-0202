'use client'

import { TrendingKeyword } from '@/types'
import { formatSearchVolume, getTrendIndicator } from '@/services/keywords'

interface KeywordListProps {
  keywords: TrendingKeyword[]
  onSelect: (keyword: TrendingKeyword) => void
}

export default function KeywordList({ keywords, onSelect }: KeywordListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {keywords.map((keyword, index) => {
        const trend = getTrendIndicator(keyword.trend)

        return (
          <button
            key={keyword.keyword}
            onClick={() => onSelect(keyword)}
            className="group p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-400 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-400">
                    #{index + 1}
                  </span>
                  <span className={`text-sm font-medium ${trend.color}`}>
                    {trend.icon} {trend.text}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 mt-1">
                  {keyword.keyword}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  {formatSearchVolume(keyword.searchVolume)}
                </div>
                <div className="text-xs text-gray-500">月搜尋量</div>
              </div>
            </div>

            {keyword.relatedQueries.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">相關搜尋：</div>
                <div className="flex flex-wrap gap-1">
                  {keyword.relatedQueries.slice(0, 3).map((query) => (
                    <span
                      key={query}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {query}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 text-sm text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
              點擊生成部落格內容 →
            </div>
          </button>
        )
      })}
    </div>
  )
}
