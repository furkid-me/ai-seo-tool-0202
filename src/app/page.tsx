'use client'

import { useState, useEffect } from 'react'
import { CATEGORIES, fetchTrendingKeywords, formatSearchVolume, getTrendIndicator } from '@/services/keywords'
import { generateBlogContent, generateBlogTitle } from '@/services/content'
import { Category, TrendingKeyword, BlogPost, GenerationStep } from '@/types'
import CategorySelector from '@/components/CategorySelector'
import KeywordList from '@/components/KeywordList'
import BlogEditor from '@/components/BlogEditor'
import LoadingSpinner from '@/components/LoadingSpinner'
import StepIndicator from '@/components/StepIndicator'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<GenerationStep['step']>('category')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [keywords, setKeywords] = useState<TrendingKeyword[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<TrendingKeyword | null>(null)
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([])
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch keywords when category is selected
  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category)
    setIsLoading(true)
    setError(null)

    try {
      const fetchedKeywords = await fetchTrendingKeywords(category.id)
      setKeywords(fetchedKeywords)
      setCurrentStep('keyword')
    } catch (err) {
      setError('無法獲取熱門關鍵字，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate content when keyword is selected
  const handleKeywordSelect = async (keyword: TrendingKeyword) => {
    setSelectedKeyword(keyword)
    setIsLoading(true)
    setError(null)
    setCurrentStep('generating')

    try {
      // First generate title suggestions
      const titles = await generateBlogTitle(keyword.keyword, selectedCategory?.id || '')
      setSuggestedTitles(titles)

      // Then generate full content
      const result = await generateBlogContent({
        keyword: keyword.keyword,
        category: selectedCategory?.id || '',
        tone: 'friendly',
        length: 'medium',
      })

      if (result.success) {
        setBlogPost({
          id: Date.now().toString(),
          title: result.title,
          metaDescription: result.metaDescription,
          content: result.content,
          keywords: [keyword.keyword, ...keyword.relatedQueries.slice(0, 3)],
          category: selectedCategory?.id || '',
          createdAt: new Date(),
          status: 'draft',
        })
        setCurrentStep('editing')
      } else {
        setError(result.error || '生成內容時發生錯誤')
      }
    } catch (err) {
      setError('生成內容時發生錯誤，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle title change from suggestions
  const handleTitleSelect = (title: string) => {
    if (blogPost) {
      setBlogPost({ ...blogPost, title })
    }
  }

  // Handle content edit
  const handleContentEdit = (content: string) => {
    if (blogPost) {
      setBlogPost({ ...blogPost, content })
    }
  }

  // Handle title edit
  const handleTitleEdit = (title: string) => {
    if (blogPost) {
      setBlogPost({ ...blogPost, title })
    }
  }

  // Handle meta description edit
  const handleMetaEdit = (metaDescription: string) => {
    if (blogPost) {
      setBlogPost({ ...blogPost, metaDescription })
    }
  }

  // Copy content to clipboard
  const handleCopy = async (type: 'all' | 'title' | 'content' | 'meta') => {
    if (!blogPost) return

    let textToCopy = ''
    switch (type) {
      case 'all':
        textToCopy = `# ${blogPost.title}\n\n${blogPost.metaDescription}\n\n${blogPost.content}`
        break
      case 'title':
        textToCopy = blogPost.title
        break
      case 'content':
        textToCopy = blogPost.content
        break
      case 'meta':
        textToCopy = blogPost.metaDescription
        break
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      alert('已複製到剪貼簿！')
    } catch (err) {
      alert('複製失敗，請手動選取複製')
    }
  }

  // Publish (simulate)
  const handlePublish = () => {
    if (blogPost) {
      setBlogPost({ ...blogPost, status: 'published' })
      setCurrentStep('publishing')
      alert('文章已準備發布！（此為模擬功能）')
    }
  }

  // Reset to start
  const handleReset = () => {
    setCurrentStep('category')
    setSelectedCategory(null)
    setKeywords([])
    setSelectedKeyword(null)
    setSuggestedTitles([])
    setBlogPost(null)
    setError(null)
  }

  // Go back one step
  const handleBack = () => {
    switch (currentStep) {
      case 'keyword':
        setCurrentStep('category')
        setSelectedCategory(null)
        setKeywords([])
        break
      case 'editing':
      case 'generating':
        setCurrentStep('keyword')
        setSelectedKeyword(null)
        setBlogPost(null)
        setSuggestedTitles([])
        break
      case 'publishing':
        setCurrentStep('editing')
        if (blogPost) {
          setBlogPost({ ...blogPost, status: 'draft' })
        }
        break
    }
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI SEO 部落格生成器
          </h1>
          <p className="text-lg text-gray-600">
            自動抓取熱門關鍵字，生成 SEO 優化的部落格內容
          </p>
        </header>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700 underline"
            >
              關閉
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner
            message={
              currentStep === 'category' ? '載入中...' :
              currentStep === 'keyword' ? '正在獲取熱門關鍵字...' :
              '正在生成 SEO 優化內容...'
            }
          />
        )}

        {/* Main Content */}
        {!isLoading && (
          <div className="fade-in">
            {/* Step 1: Category Selection */}
            {currentStep === 'category' && (
              <CategorySelector
                categories={CATEGORIES}
                onSelect={handleCategorySelect}
              />
            )}

            {/* Step 2: Keyword Selection */}
            {currentStep === 'keyword' && selectedCategory && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {selectedCategory.icon} {selectedCategory.name} - 熱門關鍵字
                    </h2>
                    <p className="text-gray-600 mt-1">選擇一個關鍵字來生成部落格內容</p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                  >
                    ← 返回選擇類別
                  </button>
                </div>
                <KeywordList
                  keywords={keywords}
                  onSelect={handleKeywordSelect}
                />
              </div>
            )}

            {/* Step 3 & 4: Blog Editor */}
            {(currentStep === 'editing' || currentStep === 'publishing') && blogPost && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      編輯與審核
                    </h2>
                    <p className="text-gray-600 mt-1">
                      關鍵字: <span className="font-medium text-primary-600">{selectedKeyword?.keyword}</span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      ← 選擇其他關鍵字
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700"
                    >
                      重新開始
                    </button>
                  </div>
                </div>
                <BlogEditor
                  blogPost={blogPost}
                  suggestedTitles={suggestedTitles}
                  onTitleSelect={handleTitleSelect}
                  onTitleEdit={handleTitleEdit}
                  onMetaEdit={handleMetaEdit}
                  onContentEdit={handleContentEdit}
                  onCopy={handleCopy}
                  onPublish={handlePublish}
                />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>AI SEO 部落格生成器 © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  )
}
