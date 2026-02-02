import { TrendingKeyword, Category } from '@/types'

// Predefined categories with Chinese support
export const CATEGORIES: Category[] = [
  {
    id: 'pets',
    name: '寵物',
    nameEn: 'Pets',
    icon: '🐾',
    description: '寵物飼養、寵物食品、寵物用品等相關內容',
  },
  {
    id: 'beauty',
    name: '美妝',
    nameEn: 'Beauty',
    icon: '💄',
    description: '化妝品、保養品、美容技巧等相關內容',
  },
  {
    id: 'food',
    name: '美食',
    nameEn: 'Food',
    icon: '🍜',
    description: '美食推薦、食譜、餐廳評價等相關內容',
  },
  {
    id: 'tech',
    name: '科技',
    nameEn: 'Technology',
    icon: '💻',
    description: '3C產品、軟體應用、科技新知等相關內容',
  },
  {
    id: 'travel',
    name: '旅遊',
    nameEn: 'Travel',
    icon: '✈️',
    description: '旅遊景點、住宿推薦、旅行攻略等相關內容',
  },
  {
    id: 'fitness',
    name: '健身',
    nameEn: 'Fitness',
    icon: '💪',
    description: '運動健身、營養補給、健康生活等相關內容',
  },
  {
    id: 'fashion',
    name: '時尚',
    nameEn: 'Fashion',
    icon: '👗',
    description: '服飾穿搭、流行趨勢、配件推薦等相關內容',
  },
  {
    id: 'home',
    name: '居家',
    nameEn: 'Home',
    icon: '🏠',
    description: '居家佈置、家電推薦、生活用品等相關內容',
  },
]

