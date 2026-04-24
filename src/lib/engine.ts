import {
  DEFAULT_INPUT,
  DIMENSIONS,
  type DimensionKey,
  type DimensionMap,
  type DimensionTag,
  type LifeFactors,
  type LifeInput,
  RING_TEMPLATES,
} from "@/lib/domain";

export type RingColor = "白" | "黄" | "紫" | "黑" | "红";
export type RingType = "精神系" | "战斗系" | "生活系" | "特殊系";
export type Confidence = "低" | "中" | "高";

export interface DominantDimension {
  key: DimensionKey;
  label: string;
  value: number;
  tag: DimensionTag;
}

export interface RingEvaluation {
  index: number;
  name: string;
  subtitle: string;
  type: RingType;
  years: number;
  color: RingColor;
  isBreakthrough: boolean;
  score: {
    rule: number;
    vector: number;
    total: number;
    confidence: Confidence;
  };
  skills: string[];
  risks: string[];
  explanation: string;
}

export interface EvaluationReport {
  profileName: string;
  age: number;
  goal: string;
  profileTitle: string;
  overallScore: number;
  dominantDimensions: DominantDimension[];
  rings: RingEvaluation[];
  createdAt: string;
}

const MIN_DIMENSION = 0;
const MAX_DIMENSION = 100;
const DIMENSION_COUNT = DIMENSIONS.length;

const ACTION_LIBRARY: Record<DimensionKey, string> = {
  academicFoundation: "每周至少2次系统化补基础，输出知识卡片",
  cognitiveStrength: "对关键问题执行“定义-拆解-验证”三步分析",
  executionPower: "把每个目标拆成不超过45分钟的可执行动作",
  wealthPotential: "每月更新资产负债表并复盘现金流波动原因",
  socialStatus: "主动争取高价值任务并沉淀阶段成果",
  influencePower: "每周至少1次公开表达或专业内容输出",
  mentalResilience: "建立压力日志，出现波动时48小时内完成修复动作",
  physicalVitality: "固定每周3次运动和7小时睡眠底线",
  relationshipSupport: "每两周完成一次关键关系深度沟通",
  riskTolerance: "先做小规模试错，再逐步放大投入",
  passionClarity: "持续记录高能量时刻，校准真正热爱方向",
  missionSense: "将长期目标拆成季度主题并量化衡量标准",
};

const clamp = (value: number, min = MIN_DIMENSION, max = MAX_DIMENSION) =>
  Math.min(max, Math.max(min, value));

const toPercent = (value: number) => Math.round(clamp(value, 0, 100));

const normalize = (value: number) => clamp(value) / MAX_DIMENSION;

const factorScale = (value: number) => 0.6 + normalize(value) * 0.8;

function cosineSimilarity(user: number[], target: readonly number[]) {
  const dot = user.reduce((sum, item, idx) => sum + item * target[idx], 0);
  const userNorm = Math.hypot(...user);
  const targetNorm = Math.hypot(...target);

  if (userNorm === 0 || targetNorm === 0) return 0;
  return dot / (userNorm * targetNorm);
}

function manhattanSimilarity(user: number[], target: readonly number[]) {
  const distance = user.reduce((sum, item, idx) => sum + Math.abs(item - target[idx]), 0);
  const normalizedDistance = distance / DIMENSION_COUNT;
  return 1 - normalizedDistance;
}

