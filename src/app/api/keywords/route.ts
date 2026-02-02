import { NextRequest, NextResponse } from 'next/server'
import { fetchTrendingKeywords } from '@/services/keywords'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')

  if (!category) {
    return NextResponse.json(
      { success: false, error: 'Category is required' },
      { status: 400 }
    )
  }

  try {
    const keywords = await fetchTrendingKeywords(category)
    return NextResponse.json({
      success: true,
      keywords,
    })
  } catch (error) {
    console.error('Error fetching keywords:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch keywords' },
      { status: 500 }
    )
  }
}
