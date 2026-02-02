'use client'

import { useState } from 'react'
import { CATEGORIES, fetchTrendingKeywords } from '@/services/keywords'
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
  const [customKeyword, setCustomKeyword] = useState('')
  const [dataSource, setDataSource] = useState<string>('')

  // Try API first, fallback to static data
  const fetchKeywords = async (categoryId: string) => {
    // Try API route first (for local development)
    try {
      const response = await fetch(`/api/keywords?category=${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDataSource(data.source || 'api')
          return data.keywords
        }
      }
    } catch {
      // API not available, use static data
    }

    // Fallback to static data
    setDataSource('static')
    return fetchTrendingKeywords(categoryId)
  }

  // Try API first for content generation
  const generateContent = async (keyword: string, categoryId: string) => {
    // Try API route first
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          category: categoryId,
          tone: 'friendly',
          length: 'medium',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          return {
            ...data,
            titles: data.titles || [data.title],
          }
        }
      }
    } catch {
      // API not available
    }

    // Fallback to template generation
    const titles = await generateBlogTitle(keyword, categoryId)
    const result = await generateBlogContent({
      keyword,
      category: categoryId,
      tone: 'friendly',
      length: 'medium',
    })

    return { ...result, titles }
  }

  // Fetch keywords when category is selected
  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category)
    setIsLoading(true)
    setError(null)

    try {
      const fetchedKeywords = await fetchKeywords(category.id)
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
    await generateForKeyword(keyword.keyword, keyword.relatedQueries)
  }

  // Handle custom keyword submission
  const handleCustomKeyword = async () => {
    if (!customKeyword.trim() || !selectedCategory) return

    const keyword: TrendingKeyword = {
      keyword: customKeyword.trim(),
      searchVolume: 0,
      trend: 'stable',
      relatedQueries: [],
    }
    setSelectedKeyword(keyword)
    await generateForKeyword(customKeyword.trim(), [])
  }

  // Generate content for a keyword
  const generateForKeyword = async (keyword: string, relatedQueries: string[]) => {
    setIsLoading(true)
    setError(null)
    setCurrentStep('generating')

    try {
      const result = await generateContent(keyword, selectedCategory?.id || '')

      if (result.success) {
        setSuggestedTitles(result.titles || [result.title])
        setBlogPost({
          id: Date.now().toString(),
          title: result.title,
          metaDescription: result.metaDescription,
          content: result.content,
          keywords: [keyword, ...relatedQueries.slice(0, 3)],
          category: selectedCategory?.id || '',
          createdAt: new Date(),
          status: 'draft',
        })
        setCurrentStep('editing')
      } else {
        setError(result.error || '生成內容時發生錯誤')
        setCurrentStep('keyword')
      }
    } catch (err) {
      setError('生成內容時發生錯誤，請稍後再試')
      setCurrentStep('keyword')
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
    } catch {
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
    setCustomKeyword('')
    setDataSource('')
  }

  // Go back one step
  const handleBack = () => {
    switch (currentStep) {
      case 'keyword':
        setCurrentStep('category')
        setSelectedCategory(null)
        setKeywords([])
        setCustomKeyword('')
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
          {dataSource && (
            <p className="text-sm text-gray-400 mt-1">
              資料來源: {dataSource === 'google-trends' ? 'Google Trends (即時)' :
                        dataSource === 'openai' ? 'OpenAI (AI生成)' :
                        dataSource === 'api' ? 'API' : '靜態資料'}
            </p>
          )}
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
              '正在使用 AI 生成 SEO 優化內容...'
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
                    <p className="text-gray-600 mt-1">選擇一個關鍵字或自行輸入</p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                  >
                    ← 返回選擇類別
                  </button>
                </div>

                {/* Custom Keyword Input */}
                <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    自訂關鍵字
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={customKeyword}
                      onChange={(e) => setCustomKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCustomKeyword()}
                      placeholder="輸入你想要的關鍵字..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                    <button
                      onClick={handleCustomKeyword}
                      disabled={!customKeyword.trim()}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                      生成文章
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    或選擇熱門關鍵字
                  </h3>
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
