export type DimensionTag = "mind" | "career" | "life" | "destiny";

export interface DimensionDefinition {
  key: string;
  label: string;
  description: string;
  tag: DimensionTag;
}

export const DIMENSIONS = [
  {
    key: "academicFoundation",
    label: "学业底盘",
    description: "覆盖小学到高中阶段的学习基础和稳定性",
    tag: "mind",
  },
  {
    key: "cognitiveStrength",
    label: "认知力",
    description: "抽象思考、信息吸收和问题拆解能力",
    tag: "mind",
  },
  {
    key: "executionPower",
    label: "执行力",
    description: "把目标推进到结果的持续行动能力",
    tag: "career",
  },
  {
    key: "wealthPotential",
    label: "财富力",
    description: "收入增长、资产积累和现金流管理能力",
    tag: "career",
  },
  {
    key: "socialStatus",
    label: "社会位阶",
    description: "职业层级、社会认可度和资源可及性",
    tag: "career",
  },
  {
    key: "influencePower",
    label: "影响力",
    description: "跨圈层影响、表达力与协作带动能力",
    tag: "career",
  },
  {
    key: "mentalResilience",
    label: "精神力",
    description: "抗压、自我修复和长期意志稳定度",
    tag: "life",
  },
  {
    key: "physicalVitality",
    label: "体能根基",
    description: "睡眠、运动和身体状态的长期可持续性",
    tag: "life",
  },
  {
    key: "relationshipSupport",
    label: "关系支持",
    description: "家庭、伴侣、朋友与团队支持强度",
    tag: "life",
  },
  {
    key: "riskTolerance",
    label: "风险承受",
    description: "面对不确定性时的承担和恢复能力",
    tag: "destiny",
  },
  {
    key: "passionClarity",
    label: "热爱清晰度",
    description: "是否找到长期愿意投入的兴趣方向",
    tag: "destiny",
  },
  {
    key: "missionSense",
    label: "使命感",
    description: "目标和个人价值的一致程度",
    tag: "destiny",
  },
] as const satisfies readonly DimensionDefinition[];

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];
export type DimensionMap = Record<DimensionKey, number>;

export interface LifeFactors {
  weeklyCommitment: number;
  challengeDifficulty: number;
  outcomeQuality: number;
  habitConsistency: number;
}

export interface LifeInput {
  profileName: string;
  age: number;
  goal: string;
  dimensions: DimensionMap;
  factors: LifeFactors;
}

export interface RingTemplate {
  index: number;
  name: string;
  subtitle: string;
  baseYears: number;
  cap: {
    min: number;
    max: number;
  };
  focus: readonly DimensionKey[];
  tags: readonly DimensionTag[];
  vector: readonly number[];
  skillPool: readonly string[];
}

