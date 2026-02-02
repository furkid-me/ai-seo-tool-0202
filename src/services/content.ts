import { GenerationRequest, ContentResponse } from '@/types'

// Random utility
const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const shuffleArray = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

// Title templates by style
const TITLE_STYLES = {
  guide: (keyword: string, year: number) => [
    `【${year}最新】${keyword}完整攻略，專家教你怎麼選`,
    `${keyword}終極指南：從入門到精通一次搞懂`,
    `${year}年${keyword}完整教學，新手也能輕鬆上手`,
  ],
  comparison: (keyword: string, year: number) => [
    `${keyword}推薦指南：品牌這麼多，到底怎麼選？`,
    `${year}年${keyword}評比：10款熱門產品實測心得`,
    `${keyword}大比拚！市面上最夯的選擇一次看`,
  ],
  tips: (keyword: string, year: number) => [
    `新手必看！${keyword}選購技巧大公開`,
    `別再踩雷！${keyword}挑選的5大重點`,
    `買${keyword}前必知的7件事，避開常見陷阱`,
  ],
  trending: (keyword: string, year: number) => [
    `PTT/Dcard熱議！${keyword}真實評價總整理`,
    `${year}最夯${keyword}排行榜，網友激推這幾款`,
    `爆紅的${keyword}真的好用嗎？真實體驗分享`,
  ],
  budget: (keyword: string, year: number) => [
    `省錢攻略：${keyword}高CP值選擇推薦`,
    `小資族必看！平價${keyword}也能有好品質`,
    `${keyword}懶人包：各價位最佳選擇一次看`,
  ],
}

