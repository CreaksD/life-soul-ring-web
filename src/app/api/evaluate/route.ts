import { evaluateLifeConfig } from "@/lib/engine";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = evaluateLifeConfig(payload ?? {});
    return Response.json(result);
  } catch {
    return Response.json(
      {
        error: "请求体解析失败，请确认提交的是合法 JSON。",
      },
      { status: 400 },
    );
  }
}

