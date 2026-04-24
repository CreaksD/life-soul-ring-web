import LifeConfigurator from "@/components/life-configurator";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <header className="animate-rise space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Soul Ring Life Engine</p>
        <h1 className="font-display text-4xl leading-tight tracking-wide text-[var(--ink)] md:text-5xl">
          人生配置 × 魂环配置
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] md:text-base">
          将你的多维人生参数映射为斗罗风格的第一魂环到第九魂环，结合规则引擎与向量匹配，输出年限、颜色、风险和下一步可执行魂技。
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-full border border-[var(--line)] bg-white/60 px-3 py-1">规则评分</span>
          <span className="rounded-full border border-[var(--line)] bg-white/60 px-3 py-1">向量匹配</span>
          <span className="rounded-full border border-[var(--line)] bg-white/60 px-3 py-1">越级吸收机制</span>
          <span className="rounded-full border border-[var(--line)] bg-white/60 px-3 py-1">解释型输出</span>
        </div>
      </header>
      <LifeConfigurator />
    </main>
  );
}
