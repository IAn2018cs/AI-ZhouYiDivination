require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const svg2img = require('svg2img');
const expressIp = require('express-ip');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { system_prompt } = require('../config/prompt_config');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const LLM_API_ENDPOINT = process.env.LLM_API_ENDPOINT;
const LLM_API_KEY = process.env.LLM_API_KEY;

// 使用 express-ip 中间件
app.use(expressIp().getIpInfoMiddleware);

// 创建一个内存存储的限速器
const rateLimiter = new RateLimiterMemory({
  points: 5, // 每个 IP 每天允许的请求次数
  duration: 24 * 60 * 60, // 24小时
});

// 创建一个中间件来检查和更新请求次数
const rateLimitMiddleware = async (req, res, next) => {
  // 尝试获取真实 IP
  const clientIp = req.headers['x-forwarded-for'] || req.ipInfo.ip || req.ip;
  try {
    await rateLimiter.consume(clientIp);
    next();
  } catch (rejRes) {
    res.status(429).json({ error: '今日请求次数已达上限,请明天再试' });
  }
};

// 在 /divinate 路由中使用这个中间件
app.post('/divinate', rateLimitMiddleware, async (req, res) => {
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
    let svgCode = svgMatch ? svgMatch[1].trim() : null;

    if (svgCode) {
      // 假设原始 SVG 尺寸为 400x600，我们将其放大到 800x1200
      svg2img(svgCode,
        {
          format: 'png',
          resvg: {
            fitTo: {
              mode: 'width', // or height
              value: 800,
            }
          },
          font: {
            fontFiles: [path.join(__dirname, '..', 'fonts', 'yang_medium.ttf')], // Load custom fonts.
            loadSystemFonts: false, // It will be faster to disable loading system fonts.
            // defaultFontFamily: 'Source Han Serif CN Light', // You can omit this.
          }
        },
        async (error, buffer) => {
          if (error) {
            console.error('SVG 转换错误:', error);
            res.status(500).json({ error: '图片生成失败' });
          } else {
            // 将 PNG 图片作为 base64 字符串发送
            const base64Image = buffer.toString('base64');
            res.json({ image: `data:image/png;base64,${base64Image}` });
          }
        });
    } else {
      res.status(500).json({ error: '无法生成图片' });
    }
  } catch (error) {
    console.error('占卜过程出错:', error);
    res.status(500).json({ error: '占卜失败' });
  }
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