// Category-specific content templates
const CATEGORY_TEMPLATES: Record<string, {
  intro: string[]
  importance: string[]
  tips: string[][]
  recommendations: { title: string; description: string }[]
  faqs: { q: string; a: string }[]
  conclusion: string[]
}> = {
  pets: {
    intro: [
      '身為毛孩家長，我們都希望給予毛小孩最好的照顧。',
      '養寵物不只是餵食和陪伴，更重要的是了解牠們真正的需求。',
      '在寵物市場日益蓬勃的今天，如何為毛孩挑選適合的產品成為每位飼主的重要課題。',
    ],
    importance: [
      '寵物的健康與快樂直接影響著我們的生活品質，選對產品能讓照顧更輕鬆。',
      '根據獸醫師建議，適合的產品能有效預防常見的寵物健康問題。',
      '投資在正確的寵物用品上，長期來看反而能節省醫療費用。',
    ],
    tips: [
      ['確認產品適合的寵物年齡和體型', '選擇有品質認證的品牌', '注意成分是否天然無添加'],
      ['參考其他飼主的真實評價', '考慮寵物的個別需求和喜好', '避免選擇來路不明的產品'],
      ['先買小包裝試用', '觀察寵物的接受度和反應', '定期更換或升級產品'],
    ],
    recommendations: [
      { title: '新手入門款', description: '適合剛開始養寵物的飼主，價格親民且品質穩定' },
      { title: '獸醫推薦款', description: '經過專業認證，適合有特殊需求的毛孩' },
      { title: '網友熱推款', description: '社群討論度高，性價比優良的人氣選擇' },
    ],
    faqs: [
      { q: '多久需要更換一次？', a: '建議根據使用頻率和產品特性，一般 1-3 個月評估一次。' },
      { q: '如何判斷寵物是否喜歡？', a: '觀察寵物的使用意願、進食狀況和整體精神狀態。' },
      { q: '可以和其他產品混用嗎？', a: '建議先諮詢獸醫師，避免產生不良反應。' },
    ],
    conclusion: [
      '希望這篇文章能幫助你為毛孩找到最適合的選擇！',
      '每隻毛孩都是獨特的，多嘗試才能找到最適合的產品。',
      '如果有任何問題，歡迎留言討論或諮詢專業獸醫師。',
    ],
  },
  beauty: {
    intro: [
      '在美妝保養的世界裡，找到適合自己的產品就像找到命定的另一半。',
      '每個人的膚質和需求都不同，了解自己才能選對產品。',
      '面對琳瑯滿目的美妝產品，掌握正確的選購知識格外重要。',
    ],
    importance: [
      '選對保養品能有效改善肌膚問題，讓你省下不必要的嘗試成本。',
      '適合的產品不僅能達到預期效果，更能避免肌膚敏感或過敏。',
      '投資在正確的美妝產品上，是對自己最好的愛護。',
    ],
    tips: [
      ['了解自己的膚質類型', '確認產品成分是否適合', '注意產品的保存期限'],
      ['先索取試用包測試', '觀察使用後的肌膚反應', '循序漸進建立保養程序'],
      ['參考專業美妝部落客評價', '注意是否有過敏原成分', '選擇適合當季的產品'],
    ],
    recommendations: [
      { title: '敏感肌適用', description: '溫和不刺激，適合容易過敏的肌膚使用' },
      { title: '專櫃熱賣款', description: '品質保證，適合追求高效保養的使用者' },
      { title: '開架好評款', description: '平價優質，CP 值超高的國民愛用品' },
    ],
    faqs: [
      { q: '如何知道產品適不適合我？', a: '建議先在手腕內側試用，觀察 24 小時有無過敏反應。' },
      { q: '保養品的使用順序是？', a: '一般為：清潔→化妝水→精華液→乳液/乳霜→防曬。' },
      { q: '開封後可以用多久？', a: '大部分產品開封後建議 6-12 個月內使用完畢。' },
    ],
    conclusion: [
      '美麗沒有標準答案，找到適合自己的才是最重要的！',
      '保養是長期投資，持之以恆才能看到效果。',
      '如果有任何問題，歡迎在下方留言一起討論交流。',
    ],
  },
  food: {
    intro: [
      '民以食為天，在這個美食選擇爆炸的時代，如何吃得好又吃得巧是一門學問。',
      '無論是外食族還是自煮達人，了解食材和料理的知識都能讓生活更有滋味。',
      '好的飲食不只滿足口腹之慾，更是照顧身體健康的重要一環。',
    ],
    importance: [
      '選對食材和餐廳，能讓每一餐都成為美好的體驗。',
      '了解食物的特性，能幫助你做出更健康的飲食選擇。',
      '美食探索是生活中的小確幸，值得我們認真對待。',
    ],
    tips: [
      ['注意食材的新鮮度', '了解料理方式對營養的影響', '選擇衛生有保障的店家'],
      ['參考網路評價但保持客觀', '考慮自己的口味偏好', '嘗試不同風格的料理'],
      ['注意價格與份量的CP值', '避開用餐尖峰時段', '善用優惠活動和折扣'],
    ],
    recommendations: [
      { title: '在地人推薦', description: '當地人私藏的口袋名單，道地美味不踩雷' },
      { title: '網美打卡店', description: '環境氛圍滿分，適合拍照分享的人氣店家' },
      { title: '隱藏版美食', description: '低調但實力堅強，老饕才知道的好滋味' },
    ],
    faqs: [
      { q: '如何判斷餐廳值不值得去？', a: '可參考 Google 評價、美食部落格，並注意評論的真實性。' },
      { q: '怎麼避免踩雷？', a: '選擇有一定評價數量且分數穩定的店家較有保障。' },
      { q: '有什麼省錢小技巧？', a: '善用信用卡優惠、外送平台折扣，或選擇午間套餐。' },
    ],
    conclusion: [
      '人生苦短，一定要好好吃飯！希望這篇能幫你找到美味。',
      '每個人的口味不同，親自嘗試才能找到你的最愛。',
      '有發現什麼好吃的嗎？歡迎留言分享你的口袋名單！',
    ],
  },
  tech: {
    intro: [
      '科技日新月異，如何在眾多產品中找到最適合自己的，是現代人的必修課。',
      '3C 產品已成為生活必需品，選對產品能大幅提升工作與生活效率。',
      '面對規格複雜的科技產品，了解自己的需求才能做出正確選擇。',
    ],
    importance: [
      '科技產品的價格不低，做足功課能避免買了後悔。',
      '適合的產品能提升生產力，不適合的反而會造成困擾。',
      '了解產品特性，才能發揮它最大的價值。',
    ],
    tips: [
      ['確認產品規格符合需求', '比較不同品牌的優缺點', '注意保固條款和售後服務'],
      ['參考專業評測和開箱', '考慮未來的升級需求', '避免只看價格忽略品質'],
      ['選擇合適的購買時機', '確認是否有官方授權', '保留購買證明以利保固'],
    ],
    recommendations: [
      { title: '入門基本款', description: '功能夠用、價格實惠，適合一般使用需求' },
      { title: '效能旗艦款', description: '頂級規格、極致體驗，適合專業或重度使用者' },
      { title: 'CP 值首選', description: '規格與價格的最佳平衡，聰明消費者的選擇' },
    ],
    faqs: [
      { q: '規格看不懂怎麼辦？', a: '專注在你實際會用到的功能，不需要追求最高規格。' },
      { q: '網路購買還是實體店面好？', a: '網路通常較便宜，但實體店可以實際體驗和即時售後。' },
      { q: '什麼時候買最划算？', a: '注意雙 11、週年慶、新機上市前的舊款降價時機。' },
    ],
    conclusion: [
      '科技始終來自於人性，選擇適合自己的才是最好的。',
      '希望這篇文章能幫助你做出明智的選擇！',
      '有任何問題歡迎留言討論，我們一起研究。',
    ],
  },
  travel: {
    intro: [
      '旅行是生活中最美好的投資之一，規劃得好能讓旅程更加難忘。',
      '無論是說走就走還是精心策劃，做好功課都能讓旅行更順利。',
      '在這個資訊發達的時代，善用工具和資源能讓旅行體驗大幅提升。',
    ],
    importance: [
      '好的行前準備能避免旅途中的各種不便和意外。',
      '了解目的地的特色和注意事項，能讓你玩得更盡興。',
      '選對時機和方式旅行，能在有限預算內獲得最大樂趣。',
    ],
    tips: [
      ['提前規劃行程但保留彈性', '研究當地交通和住宿選擇', '了解當地文化和禮儀'],
      ['準備必要的旅行文件', '購買合適的旅遊保險', '下載實用的旅行 APP'],
      ['注意當地天氣和節慶', '準備應急藥品和用品', '保持開放心態體驗新事物'],
    ],
    recommendations: [
      { title: '經典必訪', description: '初次造訪必去的人氣景點，經典不敗的選擇' },
      { title: '在地私房', description: '避開人潮的秘境，體驗最道地的當地風情' },
      { title: '文青路線', description: '適合慢遊細品的特色景點，拍照打卡超有感' },
    ],
    faqs: [
      { q: '自由行還是跟團好？', a: '自由行彈性大但需自己規劃；跟團省事但行程較固定，依個人喜好選擇。' },
      { q: '怎麼找到便宜機票？', a: '善用比價網站、設定價格提醒，避開旺季和週末出發。' },
      { q: '住宿怎麼選？', a: '考慮交通便利性、安全性和預算，參考真實住客評價。' },
    ],
    conclusion: [
      '旅行的意義不在於去了多遠，而在於體驗了什麼。',
      '希望這篇文章能幫助你規劃一趟美好的旅程！',
      '去過的話歡迎留言分享你的旅行心得！',
    ],
  },
  fitness: {
    intro: [
      '健康是一切的基礎，而運動是維持健康最有效的方式之一。',
      '無論你的目標是減重、增肌還是維持體態，了解正確的方法很重要。',
      '健身不只是一種運動，更是一種生活態度和自我投資。',
    ],
    importance: [
      '正確的運動方式能有效達成目標，錯誤的方法反而可能造成傷害。',
      '選對裝備和補給品，能讓訓練事半功倍。',
      '建立正確的運動觀念，才能維持長期的健康生活。',
    ],
    tips: [
      ['循序漸進不要急躁', '注意正確的動作姿勢', '給身體足夠的休息時間'],
      ['搭配均衡的飲食計畫', '設定可達成的階段目標', '找到適合自己的運動類型'],
      ['運動前後做好暖身和收操', '保持水分攝取充足', '記錄訓練進度和身體變化'],
    ],
    recommendations: [
      { title: '入門基礎款', description: '適合剛開始運動的新手，簡單好上手' },
      { title: '進階訓練款', description: '適合有基礎的運動者，提升訓練效果' },
      { title: '專業競技款', description: '適合認真訓練的運動愛好者，追求極致表現' },
    ],
    faqs: [
      { q: '一週要運動幾次？', a: '建議至少 3 次，每次 30 分鐘以上，讓身體有適應和恢復時間。' },
      { q: '運動前後要吃什麼？', a: '運動前補充碳水化合物，運動後攝取蛋白質幫助恢復。' },
      { q: '肌肉痠痛是正常的嗎？', a: '適度痠痛是正常的，但劇烈疼痛可能是受傷，需要休息或就醫。' },
    ],
    conclusion: [
      '健身沒有捷徑，持之以恆才是王道！',
      '希望這篇文章能幫助你在健身路上少走彎路。',
      '有任何問題歡迎留言討論，一起變得更強壯！',
    ],
  },
  fashion: {
    intro: [
      '穿搭是一種自我表達，找到適合自己的風格能大幅提升自信。',
      '時尚不是盲目追隨潮流，而是了解什麼適合自己。',
      '好的穿搭不一定昂貴，重點是懂得搭配和選擇。',
    ],
    importance: [
      '合適的穿搭能為你的第一印象加分，無論是工作還是社交場合。',
      '了解自己的身形和膚色，才能選對適合的款式和顏色。',
      '投資在經典單品上，能讓你的衣櫃更有質感。',
    ],
    tips: [
      ['了解自己的身形優缺點', '建立基本的經典單品', '注意服裝的材質和做工'],
      ['學習基本的色彩搭配', '參考時尚部落客但保持自我', '選擇適合場合的穿著'],
      ['定期整理衣櫃淘汰不穿的', '嘗試不同風格找出最適合的', '注意細節如配件和鞋子'],
    ],
    recommendations: [
      { title: '百搭經典款', description: '永不退流行的基本單品，一件可以穿好幾年' },
      { title: '當季流行款', description: '緊跟潮流的時髦單品，為穿搭增添新鮮感' },
      { title: '高CP值選擇', description: '品質與價格兼具，小資族的聰明選擇' },
    ],
    faqs: [
      { q: '如何找到適合自己的風格？', a: '多嘗試不同風格，觀察什麼穿起來最舒服自在。' },
      { q: '預算有限怎麼穿出質感？', a: '投資在基本款上，用配件創造變化，注重整體搭配。' },
      { q: '網購衣服怎麼避免踩雷？', a: '仔細看尺寸表、參考買家秀、選擇有退換貨服務的店家。' },
    ],
    conclusion: [
      '時尚是態度，自信是最好的裝飾品！',
      '希望這篇文章能給你一些穿搭靈感。',
      '有任何穿搭問題歡迎留言討論交流！',
    ],
  },
  home: {
    intro: [
      '家是最放鬆的地方，打造舒適的居家環境是提升生活品質的關鍵。',
      '好的居家用品不只是功能性，更能為生活帶來幸福感。',
      '在有限的空間和預算下，聰明選擇能讓家變得更美好。',
    ],
    importance: [
      '居家用品是每天都會使用的，選對產品能大幅提升生活便利性。',
      '品質好的產品使用壽命長，長期來看反而更省錢。',
      '舒適的居家環境能讓身心都得到放鬆和療癒。',
    ],
    tips: [
      ['評估實際使用需求', '測量空間確認尺寸', '比較不同品牌的功能和價格'],
      ['注意能源效率和耗材成本', '確認保固和售後服務', '參考使用者真實評價'],
      ['考慮整體空間的搭配', '選擇好清潔保養的材質', '預留未來升級的空間'],
    ],
    recommendations: [
      { title: '小坪數首選', description: '體積小巧但功能齊全，適合空間有限的租屋族' },
      { title: '家庭實用款', description: '容量大、耐用度高，適合有小孩的家庭使用' },
      { title: '質感生活款', description: '設計美觀有品味，為居家增添風格' },
    ],
    faqs: [
      { q: '怎麼選擇適合的尺寸？', a: '先測量預定擺放位置，預留操作和散熱空間。' },
      { q: '網購大型家電要注意什麼？', a: '確認是否含安裝、配送範圍、電壓規格是否相符。' },
      { q: '如何延長使用壽命？', a: '定期清潔保養、正確使用、避免超載運作。' },
    ],
    conclusion: [
      '家是最值得投資的地方，希望這篇文章對你有幫助！',
      '打造理想的居家環境需要時間，慢慢來不急。',
      '有任何問題歡迎留言討論，一起打造舒適的家！',
    ],
  },
}

