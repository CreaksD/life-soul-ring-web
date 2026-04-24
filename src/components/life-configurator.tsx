"use client";

import { useMemo, useState } from "react";
import { DEFAULT_INPUT, DIMENSIONS, type DimensionKey, type LifeInput } from "@/lib/domain";
import type { EvaluationReport, RingColor } from "@/lib/engine";

const FACTOR_DEFS = [
  {
    key: "weeklyCommitment",
    label: "每周投入强度",
    description: "你愿意持续投入的时间与注意力。",
  },
  {
    key: "challengeDifficulty",
    label: "挑战难度",
    description: "你当前目标的难度与外部环境阻力。",
  },
  {
    key: "outcomeQuality",
    label: "成果质量",
    description: "你对结果质量的控制与兑现能力。",
  },
  {
    key: "habitConsistency",
    label: "习惯一致性",
    description: "你的执行是否稳定，不随情绪大幅波动。",
  },
] as const;

const COLOR_MAP: Record<RingColor, string> = {
  白: "#f8fafc",
  黄: "#facc15",
  紫: "#a855f7",
  黑: "#1f2937",
  红: "#dc2626",
};

const copyDefault = (): LifeInput => ({
  ...DEFAULT_INPUT,
  dimensions: { ...DEFAULT_INPUT.dimensions },
  factors: { ...DEFAULT_INPUT.factors },
});

export default function LifeConfigurator() {
  const [form, setForm] = useState<LifeInput>(copyDefault);
  const [result, setResult] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedDimensions = useMemo(() => {
    return [...DIMENSIONS];
  }, []);

  const updateDimension = (key: DimensionKey, value: number) => {
    setForm((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [key]: value,
      },
    }));
  };

  const updateFactor = (key: keyof LifeInput["factors"], value: number) => {
    setForm((prev) => ({
      ...prev,
      factors: {
        ...prev.factors,
        [key]: value,
      },
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`请求失败(${response.status})`);
      }

      const data = (await response.json()) as EvaluationReport;
      setResult(data);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "提交失败，请稍后再试。";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(copyDefault());
    setResult(null);
    setError(null);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(420px,1fr)_1.2fr]">
      <form
        onSubmit={onSubmit}
        className="panel-soft animate-rise space-y-6 rounded-2xl p-6"
      >
        <div className="space-y-2">
          <h2 className="font-display text-2xl tracking-wide text-[var(--ink)]">人生配置输入</h2>
          <p className="text-sm text-[var(--muted)]">
            用多维度配置生成你的人生魂环，结果将自动映射到第一魂环到第九魂环。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm text-[var(--muted)]">角色名</span>
            <input
              className="w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 text-sm outline-none ring-0 focus:border-[var(--accent)]"
              value={form.profileName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, profileName: event.target.value }))
              }
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-[var(--muted)]">年龄</span>
            <input
              type="number"
              min={10}
              max={90}
              className="w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 text-sm outline-none ring-0 focus:border-[var(--accent)]"
              value={form.age}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, age: Number(event.target.value) || 10 }))
              }
            />
          </label>
        </div>

        <label className="space-y-1">
          <span className="text-sm text-[var(--muted)]">核心目标</span>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 text-sm outline-none ring-0 focus:border-[var(--accent)]"
            value={form.goal}
            onChange={(event) => setForm((prev) => ({ ...prev, goal: event.target.value }))}
          />
        </label>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[var(--ink)]">人生 12 维</h3>
          {sortedDimensions.map((dimension) => (
            <label key={dimension.key} className="block rounded-xl border border-[var(--line)] bg-white/65 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{dimension.label}</p>
                  <p className="text-xs text-[var(--muted)]">{dimension.description}</p>
                </div>
                <span className="rounded-md bg-[var(--chip-bg)] px-2 py-1 text-xs font-semibold text-[var(--chip-fg)]">
                  {form.dimensions[dimension.key]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={form.dimensions[dimension.key]}
                onChange={(event) => updateDimension(dimension.key, Number(event.target.value))}
                className="slider w-full"
              />
            </label>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[var(--ink)]">成长系数</h3>
          {FACTOR_DEFS.map((factor) => (
            <label key={factor.key} className="block rounded-xl border border-[var(--line)] bg-white/65 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{factor.label}</p>
                  <p className="text-xs text-[var(--muted)]">{factor.description}</p>
                </div>
                <span className="rounded-md bg-[var(--chip-bg)] px-2 py-1 text-xs font-semibold text-[var(--chip-fg)]">
                  {form.factors[factor.key]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={form.factors[factor.key]}
                onChange={(event) => updateFactor(factor.key, Number(event.target.value))}
                className="slider w-full"
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "推演中..." : "生成魂环配置"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--panel)]"
          >
            重置
          </button>
        </div>

        {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
      </form>

      <div className="panel-soft animate-rise rounded-2xl p-6">
        {!result ? (
          <div className="flex h-full min-h-48 items-center justify-center text-center text-sm text-[var(--muted)]">
            结果将在这里展示：包括总评分、主导维度、第一魂环到第九魂环的年限与技能建议。
          </div>
        ) : (
          <div className="space-y-6">
            <header className="space-y-2 border-b border-[var(--line)] pb-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Evaluation Result</p>
              <h2 className="font-display text-3xl tracking-wide text-[var(--ink)]">
                {result.profileName} · {result.profileTitle}
              </h2>
              <p className="text-sm text-[var(--muted)]">目标：{result.goal}</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="rounded-lg bg-[var(--chip-bg)] px-3 py-1 text-sm font-semibold text-[var(--chip-fg)]">
                  综合评分 {result.overallScore}
                </span>
                {result.dominantDimensions.map((item) => (
                  <span
                    key={item.key}
                    className="rounded-lg border border-[var(--line)] bg-white px-3 py-1 text-xs text-[var(--ink)]"
                  >
                    {item.label} {item.value}
                  </span>
                ))}
              </div>
            </header>

            <div className="space-y-4">
              {result.rings.map((ring) => (
                <article key={ring.index} className="rounded-xl border border-[var(--line)] bg-white/80 p-4 shadow-[0_4px_24px_rgba(17,35,31,0.04)]">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                        第{ring.index}魂环 · {ring.type}
                      </p>
                      <h3 className="text-lg font-semibold text-[var(--ink)]">{ring.name}</h3>
                      <p className="text-sm text-[var(--muted)]">{ring.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: COLOR_MAP[ring.color],
                          color: ring.color === "白" || ring.color === "黄" ? "#1f2937" : "#ffffff",
                        }}
                      >
                        {ring.color}色 · {ring.years.toLocaleString()} 年
                      </span>
                      {ring.isBreakthrough ? (
                        <p className="mt-1 text-xs font-semibold text-[var(--accent-strong)]">越级吸收已触发</p>
                      ) : null}
                    </div>
                  </div>

                  <p className="text-sm text-[var(--ink)]">{ring.explanation}</p>

                  <div className="mt-3 grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-3">
                    <span>规则分：{ring.score.rule}</span>
                    <span>向量分：{ring.score.vector}</span>
                    <span>
                      综合：{ring.score.total}（置信度 {ring.score.confidence}）
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <p className="font-semibold text-[var(--ink)]">魂技建议</p>
                    {ring.skills.map((skill, idx) => (
                      <p key={`${ring.index}-skill-${idx}`} className="text-[var(--muted)]">
                        · {skill}
                      </p>
                    ))}
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <p className="font-semibold text-[var(--ink)]">风险提示</p>
                    {ring.risks.map((risk, idx) => (
                      <p key={`${ring.index}-risk-${idx}`} className="text-[var(--muted)]">
                        · {risk}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

