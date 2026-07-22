import { NextRequest, NextResponse } from "next/server";
import { parseRFQ } from "@/lib/gemini";

// Force Next.js to run this API handler dynamically on every request (no caching)
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text area is empty." },
        { status: 400 }
      );
    }

    console.log("[API_PARSE_RFQ] Invoking Gemini with text length:", text.length);

    // Call the Gemini service
    const data = await parseRFQ(text);

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("[API_PARSE_RFQ_ERROR]:", err.message || err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to parse requirements." },
      { status: 500 }
    );
  }
}