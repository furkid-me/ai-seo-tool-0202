'use client'

import { Category } from '@/types'

interface CategorySelectorProps {
  categories: Category[]
  onSelect: (category: Category) => void
}

export default function CategorySelector({ categories, onSelect }: CategorySelectorProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        選擇內容類別
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        選擇您想要撰寫的主題類別，我們將為您找出最熱門的關鍵字
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category)}
            className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-400 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {category.nameEn}
            </p>
            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
              {category.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
