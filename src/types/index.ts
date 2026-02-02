// Category types
export interface Category {
  id: string
  name: string
  nameEn: string
  icon: string
  description: string
}

// Keyword types
export interface TrendingKeyword {
  keyword: string
  searchVolume: number
  trend: 'rising' | 'stable' | 'declining'
  relatedQueries: string[]
}

// Blog content types
export interface BlogPost {
  id: string
  title: string
  metaDescription: string
  content: string
  keywords: string[]
  category: string
  createdAt: Date
  status: 'draft' | 'review' | 'published'
}

// Generation request types
export interface GenerationRequest {
  category: string
  keyword: string
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative'
  length?: 'short' | 'medium' | 'long'
}

// API response types
export interface KeywordResponse {
  success: boolean
  keywords: TrendingKeyword[]
  error?: string
}

export interface ContentResponse {
  success: boolean
  title: string
  metaDescription: string
  content: string
  error?: string
}

// UI state types
export interface GenerationStep {
  step: 'category' | 'keyword' | 'generating' | 'editing' | 'publishing'
  isLoading: boolean
  error?: string
}