// Default template for unknown categories
const DEFAULT_TEMPLATE = {
  intro: [
    '在眾多選擇中找到最適合自己的，是每個人都會面臨的課題。',
    '做好功課、了解需求，才能做出不後悔的決定。',
    '本文將帶你深入了解相關知識，幫助你做出最佳選擇。',
  ],
  importance: [
    '選對產品能節省時間和金錢，避免不必要的嘗試成本。',
    '了解正確的資訊能幫助你做出更明智的決定。',
    '投資在適合的選擇上，是對自己最好的照顧。',
  ],
  tips: [
    ['了解自己的實際需求', '比較不同選擇的優缺點', '參考他人的使用經驗'],
    ['注意品質和耐用度', '考慮長期使用成本', '選擇有保障的品牌'],
    ['不要只看價格', '實際體驗後再決定', '保留購買證明'],
  ],
  recommendations: [
    { title: '入門推薦', description: '適合新手的基本選擇，功能實用價格親民' },
    { title: '人氣熱銷', description: '市場上最受歡迎的選擇，口碑有保證' },
    { title: '進階首選', description: '適合有經驗者的升級選擇，品質更上一層' },
  ],
  faqs: [
    { q: '如何判斷品質好壞？', a: '注意材質、做工、品牌信譽和使用者評價。' },
    { q: '在哪裡購買最有保障？', a: '選擇有信譽的通路，確認是否有保固服務。' },
    { q: '使用上有什麼注意事項？', a: '詳閱說明書，按照建議方式使用和保養。' },
  ],
  conclusion: [
    '希望這篇文章能幫助你做出最適合的選擇！',
    '如果有任何問題，歡迎在下方留言討論。',
    '祝你找到最滿意的答案！',
  ],
}

