# 人生配置 × 魂环配置（MVP）

一个基于 Next.js 16 的 Web 技术站原型：将用户的人生多维配置映射到斗罗风格的第 1~9 魂环，输出年限、颜色、置信度、风险提示和行动建议。

## 核心能力

- 12 维人生配置输入（含学业底盘、财富力、社会位阶、精神力、热爱清晰度等）
- 三层评分：
  - 规则评分（维度硬约束）
  - 向量匹配（余弦 + 曼哈顿 + 标签重合）
  - 置信度评估（规则分/向量分差值）
- 魂环输出：
  - 第 1~9 环
  - 年限与颜色（白/黄/紫/黑/红）
  - 越级吸收机制（高分 + 高精神力 + 高风险承受可触发）

## 技术栈

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS 4
- Route Handler API（`/api/evaluate`）

## 运行方式

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 目录结构（关键文件）

- `src/lib/domain.ts`：维度模型、魂环模板、默认输入
- `src/lib/engine.ts`：评分引擎、年限计算、风险提示
- `src/app/api/evaluate/route.ts`：评估接口
- `src/components/life-configurator.tsx`：交互表单与结果展示
- `src/app/page.tsx`：首页入口
