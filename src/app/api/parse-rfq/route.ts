import { NextResponse } from "next/server";
import { parseRFQ } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const text: string = body?.text || "";

    if (!text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text field is required for parsing." },
        { status: 400 }
      );
    }

    const data = await parseRFQ(text);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("[/api/parse-rfq] Parsing error:", err?.message || err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to parse requirements text." },
      { status: 500 }
    );
  }
}
