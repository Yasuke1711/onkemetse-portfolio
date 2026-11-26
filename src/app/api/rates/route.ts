import { NextResponse } from "next/server";

export const revalidate = 86_400;

export async function GET() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/BWP", {
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { result: "error", message: "Exchange-rate service unavailable." },
        { status: 502 },
      );
    }

    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("result" in data) || data.result !== "success" || !("rates" in data)) {
      return NextResponse.json(
        { result: "error", message: "Exchange-rate response was invalid." },
        { status: 502 },
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { result: "error", message: "Unable to retrieve exchange rates." },
      { status: 502 },
    );
  }
}
