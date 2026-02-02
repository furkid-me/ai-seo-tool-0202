import { NextRequest, NextResponse } from 'next/server'
import { generateBlogContent, generateBlogTitle } from '@/services/content'
import { GenerationRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json()
    const { keyword, category, tone, length } = body

    if (!keyword || !category) {
      return NextResponse.json(
        { success: false, error: 'Keyword and category are required' },
        { status: 400 }
      )
    }

    const result = await generateBlogContent({
      keyword,
      category,
      tone,
      length,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

// Generate titles only
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword')
  const category = searchParams.get('category')

  if (!keyword || !category) {
    return NextResponse.json(
      { success: false, error: 'Keyword and category are required' },
      { status: 400 }
    )
  }

  try {
    const titles = await generateBlogTitle(keyword, category)
    return NextResponse.json({
      success: true,
      titles,
    })
  } catch (error) {
    console.error('Error generating titles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate titles' },
      { status: 500 }
    )
  }
}