// Generate SEO-optimized blog title
export async function generateBlogTitle(keyword: string, category: string): Promise<string[]> {
  const year = new Date().getFullYear()

  // Collect titles from all styles
  const allTitles: string[] = []
  Object.values(TITLE_STYLES).forEach(styleFn => {
    allTitles.push(...styleFn(keyword, year))
  })

  // Shuffle and return top 5
  return shuffleArray(allTitles).slice(0, 5)
}

// Generate SEO meta description
export function generateMetaDescription(title: string, keyword: string): string {
  const templates = [
    `想了解${keyword}？本文提供最完整的${keyword}推薦指南，包含選購技巧、品牌比較、價格分析，幫助你做出最佳選擇。`,
    `${keyword}怎麼選？專家整理的完整攻略，從入門到進階一次搞懂，讓你不再選擇困難！`,
    `最新${keyword}推薦！網友真實評價、專業分析、價格比較，一篇文章解決你所有疑問。`,
    `還在煩惱${keyword}該怎麼挑？這篇完整指南告訴你選購重點，輕鬆找到最適合的選擇。`,
  ]
  return randomPick(templates)
}

// Generate full blog content
export async function generateBlogContent(request: GenerationRequest): Promise<ContentResponse> {
  const { keyword, category } = request
  const currentYear = new Date().getFullYear()

  // Get category-specific template or default
  const template = CATEGORY_TEMPLATES[category] || DEFAULT_TEMPLATE

  // Generate titles and pick one
  const titles = await generateBlogTitle(keyword, category)
  const title = titles[0]

  // Build content with randomization
  const content = buildContent(keyword, category, template, currentYear)

  return {
    success: true,
    title,
    metaDescription: generateMetaDescription(title, keyword),
    content,
  }
}

