import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GenerationRequest } from '@/types'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Category context for better content generation
const CATEGORY_CONTEXT: Record<string, string> = {
  pets: '寵物飼養、寵物健康、寵物用品、寵物食品',
  beauty: '美妝保養、化妝技巧、護膚產品、美容趨勢',
  food: '美食推薦、食譜分享、餐廳評價、料理技巧',
  tech: '科技產品、3C評測、軟體應用、數位生活',
  travel: '旅遊攻略、景點推薦、住宿評價、旅行經驗',
  fitness: '健身運動、營養補給、減重塑身、運動裝備',
  fashion: '時尚穿搭、流行趨勢、服飾配件、風格建議',
  home: '居家生活、家電推薦、收納整理、居家佈置',
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json()
    const { keyword, category, tone = 'friendly', length = 'medium' } = body

    if (!keyword || !category) {
      return NextResponse.json(
        { success: false, error: 'Keyword and category are required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to template-based generation
      const { generateBlogContent } = await import('@/services/content')
      const result = await generateBlogContent({ keyword, category, tone, length })
      return NextResponse.json({ ...result, source: 'template' })
    }

    const wordCount = length === 'short' ? 800 : length === 'medium' ? 1500 : 2500
    const categoryContext = CATEGORY_CONTEXT[category] || category

    const toneInstructions = {
      professional: '專業、權威、使用專業術語',
      casual: '輕鬆、口語化、像朋友聊天',
      friendly: '親切、易懂、有幫助性',
      authoritative: '專家角度、深入分析、有說服力',
    }

    const currentYear = new Date().getFullYear()

    // Generate title using OpenAI
    const titlePrompt = `你是一位專業的 SEO 內容專家。請為關鍵字「${keyword}」生成 5 個吸引人且 SEO 優化的繁體中文部落格標題。

要求：
- 標題要吸引點擊
- 包含關鍵字
- 適合台灣讀者
- 加入年份 ${currentYear} 增加時效性
- 每個標題一行，不要編號

主題領域：${categoryContext}`

    const titleResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: titlePrompt }],
      max_tokens: 500,
      temperature: 0.8,
    })

    const titles = titleResponse.choices[0]?.message?.content
      ?.split('\n')
      .filter(t => t.trim())
      .slice(0, 5) || [`${currentYear}年${keyword}完整指南`]

    const selectedTitle = titles[0]

    // Generate meta description
    const metaPrompt = `為標題「${selectedTitle}」生成一個 150-160 字元的 SEO meta description。
要求：繁體中文、包含關鍵字「${keyword}」、吸引點擊、說明文章價值。只輸出描述文字，不要加引號。`

    const metaResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: metaPrompt }],
      max_tokens: 200,
      temperature: 0.7,
    })

    const metaDescription = metaResponse.choices[0]?.message?.content?.trim() ||
      `深入了解${keyword}的完整指南，提供專業建議和實用技巧。`

    // Generate full article content
    const contentPrompt = `你是一位專業的部落格作家和 SEO 專家。請撰寫一篇關於「${keyword}」的繁體中文部落格文章。

標題：${selectedTitle}
字數：約 ${wordCount} 字
語調：${toneInstructions[tone as keyof typeof toneInstructions] || '親切易懂'}
主題領域：${categoryContext}
目標讀者：台灣地區的繁體中文使用者

文章要求：
1. 使用 Markdown 格式
2. 包含清晰的標題層級（## 和 ###）
3. 適當使用列表、表格增加可讀性
4. 自然融入關鍵字「${keyword}」（不要過度堆砌）
5. 內容要有實用價值，提供具體建議
6. 加入 FAQ 段落回答常見問題
7. 結尾要有行動呼籲

文章結構建議：
- 引言（說明為什麼這個主題重要）
- 主要內容（3-5 個重點段落）
- 實用建議或推薦
- 常見問題 FAQ
- 總結

請直接輸出文章內容，不要加入額外說明。`

    const contentResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: contentPrompt }],
      max_tokens: 3000,
      temperature: 0.7,
    })

    const content = contentResponse.choices[0]?.message?.content?.trim() ||
      '文章生成失敗，請重試。'

    return NextResponse.json({
      success: true,
      title: selectedTitle,
      titles,
      metaDescription,
      content,
      source: 'openai',
    })
  } catch (error) {
    console.error('Error generating content:', error)

    // Fallback to template-based generation on error
    try {
      const body = await request.clone().json()
      const { generateBlogContent } = await import('@/services/content')
      const result = await generateBlogContent(body)
      return NextResponse.json({ ...result, source: 'template' })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to generate content' },
        { status: 500 }
      )
    }
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
    if (!process.env.OPENAI_API_KEY) {
      const { generateBlogTitle } = await import('@/services/content')
      const titles = await generateBlogTitle(keyword, category)
      return NextResponse.json({ success: true, titles, source: 'template' })
    }

    const currentYear = new Date().getFullYear()
    const prompt = `為關鍵字「${keyword}」生成 5 個吸引人的繁體中文部落格標題。
要求：SEO 優化、包含年份 ${currentYear}、適合台灣讀者。每個標題一行，不要編號。`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.8,
    })

    const titles = response.choices[0]?.message?.content
      ?.split('\n')
      .filter(t => t.trim())
      .slice(0, 5) || []

    return NextResponse.json({ success: true, titles, source: 'openai' })
  } catch (error) {
    console.error('Error generating titles:', error)
    const { generateBlogTitle } = await import('@/services/content')
    const titles = await generateBlogTitle(keyword, category)
    return NextResponse.json({ success: true, titles, source: 'template' })
  }
}
