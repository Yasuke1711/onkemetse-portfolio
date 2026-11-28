import { NextResponse } from "next/server";

const recentRequests = new Map<string, { count: number; resetAt: number }>();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ ok: false, code: "origin_rejected" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ ok: false, code: "origin_rejected" }, { status: 403 });
    }
  }

  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 9000) return NextResponse.json({ ok: false, code: "too_large" }, { status: 413 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ ok: false, code: "invalid_payload" }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  if (clean(body.companyWebsite, 200)) return NextResponse.json({ ok: true }, { status: 200 });

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const projectType = clean(body.projectType, 100);
  const message = clean(body.message, 4000);
  if (!name || !EMAIL_PATTERN.test(email) || !projectType || message.length < 10) {
    return NextResponse.json({ ok: false, code: "invalid_fields" }, { status: 400 });
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || "unknown";
  const now = Date.now();
  const current = recentRequests.get(key);
  if (current && current.resetAt > now && current.count >= 4) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });
  }
  if (!current || current.resetAt <= now) recentRequests.set(key, { count: 1, resetAt: now + 600000 });
  else recentRequests.set(key, { count: current.count + 1, resetAt: current.resetAt });
  if (recentRequests.size > 500) {
    for (const [ip, item] of recentRequests) if (item.resetAt <= now) recentRequests.delete(ip);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "dragnelkhavara@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });

  const textBody = [
    "New portfolio enquiry", "", `Name: ${name}`, `Email: ${email}`,
    `Project: ${projectType}`, "", message
  ].join("\\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Portfolio enquiry: ${projectType}`, text: textBody }),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return NextResponse.json({ ok: false, code: "delivery_failed" }, { status: 502 });
    return NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, code: "delivery_failed" }, { status: 502 });
  }
}