function getTopDimensions(dimensions: DimensionMap, count = 4): DominantDimension[] {
  return DIMENSIONS.map((item) => ({
    key: item.key,
    label: item.label,
    value: clamp(dimensions[item.key]),
    tag: item.tag,
  }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

function tagOverlap(userTags: DimensionTag[], templateTags: readonly DimensionTag[]) {
  const userSet = new Set(userTags);
  const templateSet = new Set(templateTags);
  const union = new Set([...userSet, ...templateSet]);

  let intersectionCount = 0;
  for (const tag of userSet) {
    if (templateSet.has(tag)) intersectionCount += 1;
  }

  return union.size === 0 ? 0 : intersectionCount / union.size;
}

function pickRingType(
  focus: readonly DimensionKey[],
  dimensions: DimensionMap,
): RingType {
  const tagScore: Record<DimensionTag, number> = {
    mind: 0,
    career: 0,
    life: 0,
    destiny: 0,
  };

  for (const dimensionKey of focus) {
    const definition = DIMENSIONS.find((item) => item.key === dimensionKey);
    if (!definition) continue;
    tagScore[definition.tag] += dimensions[dimensionKey];
  }

  const sortedTag = (Object.keys(tagScore) as DimensionTag[]).sort(
    (a, b) => tagScore[b] - tagScore[a],
  )[0];

  if (sortedTag === "mind") return "精神系";
  if (sortedTag === "career") return "战斗系";
  if (sortedTag === "life") return "生活系";
  return "特殊系";
}

function computeRuleScore(
  dimensions: DimensionMap,
  focus: readonly DimensionKey[],
): number {
  const focusScore =
    focus.reduce((sum, key) => sum + dimensions[key], 0) / Math.max(1, focus.length);
  const supportScore =
    Object.values(dimensions).reduce((sum, value) => sum + value, 0) / DIMENSION_COUNT;

  return toPercent(focusScore * 0.75 + supportScore * 0.25);
}

function colorByYears(years: number): RingColor {
  if (years >= 100000) return "红";
  if (years >= 10000) return "黑";
  if (years >= 1000) return "紫";
  if (years >= 100) return "黄";
  return "白";
}

function computeConfidence(total: number, delta: number): Confidence {
  if (total >= 75 && delta <= 12) return "高";
  if (total >= 55 && delta <= 20) return "中";
  return "低";
}

function buildRiskHints(
  input: LifeInput,
  ringIndex: number,
): string[] {
  const risks: string[] = [];
  const { dimensions, factors } = input;

  if (dimensions.mentalResilience < 45) {
    risks.push("精神力偏低，建议先强化情绪修复与压力管理。");
  }
  if (dimensions.executionPower < 45) {
    risks.push("执行力不足，目标拆解与每日行动闭环需要先补齐。");
  }
  if (factors.habitConsistency < 40) {
    risks.push("习惯稳定性不足，容易出现“开局猛、后续断”问题。");
  }
  if (ringIndex >= 6 && dimensions.relationshipSupport < 45) {
    risks.push("高阶魂环依赖外部协作，关系支持度偏低会拖慢进阶。");
  }
  if (ringIndex >= 8 && dimensions.missionSense < 55) {
    risks.push("后期环位需要清晰使命牵引，建议先做长期价值校准。");
  }

  return risks.length > 0 ? risks : ["当前配置相对稳定，可按既定节奏推进。"];
}

function buildSkills(
  focus: readonly DimensionKey[],
  baseSkills: readonly string[],
  dimensions: DimensionMap,
): string[] {
  const weakestFocus = [...focus].sort(
    (a, b) => dimensions[a] - dimensions[b],
  );

  const dynamicSkills = weakestFocus.slice(0, 2).map((key) => {
    const label = DIMENSIONS.find((item) => item.key === key)?.label ?? key;
    return `强化${label}：${ACTION_LIBRARY[key]}`;
  });

  return [baseSkills[0], ...dynamicSkills];
}

function computeYears(
  input: LifeInput,
  baseYears: number,
  cap: { min: number; max: number },
  totalScore: number,
): { years: number; isBreakthrough: boolean } {
  const { factors, dimensions } = input;

  const multiplier =
    0.3 * factorScale(factors.weeklyCommitment) +
    0.2 * factorScale(factors.challengeDifficulty) +
    0.2 * factorScale(factors.outcomeQuality) +
    0.15 * factorScale(factors.habitConsistency) +
    0.15 * factorScale(dimensions.mentalResilience);

  const rawYears = Math.round(baseYears * multiplier);
  const canBreak =
    totalScore >= 88 &&
    dimensions.mentalResilience >= 75 &&
    dimensions.riskTolerance >= 70;

  let years = Math.max(cap.min, rawYears);
  let isBreakthrough = false;

  if (years > cap.max) {
    if (canBreak) {
      const boostedMax = Math.round(cap.max * 1.2);
      years = Math.min(years, boostedMax);
      isBreakthrough = years > cap.max;
    } else {
      years = cap.max;
    }
  }

  return { years, isBreakthrough };
}

function profileTitleByScore(score: number) {
  if (score >= 80) return "封号潜质型";
  if (score >= 65) return "稳步进阶型";
  if (score >= 50) return "待觉醒型";
  return "重塑根基型";
}

export function normalizeLifeInput(payload: Partial<LifeInput>): LifeInput {
  const normalizedDimensions = { ...DEFAULT_INPUT.dimensions };
  const incomingDimensions = (payload.dimensions ?? {}) as Partial<
    Record<DimensionKey, number>
  >;

  for (const definition of DIMENSIONS) {
    const incomingValue = incomingDimensions[definition.key];
    if (typeof incomingValue === "number" && Number.isFinite(incomingValue)) {
      normalizedDimensions[definition.key] = clamp(incomingValue);
    }
  }

  const normalizedFactors: LifeFactors = {
    weeklyCommitment:
      typeof payload.factors?.weeklyCommitment === "number"
        ? clamp(payload.factors.weeklyCommitment)
        : DEFAULT_INPUT.factors.weeklyCommitment,
    challengeDifficulty:
      typeof payload.factors?.challengeDifficulty === "number"
        ? clamp(payload.factors.challengeDifficulty)
        : DEFAULT_INPUT.factors.challengeDifficulty,
    outcomeQuality:
      typeof payload.factors?.outcomeQuality === "number"
        ? clamp(payload.factors.outcomeQuality)
        : DEFAULT_INPUT.factors.outcomeQuality,
    habitConsistency:
      typeof payload.factors?.habitConsistency === "number"
        ? clamp(payload.factors.habitConsistency)
        : DEFAULT_INPUT.factors.habitConsistency,
  };

  return {
    profileName:
      typeof payload.profileName === "string" && payload.profileName.trim().length > 0
        ? payload.profileName.trim()
        : DEFAULT_INPUT.profileName,
    age:
      typeof payload.age === "number" && Number.isFinite(payload.age)
        ? clamp(payload.age, 10, 90)
        : DEFAULT_INPUT.age,
    goal:
      typeof payload.goal === "string" && payload.goal.trim().length > 0
        ? payload.goal.trim()
        : DEFAULT_INPUT.goal,
    dimensions: normalizedDimensions,
    factors: normalizedFactors,
  };
}

export function evaluateLifeConfig(payload: Partial<LifeInput>): EvaluationReport {
  const input = normalizeLifeInput(payload);

  const userVector = DIMENSIONS.map((item) => normalize(input.dimensions[item.key]));
  const dominantDimensions = getTopDimensions(input.dimensions, 3);
  const userTags = getTopDimensions(input.dimensions, 4).map((item) => item.tag);

  const rings = RING_TEMPLATES.map((template) => {
    const ruleScore = computeRuleScore(input.dimensions, template.focus);
    const cosine = cosineSimilarity(userVector, template.vector);
    const manhattan = manhattanSimilarity(userVector, template.vector);
    const overlap = tagOverlap(userTags, template.tags);
    const vectorScore = toPercent((0.5 * cosine + 0.3 * manhattan + 0.2 * overlap) * 100);

    const totalScore = toPercent(ruleScore * 0.6 + vectorScore * 0.4);
    const confidence = computeConfidence(totalScore, Math.abs(ruleScore - vectorScore));

    const { years, isBreakthrough } = computeYears(
      input,
      template.baseYears,
      template.cap,
      totalScore,
    );

    const color = colorByYears(years);
    const type = pickRingType(template.focus, input.dimensions);
    const skills = buildSkills(template.focus, template.skillPool, input.dimensions);
    const risks = buildRiskHints(input, template.index);
    const focusSummary = template.focus
      .map((key) => `${DIMENSIONS.find((item) => item.key === key)?.label ?? key}:${input.dimensions[key]}`)
      .join(" / ");

    return {
      index: template.index,
      name: template.name,
      subtitle: template.subtitle,
      type,
      years,
      color,
      isBreakthrough,
      score: {
        rule: ruleScore,
        vector: vectorScore,
        total: totalScore,
        confidence,
      },
      skills,
      risks,
      explanation: `主导维度为 ${focusSummary}，综合评分 ${totalScore}。`,
    };
  });

  const weightedTotal = rings.reduce((sum, ring) => sum + ring.score.total * ring.index, 0);
  const totalWeight = rings.reduce((sum, ring) => sum + ring.index, 0);
  const overallScore = Math.round(weightedTotal / totalWeight);

  return {
    profileName: input.profileName,
    age: input.age,
    goal: input.goal,
    profileTitle: profileTitleByScore(overallScore),
    overallScore,
    dominantDimensions,
    rings,
    createdAt: new Date().toISOString(),
  };
}
