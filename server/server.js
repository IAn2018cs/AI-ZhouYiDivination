require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const LLM_API_ENDPOINT = process.env.LLM_API_ENDPOINT;
const LLM_API_KEY = process.env.LLM_API_KEY;

const system_prompt = `"""
设定如下内容为你的 *System Prompt*

运行规则
1. 启动时必须运行 (start) 函数
2. 之后调用主函数 (周易占卜 用户问题)
3. 把svg图片画出来
"""
# 用途: 基于周易八卦为用户提供智慧指引

class 周易大师:
    """你是精通周易的占卜大师,洞察力敏锐,解读深刻,语言充满智慧"""
    风格 = ["孔子", "老子", "庄子"]
    擅长 = "洞察本质"
    表达 = "寓意深远"
    智慧 = "古今贯通"

def 周易占卜(用户问题):
    """你会运用周易八卦来解读用户的问题"""
    
    def 卜卦(问题):
        print(f"步骤1: 为'{问题}'卜一卦")
        # 实现卜卦的逻辑
        return f"为'{问题}'所卜之卦是..."

    def 解卦象(卦象):
        print(f"步骤2: 解读'{卦象}'的卦象")
        # 实现解卦象的逻辑
        return f"此卦象显示..."

    def 阐释爻辞(卦象):
        print(f"步骤3: 阐释'{卦象}'的爻辞")
        # 实现阐释爻辞的逻辑
        return f"爻辞曰：..."

    def 现实映射(解读):
        print(f"步骤4: 将'{解读}'映射到现实")
        # 实现现实映射的逻辑
        return f"在现实中，这意味着..."

    def 智慧总结(解读):
        print(f"步骤5: 对'{解读}'进行智慧总结")
        # 实现智慧总结的逻辑
        return f"总结：{解读}"

    print(f"开始为问题占卜：'{用户问题}'")
    
    卦象 = 卜卦(用户问题)
    解读 = 解卦象(卦象)
    爻辞 = 阐释爻辞(卦象)
    现实 = 现实映射(解读)
    总结 = 智慧总结(现实)

    print("占卜完成")
    
    return SVG_Card(总结)


def SVG_Card(解释, 卦象):
    """输出SVG 卡片"""
    design_rule = "突出传统八卦图样式，保持整体设计的典雅和神秘感"
    design_principles = ["传统", "金属质感", "立体感", "精细"]
    
    画布 = {"宽度": 400, "高度": 600, "边距": 20}
    标题字体 = "楷体"
    自动缩放 = {"最小字号": 14}
    
    配色风格 = {
        "背景色": "黑色",
        "主要元素": ["深棕色", "古铜色"]
    }
    
 
 具体卦象 = {
        "位置": "卡片中央",
        "大小": "占据卡片宽度的50%",
        "样式": "根据卜出的卦象绘制对应的六爻图案"
    }
 
 羊皮纸纹理 = """<filter id="paper-texture" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
      <feDiffuseLighting in="noise" lighting-color="#f4e9d9" surfaceScale="2">
        <feDistantLight azimuth="45" elevation="60"/>
      </feDiffuseLighting>
    </filter>"""
    
    卡片元素 = [
        "f整体背景: "{羊皮纸纹理}, 细节丰富，带褶皱"
        "标题('周易占卜')",
  "分隔线",
  f"排版输出({用户问题})",
  "分隔线",
        f"卦象名称({卦象})",
  f"绘制具体卦象形状({具体卦象})(粗体)",
        "水平居中: 用中国古文，精炼的解释文本(深棕色)",
  "总结 (深棕色)",
  "分隔线 (虚线)",
  "文本: 天机难测, 此卦仅供参考",
  "Footer文本，靠右对齐: -- Powered by IAn2018",
        "装饰边框(古铜色)"
    ]
    
    # 实现SVG卡片生成的逻辑
    pass

def start():
    """启动时运行"""
    system_role = 周易大师()
    print("请说出你的问题，让我为你卜上一卦。")

# 运行规则
# 1. 启动时必须运行 start() 函数
# 2. 之后调用主函数 周易占卜(用户问题)
# 3. 输出 SVG 代码，用带模块包裹(\`\`\`)

if __name__ == "__main__":
    start()
    用户问题 = input()  # 获取用户输入
    结果 = 周易占卜(用户问题)
    print(f"周易智慧：{结果}")`;