function buildContent(
  keyword: string,
  category: string,
  template: typeof DEFAULT_TEMPLATE,
  year: number
): string {
  const intro = randomPick(template.intro)
  const importance = randomPick(template.importance)
  const tips = randomPick(template.tips)
  const recommendations = shuffleArray(template.recommendations)
  const faqs = shuffleArray(template.faqs).slice(0, 3)
  const conclusion = randomPick(template.conclusion)

  return `## 前言

${intro}在${year}年，關於「${keyword}」的討論越來越熱門，本文將為你完整解析。

## 為什麼要了解${keyword}？

${importance}

根據最新調查，超過 70% 的消費者在做決定前會詳細研究相關資訊。了解${keyword}的相關知識，能幫助你：

- 節省不必要的嘗試成本
- 避免常見的選擇錯誤
- 找到真正適合自己的選項

## ${keyword}選擇要點

### 重點一：基本考量

選擇${keyword}時，首先要考慮以下幾點：

- **${tips[0]}**
- **${tips[1]}**
- **${tips[2]}**

### 重點二：進階評估

除了基本考量，進階使用者還可以注意：

| 評估項目 | 說明 | 重要程度 |
|---------|------|---------|
| 品質 | 使用的材質和做工精細度 | ⭐⭐⭐⭐⭐ |
| 價格 | 是否符合預算和性價比 | ⭐⭐⭐⭐ |
| 口碑 | 其他使用者的真實評價 | ⭐⭐⭐⭐ |
| 服務 | 售後服務和保固條款 | ⭐⭐⭐ |

### 重點三：常見迷思

許多人在選擇${keyword}時容易陷入以下迷思：

1. **價格越高越好** — 其實不然，重點是適不適合自己
2. **品牌越大越好** — 有時小眾品牌反而更專精
3. **功能越多越好** — 用不到的功能只是浪費錢

## ${keyword}推薦

以下是${year}年最值得考慮的幾個選擇：

### ${recommendations[0].title}

${recommendations[0].description}

**適合對象：** 剛開始接觸的新手、預算有限的使用者

**優點：**
- 上手容易，學習成本低
- 價格親民，入門無負擔
- 基本功能齊全

**缺點：**
- 進階功能較少
- 可能需要未來升級

### ${recommendations[1].title}

${recommendations[1].description}

**適合對象：** 有一定經驗、追求更好體驗的使用者

**優點：**
- 功能完整，使用體驗佳
- 品質穩定，耐用度高
- 性價比優良

**缺點：**
- 價格稍高
- 需要一些學習時間

### ${recommendations[2].title}

${recommendations[2].description}

**適合對象：** 專業使用者、追求極致體驗者

**優點：**
- 頂級品質，極致體驗
- 功能強大，滿足各種需求
- 耐用持久，長期投資

**缺點：**
- 價格較高
- 可能有學習曲線

## 常見問題 FAQ

### Q1: ${faqs[0].q}

${faqs[0].a}

### Q2: ${faqs[1].q}

${faqs[1].a}

### Q3: ${faqs[2].q}

${faqs[2].a}

## 結語

${conclusion}

選擇${keyword}沒有標準答案，最重要的是找到適合自己的。希望這篇文章能給你一些方向和靈感。

如果覺得這篇文章有幫助，歡迎分享給需要的朋友！有任何問題也歡迎在下方留言討論。

---

*本文最後更新時間：${year}年${new Date().getMonth() + 1}月*

*免責聲明：本文僅供參考，實際選擇請依個人需求評估。*`
}

// Export content to different formats
export function exportToMarkdown(title: string, content: string): string {
  return `# ${title}\n\n${content}`
}

export function exportToHTML(title: string, content: string): string {
  let html = content
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <article>
    <h1>${title}</h1>
    <p>${html}</p>
  </article>
</body>
</html>`
}