// Trending keywords database (simulated - in production, integrate with Google Trends API)
const TRENDING_KEYWORDS_DB: Record<string, TrendingKeyword[]> = {
  pets: [
    { keyword: '貓咪飼料推薦', searchVolume: 8500, trend: 'rising', relatedQueries: ['貓糧品牌', '貓咪營養', '幼貓飼料'] },
    { keyword: '狗狗零食', searchVolume: 6200, trend: 'rising', relatedQueries: ['狗零食推薦', '狗狗獎勵', '健康狗零食'] },
    { keyword: '寵物美容', searchVolume: 5800, trend: 'stable', relatedQueries: ['寵物洗澡', '寵物剪毛', '寵物SPA'] },
    { keyword: '貓砂推薦', searchVolume: 7200, trend: 'rising', relatedQueries: ['豆腐砂', '礦物砂', '松木砂'] },
    { keyword: '狗狗保健品', searchVolume: 4500, trend: 'rising', relatedQueries: ['關節保養', '狗狗維他命', '寵物益生菌'] },
    { keyword: '寵物保險', searchVolume: 5100, trend: 'rising', relatedQueries: ['寵物醫療', '保險比較', '理賠範圍'] },
    { keyword: '貓跳台', searchVolume: 4800, trend: 'stable', relatedQueries: ['貓傢俱', '貓抓板', '貓窩'] },
    { keyword: '狗狗訓練', searchVolume: 3900, trend: 'stable', relatedQueries: ['狗狗教養', '基本指令', '行為矯正'] },
  ],
  beauty: [
    { keyword: '防曬乳推薦', searchVolume: 12000, trend: 'rising', relatedQueries: ['物理防曬', '化學防曬', '清爽防曬'] },
    { keyword: '精華液推薦', searchVolume: 9500, trend: 'rising', relatedQueries: ['抗老精華', '美白精華', '保濕精華'] },
    { keyword: '粉底液推薦', searchVolume: 8800, trend: 'stable', relatedQueries: ['持妝粉底', '遮瑕粉底', '自然妝感'] },
    { keyword: '面膜推薦', searchVolume: 7600, trend: 'stable', relatedQueries: ['保濕面膜', '美白面膜', '片狀面膜'] },
    { keyword: '眼霜推薦', searchVolume: 6200, trend: 'rising', relatedQueries: ['去黑眼圈', '抗皺眼霜', '眼部保養'] },
    { keyword: '卸妝產品', searchVolume: 5800, trend: 'stable', relatedQueries: ['卸妝油', '卸妝水', '卸妝膏'] },
    { keyword: '唇膏推薦', searchVolume: 7100, trend: 'rising', relatedQueries: ['霧面唇膏', '保濕唇膏', '持久唇彩'] },
    { keyword: '痘痘保養', searchVolume: 8200, trend: 'rising', relatedQueries: ['抗痘產品', '痘疤淡化', '油肌保養'] },
  ],
  food: [
    { keyword: '台北美食推薦', searchVolume: 15000, trend: 'rising', relatedQueries: ['必吃美食', '在地小吃', '網美餐廳'] },
    { keyword: '氣炸鍋食譜', searchVolume: 11000, trend: 'rising', relatedQueries: ['氣炸雞', '氣炸薯條', '健康料理'] },
    { keyword: '咖啡廳推薦', searchVolume: 9200, trend: 'stable', relatedQueries: ['文青咖啡', '不限時咖啡', '咖啡豆推薦'] },
    { keyword: '火鍋推薦', searchVolume: 8500, trend: 'rising', relatedQueries: ['麻辣鍋', '涮涮鍋', '吃到飽火鍋'] },
    { keyword: '甜點推薦', searchVolume: 7800, trend: 'stable', relatedQueries: ['蛋糕店', '下午茶', '法式甜點'] },
    { keyword: '素食餐廳', searchVolume: 6100, trend: 'rising', relatedQueries: ['蔬食料理', '素食吃到飽', '有機餐廳'] },
    { keyword: '早午餐推薦', searchVolume: 7200, trend: 'stable', relatedQueries: ['brunch', '早餐店', '週末早午餐'] },
    { keyword: '日式料理', searchVolume: 8900, trend: 'rising', relatedQueries: ['壽司推薦', '拉麵推薦', '居酒屋'] },
  ],
  tech: [
    { keyword: '手機推薦', searchVolume: 18000, trend: 'rising', relatedQueries: ['iPhone', 'Android', '性價比手機'] },
    { keyword: '筆電推薦', searchVolume: 14000, trend: 'stable', relatedQueries: ['輕薄筆電', '電競筆電', '文書筆電'] },
    { keyword: '耳機推薦', searchVolume: 11000, trend: 'rising', relatedQueries: ['無線耳機', '降噪耳機', '運動耳機'] },
    { keyword: 'AI工具推薦', searchVolume: 9500, trend: 'rising', relatedQueries: ['ChatGPT', 'AI繪圖', 'AI寫作'] },
    { keyword: '平板推薦', searchVolume: 8200, trend: 'stable', relatedQueries: ['iPad', 'Android平板', '繪圖平板'] },
    { keyword: '智慧手錶', searchVolume: 7600, trend: 'rising', relatedQueries: ['Apple Watch', '運動手環', '健康監測'] },
    { keyword: '螢幕推薦', searchVolume: 6800, trend: 'stable', relatedQueries: ['電競螢幕', '4K螢幕', '護眼螢幕'] },
    { keyword: '藍牙喇叭', searchVolume: 5400, trend: 'stable', relatedQueries: ['隨身喇叭', '派對喇叭', '音質推薦'] },
  ],
  travel: [
    { keyword: '日本旅遊', searchVolume: 22000, trend: 'rising', relatedQueries: ['東京自由行', '大阪攻略', '日本機票'] },
    { keyword: '韓國旅遊', searchVolume: 16000, trend: 'rising', relatedQueries: ['首爾景點', '韓國美食', '明洞購物'] },
    { keyword: '泰國旅遊', searchVolume: 12000, trend: 'rising', relatedQueries: ['曼谷自由行', '普吉島', '泰國簽證'] },
    { keyword: '國內旅遊', searchVolume: 9500, trend: 'stable', relatedQueries: ['台灣景點', '民宿推薦', '露營推薦'] },
    { keyword: '溫泉推薦', searchVolume: 7200, trend: 'rising', relatedQueries: ['北投溫泉', '礁溪溫泉', '溫泉飯店'] },
    { keyword: '親子旅遊', searchVolume: 8100, trend: 'stable', relatedQueries: ['親子飯店', '兒童遊樂', '寓教於樂'] },
    { keyword: '背包客住宿', searchVolume: 5800, trend: 'stable', relatedQueries: ['青年旅館', '便宜住宿', '沙發衝浪'] },
    { keyword: '自駕旅遊', searchVolume: 6500, trend: 'rising', relatedQueries: ['租車推薦', '公路旅行', '環島行程'] },
  ],
  fitness: [
    { keyword: '健身房推薦', searchVolume: 11000, trend: 'rising', relatedQueries: ['連鎖健身房', '私人教練', '健身器材'] },
    { keyword: '蛋白粉推薦', searchVolume: 8500, trend: 'rising', relatedQueries: ['乳清蛋白', '植物蛋白', '增肌飲食'] },
    { keyword: '居家運動', searchVolume: 9200, trend: 'stable', relatedQueries: ['徒手訓練', 'HIIT', '瑜珈'] },
    { keyword: '減脂飲食', searchVolume: 10000, trend: 'rising', relatedQueries: ['低碳飲食', '168斷食', '減肥食譜'] },
    { keyword: '跑步裝備', searchVolume: 6200, trend: 'stable', relatedQueries: ['跑鞋推薦', '運動手錶', '跑步服飾'] },
    { keyword: '瑜珈墊推薦', searchVolume: 5100, trend: 'stable', relatedQueries: ['瑜珈用品', '運動墊', '居家瑜珈'] },
    { keyword: '重訓課表', searchVolume: 7800, trend: 'rising', relatedQueries: ['新手健身', '分化訓練', '健身計畫'] },
    { keyword: '運動補給', searchVolume: 5500, trend: 'rising', relatedQueries: ['BCAA', '肌酸', '運動飲料'] },
  ],
  fashion: [
    { keyword: '穿搭推薦', searchVolume: 13000, trend: 'rising', relatedQueries: ['日系穿搭', '韓系穿搭', '簡約風格'] },
    { keyword: '包包推薦', searchVolume: 9800, trend: 'stable', relatedQueries: ['名牌包', '小眾品牌', '托特包'] },
    { keyword: '球鞋推薦', searchVolume: 11000, trend: 'rising', relatedQueries: ['Nike', 'Adidas', '限量球鞋'] },
    { keyword: '飾品推薦', searchVolume: 6500, trend: 'stable', relatedQueries: ['項鍊', '耳環', '戒指'] },
    { keyword: '外套推薦', searchVolume: 8200, trend: 'rising', relatedQueries: ['羽絨外套', '風衣', '皮衣'] },
    { keyword: '牛仔褲推薦', searchVolume: 5800, trend: 'stable', relatedQueries: ['直筒褲', '寬褲', '緊身褲'] },
    { keyword: '太陽眼鏡', searchVolume: 7100, trend: 'rising', relatedQueries: ['墨鏡品牌', '臉型挑選', '偏光鏡片'] },
    { keyword: '手錶推薦', searchVolume: 8500, trend: 'stable', relatedQueries: ['機械錶', '石英錶', '智慧錶'] },
  ],
  home: [
    { keyword: '掃地機器人', searchVolume: 12000, trend: 'rising', relatedQueries: ['掃拖機器人', '小米掃地機', '石頭掃地機'] },
    { keyword: '空氣清淨機', searchVolume: 10500, trend: 'rising', relatedQueries: ['HEPA濾網', '除甲醛', '過敏適用'] },
    { keyword: '床墊推薦', searchVolume: 9200, trend: 'stable', relatedQueries: ['獨立筒', '記憶床墊', '乳膠床墊'] },
    { keyword: '除濕機推薦', searchVolume: 8100, trend: 'rising', relatedQueries: ['壓縮機式', '除濕輪式', '除濕坪數'] },
    { keyword: '電視推薦', searchVolume: 7500, trend: 'stable', relatedQueries: ['4K電視', 'OLED', '大尺寸電視'] },
    { keyword: '冷氣推薦', searchVolume: 11000, trend: 'rising', relatedQueries: ['變頻冷氣', '分離式', '能效等級'] },
    { keyword: '收納用品', searchVolume: 6800, trend: 'stable', relatedQueries: ['收納盒', '衣櫃收納', '斷捨離'] },
    { keyword: '咖啡機推薦', searchVolume: 5900, trend: 'rising', relatedQueries: ['義式咖啡機', '膠囊咖啡', '手沖器具'] },
  ],
}

// Fetch trending keywords for a category
export async function fetchTrendingKeywords(categoryId: string): Promise<TrendingKeyword[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const keywords = TRENDING_KEYWORDS_DB[categoryId]
  if (!keywords) {
    return []
  }

  // Sort by search volume and add some randomization to simulate real-time trends
  return keywords
    .map(kw => ({
      ...kw,
      searchVolume: kw.searchVolume + Math.floor(Math.random() * 500 - 250),
    }))
    .sort((a, b) => b.searchVolume - a.searchVolume)
}

// Get category by ID
export function getCategoryById(categoryId: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === categoryId)
}

// Format search volume for display
export function formatSearchVolume(volume: number): string {
  if (volume >= 10000) {
    return `${(volume / 1000).toFixed(1)}K`
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`
  }
  return volume.toString()
}

// Get trend indicator
export function getTrendIndicator(trend: TrendingKeyword['trend']): { icon: string; color: string; text: string } {
  switch (trend) {
    case 'rising':
      return { icon: '↑', color: 'text-green-500', text: '上升中' }
    case 'declining':
      return { icon: '↓', color: 'text-red-500', text: '下降中' }
    default:
      return { icon: '→', color: 'text-gray-500', text: '穩定' }
  }
}
