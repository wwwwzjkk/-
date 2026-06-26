const ALLOWED_ORIGINS = new Set([
  "https://haoliunet.top",
  "https://www.haoliunet.top",
]);

function corsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://haoliunet.top";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function cleanText(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers });
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return Response.json({ error: "Origin not allowed" }, { status: 403, headers });
    }

    if (!env.WECOM_WEBHOOK_URL) {
      return Response.json({ error: "WECOM_WEBHOOK_URL is not configured" }, { status: 500, headers });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400, headers });
    }

    const name = cleanText(data.name, 80);
    const company = cleanText(data.company, 120) || "未填写";
    const phone = cleanText(data.phone, 80);
    const message = cleanText(data.message, 1000);
    const page = cleanText(data.page, 300) || "官网联系我们";

    if (!name || !phone || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400, headers });
    }

    const content = [
      "官网合作咨询",
      "",
      `姓名：${name}`,
      `公司：${company}`,
      `电话：${phone}`,
      `需求：${message}`,
      "",
      `提交页面：${page}`,
      `提交时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
    ].join("\n");

    const wecomResponse = await fetch(env.WECOM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msgtype: "text",
        text: { content },
      }),
    });

    const result = await wecomResponse.json().catch(() => ({}));
    if (!wecomResponse.ok || result.errcode !== 0) {
      return Response.json(
        { error: "WeCom send failed", detail: result },
        { status: 502, headers },
      );
    }

    return Response.json({ ok: true, errcode: 0 }, { headers });
  },
};
