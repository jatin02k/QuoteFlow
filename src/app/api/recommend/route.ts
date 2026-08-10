import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateRecommendation } from "@/lib/gemini";
import { saveRecommendation } from "@/actions/rfq";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rfqId } = body || {};

    if (!rfqId || typeof rfqId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid rfqId parameter." },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // 1. Fetch RFQ details
    const { data: rfq, error: rfqErr } = await adminSupabase
      .from("rfqs")
      .select("*")
      .eq("id", rfqId)
      .single();

    if (rfqErr || !rfq) {
      return NextResponse.json(
        { success: false, error: "RFQ not found." },
        { status: 404 }
      );
    }

    // 2. Check if rfq.recommendation already exists in DB (cached)
    if (
      rfq.recommendation &&
      typeof rfq.recommendation === "object" &&
      Object.keys(rfq.recommendation).length > 0 &&
      (rfq.recommendation as any).recommended_vendor_name
    ) {
      return NextResponse.json({
        success: true,
        recommendation: rfq.recommendation,
        cached: true,
      });
    }

    // 3. Fetch all rfq_vendors with submitted quotes
    const { data: rfqVendorsData, error: rvError } = await adminSupabase
      .from("rfq_vendors")
      .select(`
        id,
        vendor_id,
        vendors (
          id,
          name
        ),
        quotes (
          id,
          unit_price,
          lead_time_days,
          payment_terms,
          notes
        )
      `)
      .eq("rfq_id", rfqId);

    if (rvError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch vendor quotes." },
        { status: 500 }
      );
    }

    const parsedData = (rfq.parsed_data || {}) as Record<string, any>;
    const requestedQtyNumber = Number(parsedData.quantity) || 1;

    // Format submitted quotes
    const submittedQuotes: Array<{
      vendorId: string;
      vendorName: string;
      unitPrice: number;
      totalCost: number;
      leadTimeDays: number;
      paymentTerms: string;
      notes?: string | null;
    }> = [];

    (rfqVendorsData || []).forEach((item: any) => {
      const rawVendor = Array.isArray(item.vendors) ? item.vendors[0] : item.vendors;
      const rawQuote = Array.isArray(item.quotes) ? item.quotes[0] : item.quotes;

      if (rawQuote && rawQuote.unit_price !== undefined) {
        const unitPrice = Number(rawQuote.unit_price) || 0;
        const totalCost = Number((unitPrice * requestedQtyNumber).toFixed(2));
        const vendorId = rawVendor?.id || item.vendor_id;
        const vendorName = rawVendor?.name || "Unknown Supplier";

        submittedQuotes.push({
          vendorId,
          vendorName,
          unitPrice,
          totalCost,
          leadTimeDays: Number(rawQuote.lead_time_days) || 0,
          paymentTerms: rawQuote.payment_terms || "Net 30",
          notes: rawQuote.notes || null,
        });
      }
    });

    if (submittedQuotes.length === 0) {
      return NextResponse.json(
        { success: false, error: "No submitted quotes found for this RFQ." },
        { status: 400 }
      );
    }

    // 4. Generate recommendation using Gemini helper
    const specifications = Array.isArray(parsedData.specifications)
      ? parsedData.specifications
      : [];

    const recommendation = await generateRecommendation({
      rfqTitle: rfq.title,
      specifications,
      quotes: submittedQuotes,
    });

    // 5. Save recommendation to DB
    await saveRecommendation(rfqId, recommendation);

    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (err: any) {
    console.error("[POST /api/recommend] Exception:", err?.message || err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred generating AI recommendation." },
      { status: 500 }
    );
  }
}