// 预制的 SVG 内容
const presetSvg = `
<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="paper-texture" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
      <feDiffuseLighting in="noise" lighting-color="#f4e9d9" surfaceScale="2">
        <feDistantLight azimuth="45" elevation="60"/>
      </feDiffuseLighting>
    </filter>
  </defs>
  
  <!-- 背景 -->
  <rect width="100%" height="100%" fill="#000000"/>
  <rect width="380" height="580" x="10" y="10" fill="#f4e9d9" filter="url(#paper-texture)"/>
  
  <!-- 装饰边框 -->
  <rect width="390" height="590" x="5" y="5" fill="none" stroke="#cd7f32" stroke-width="2"/>
  
  <!-- 标题 -->
  <text x="200" y="50" font-family="楷体" font-size="24" fill="#8B4513" text-anchor="middle">周易占卜</text>
  
  <!-- 分隔线 -->
  <line x1="40" y1="70" x2="360" y2="70" stroke="#8B4513" stroke-width="1"/>
  
  <!-- 用户问题 -->
  <text x="200" y="100" font-family="楷体" font-size="18" fill="#8B4513" text-anchor="middle">今天适合发版吗？</text>
  
  <!-- 分隔线 -->
  <line x1="40" y1="120" x2="360" y2="120" stroke="#8B4513" stroke-width="1"/>
  
  <!-- 卦象名称 -->
  <text x="200" y="150" font-family="楷体" font-size="20" fill="#8B4513" text-anchor="middle" font-weight="bold">水山蹇卦</text>
  
  <!-- 具体卦象 -->
  <g transform="translate(160, 180)">
    <line x1="0" y1="0" x2="80" y2="0" stroke="#8B4513" stroke-width="4"/>
    <line x1="0" y1="20" x2="40" y2="20" stroke="#8B4513" stroke-width="4"/>
    <line x1="0" y1="40" x2="80" y2="40" stroke="#8B4513" stroke-width="4"/>
    <line x1="0" y1="60" x2="40" y2="60" stroke="#8B4513" stroke-width="4"/>
    <line x1="0" y1="80" x2="80" y2="80" stroke="#8B4513" stroke-width="4"/>
    <line x1="0" y1="100" x2="40" y2="100" stroke="#8B4513" stroke-width="4"/>
  </g>
  
  <!-- 解释文本 -->
  <text x="40" y="320" font-family="楷体" font-size="16" fill="#8B4513">
    <tspan x="40" dy="0">蹇，难也，险在前也。见险而能止，智矣哉！</tspan>
    <tspan x="40" dy="25">君子以反身修德。</tspan>
  </text>
  
  <!-- 总结 -->
  <text x="40" y="400" font-family="楷体" font-size="16" fill="#8B4513">
    <tspan x="40" dy="0">今日发版恐有阻碍，宜谨慎行事。</tspan>
    <tspan x="40" dy="25">建议先自省检查，完善准备工作。</tspan>
    <tspan x="40" dy="25">待时机成熟，方可顺利推进。</tspan>
  </text>
  
  <!-- 分隔线 -->
  <line x1="40" y1="480" x2="360" y2="480" stroke="#8B4513" stroke-width="1" stroke-dasharray="5,5"/>
  
  <!-- 提示文本 -->
  <text x="200" y="510" font-family="楷体" font-size="14" fill="#8B4513" text-anchor="middle">天机难测，此卦仅供参考</text>
  
  <!-- Footer -->
  <text x="360" y="550" font-family="楷体" font-size="12" fill="#8B4513" text-anchor="end">-- Powered by 海外PC团队</text>
</svg>
`;

app.post('/divinate', async (req, res) => {
  try {
    const { question } = req.body;
    
    // 调用 LLM API
    const llmResponse = await axios.post(LLM_API_ENDPOINT, {
      model: "claude-3-5-sonnet-20240620",
      messages: [
        {
          role: "system",
          content: system_prompt
        },
        {
          role: "user",
          content: `${question}`
        }
      ],
      temperature: 0.6
    }, {
      headers: {
        'Authorization': `Bearer ${LLM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // 从 LLM 响应中提取 SVG 代码
    const svgMatch = llmResponse.data.choices[0].message.content.match(/```svg([\s\S]*?)```/);
    const svgCode = svgMatch ? svgMatch[1].trim() : null;

    if (svgCode) {
      res.json({ svg: svgCode });
    } else {
      res.status(500).json({ error: '无法生成 SVG' });
    }
  } catch (error) {
    console.error('占卜过程出错:', error);
    res.status(500).json({ error: '占卜失败' });
  }
});

// 新的测试接口
app.post('/divinate-test', (req, res) => {
    // 忽略输入的问题，直接返回预制的 SVG
    res.json({ svg: presetSvg });
});

// 提供静态文件
app.use(express.static(path.join(__dirname, '../dist')));

// 处理所有路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
