'use client'

import { useState } from 'react'
import { BlogPost } from '@/types'

interface BlogEditorProps {
  blogPost: BlogPost
  suggestedTitles: string[]
  onTitleSelect: (title: string) => void
  onTitleEdit: (title: string) => void
  onMetaEdit: (meta: string) => void
  onContentEdit: (content: string) => void
  onCopy: (type: 'all' | 'title' | 'content' | 'meta') => void
  onPublish: () => void
}

export default function BlogEditor({
  blogPost,
  suggestedTitles,
  onTitleSelect,
  onTitleEdit,
  onMetaEdit,
  onContentEdit,
  onCopy,
  onPublish,
}: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false)

  // Convert markdown to simple HTML for preview
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(Boolean).map(cell => cell.trim())
        return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`
      })
  }

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">文章標題</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTitleSuggestions(!showTitleSuggestions)}
              className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition"
            >
              {showTitleSuggestions ? '隱藏建議' : '查看建議標題'}
            </button>
            <button
              onClick={() => onCopy('title')}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              複製
            </button>
          </div>
        </div>

        <input
          type="text"
          value={blogPost.title}
          onChange={(e) => onTitleEdit(e.target.value)}
          className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />

        {/* Title Suggestions */}
        {showTitleSuggestions && suggestedTitles.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">建議標題（點擊選用）：</p>
            <div className="space-y-2">
              {suggestedTitles.map((title, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onTitleSelect(title)
                    setShowTitleSuggestions(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition"
                >
                  {index + 1}. {title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meta Description Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Meta 描述</h3>
            <p className="text-sm text-gray-500">用於搜尋引擎結果顯示（建議 150-160 字元）</p>
          </div>
          <button
            onClick={() => onCopy('meta')}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            複製
          </button>
        </div>

        <textarea
          value={blogPost.metaDescription}
          onChange={(e) => onMetaEdit(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
        />
        <div className="mt-2 text-right text-sm text-gray-500">
          {blogPost.metaDescription.length} 字元
        </div>
      </div>

      {/* Keywords Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">SEO 關鍵字</h3>
        <div className="flex flex-wrap gap-2">
          {blogPost.keywords.map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'edit'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            編輯模式
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'preview'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            預覽模式
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'edit' ? (
            <textarea
              value={blogPost.content}
              onChange={(e) => onContentEdit(e.target.value)}
              rows={25}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y font-mono text-sm"
              placeholder="在此編輯您的文章內容（支援 Markdown 格式）..."
            />
          ) : (
            <div className="prose max-w-none blog-content">
              <h1>{blogPost.title}</h1>
              <div
                dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(blogPost.content)}</p>` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => onCopy('all')}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          複製全部內容
        </button>

        <button
          onClick={() => onCopy('content')}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          僅複製文章內容
        </button>

        <button
          onClick={onPublish}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2 font-medium shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          發布文章
        </button>
      </div>

      {/* Status Badge */}
      <div className="text-center">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            blogPost.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : blogPost.status === 'review'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {blogPost.status === 'draft' && '草稿'}
          {blogPost.status === 'review' && '審核中'}
          {blogPost.status === 'published' && '已發布'}
        </span>
      </div>
    </div>
  )
}