export const RING_TEMPLATES: readonly RingTemplate[] = [
  {
    index: 1,
    name: "觉醒之环",
    subtitle: "自我定位与方向感",
    baseYears: 423,
    cap: { min: 10, max: 423 },
    focus: ["passionClarity", "missionSense", "mentalResilience"],
    tags: ["destiny", "mind"],
    vector: [0.45, 0.5, 0.45, 0.3, 0.3, 0.35, 0.6, 0.45, 0.45, 0.5, 0.75, 0.8],
    skillPool: [
      "完成一份个人价值观清单（20条）",
      "明确未来12个月唯一主线目标",
      "建立每日15分钟复盘仪式",
    ],
  },
  {
    index: 2,
    name: "基石之环",
    subtitle: "学业底盘与认知搭建",
    baseYears: 764,
    cap: { min: 100, max: 764 },
    focus: ["academicFoundation", "cognitiveStrength", "executionPower"],
    tags: ["mind", "career"],
    vector: [0.8, 0.75, 0.65, 0.35, 0.35, 0.35, 0.5, 0.5, 0.45, 0.4, 0.45, 0.45],
    skillPool: [
      "按周输出学习成果清单（不少于3项）",
      "构建一套可复用的学习方法论模板",
      "每周进行一次错题与知识盲区回收",
    ],
  },
  {
    index: 3,
    name: "习惯之环",
    subtitle: "执行节律与稳定推进",
    baseYears: 1800,
    cap: { min: 1000, max: 1800 },
    focus: ["executionPower", "mentalResilience", "physicalVitality"],
    tags: ["career", "life"],
    vector: [0.6, 0.6, 0.85, 0.45, 0.4, 0.45, 0.7, 0.7, 0.55, 0.5, 0.45, 0.5],
    skillPool: [
      "建立早晚双复盘机制并持续30天",
      "固定每周3次深度训练时段",
      "执行-反馈-优化三段式任务闭环",
    ],
  },
  {
    index: 4,
    name: "技能之环",
    subtitle: "核心能力与职业武学",
    baseYears: 5000,
    cap: { min: 3000, max: 5000 },
    focus: ["cognitiveStrength", "executionPower", "socialStatus"],
    tags: ["mind", "career"],
    vector: [0.65, 0.8, 0.85, 0.55, 0.6, 0.6, 0.6, 0.55, 0.55, 0.5, 0.5, 0.55],
    skillPool: [
      "打造1项可对外展示的标志性作品",
      "完成一次跨领域技能整合实践",
      "用公开输出巩固专业认知护城河",
    ],
  },
  {
    index: 5,
    name: "财富之环",
    subtitle: "财富增长与资产驾驭",
    baseYears: 12000,
    cap: { min: 10000, max: 15000 },
    focus: ["wealthPotential", "executionPower", "riskTolerance"],
    tags: ["career", "destiny"],
    vector: [0.55, 0.6, 0.8, 0.9, 0.65, 0.7, 0.6, 0.55, 0.55, 0.75, 0.5, 0.6],
    skillPool: [
      "建立个人资产负债与现金流月度看板",
      "形成至少2条非单一收入来源",
      "完成一次可复用的风险-收益决策复盘",
    ],
  },
  {
    index: 6,
    name: "地位之环",
    subtitle: "位阶跃迁与社会认可",
    baseYears: 25000,
    cap: { min: 20000, max: 30000 },
    focus: ["socialStatus", "influencePower", "relationshipSupport"],
    tags: ["career", "life"],
    vector: [0.55, 0.65, 0.75, 0.75, 0.9, 0.9, 0.65, 0.55, 0.75, 0.65, 0.55, 0.7],
    skillPool: [
      "完成一次关键场景下的影响力发言",
      "构建个人高质量关系网络清单",
      "将个人方法沉淀为可复制协作机制",
    ],
  },
  {
    index: 7,
    name: "心性之环",
    subtitle: "精神韧性与生命平衡",
    baseYears: 50000,
    cap: { min: 30000, max: 50000 },
    focus: ["mentalResilience", "physicalVitality", "relationshipSupport"],
    tags: ["life", "destiny"],
    vector: [0.55, 0.6, 0.65, 0.6, 0.6, 0.65, 0.95, 0.9, 0.85, 0.65, 0.6, 0.75],
    skillPool: [
      "将情绪触发点整理成可执行应对清单",
      "重构作息与运动系统，保持连续90天",
      "建立关键关系的双周深度沟通仪式",
    ],
  },
  {
    index: 8,
    name: "热爱之环",
    subtitle: "热爱深化与长期投入",
    baseYears: 100000,
    cap: { min: 50000, max: 100000 },
    focus: ["passionClarity", "missionSense", "influencePower"],
    tags: ["destiny", "career"],
    vector: [0.6, 0.65, 0.75, 0.65, 0.7, 0.85, 0.8, 0.65, 0.65, 0.7, 0.95, 0.95],
    skillPool: [
      "围绕热爱方向打造长期内容或作品系列",
      "建立可持续的产出-反馈飞轮",
      "将个人热爱转化为可衡量影响力",
    ],
  },
  {
    index: 9,
    name: "传承之环",
    subtitle: "巅峰影响与价值传承",
    baseYears: 150000,
    cap: { min: 100000, max: 300000 },
    focus: ["missionSense", "influencePower", "wealthPotential", "relationshipSupport"],
    tags: ["destiny", "career", "life"],
    vector: [0.65, 0.75, 0.8, 0.8, 0.85, 0.98, 0.85, 0.7, 0.85, 0.8, 0.95, 0.98],
    skillPool: [
      "形成可复制的方法论并培养后继者",
      "建立跨周期的价值网络与资产体系",
      "完成一次对社会有明确贡献的长期项目",
    ],
  },
];

export const DEFAULT_INPUT: LifeInput = {
  profileName: "匿名魂师",
  age: 24,
  goal: "在未来3年形成稳定成长路径，并实现能力与财富双突破。",
  dimensions: {
    academicFoundation: 62,
    cognitiveStrength: 67,
    executionPower: 58,
    wealthPotential: 52,
    socialStatus: 46,
    influencePower: 50,
    mentalResilience: 60,
    physicalVitality: 55,
    relationshipSupport: 57,
    riskTolerance: 53,
    passionClarity: 64,
    missionSense: 61,
  },
  factors: {
    weeklyCommitment: 66,
    challengeDifficulty: 60,
    outcomeQuality: 58,
    habitConsistency: 54,
  },
};

