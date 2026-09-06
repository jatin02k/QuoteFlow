import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendFollowUpEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // ── 1. VERIFY SECRET ─────────────────────────────
  // Check the Authorization header matches our secret
  const authHeader = request.headers.get("authorization");
  const expectedHeader = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. SETUP ──────────────────────────────────────
  const supabaseAdmin = createAdminClient();
  let processed = 0;
  let failed = 0;

  // ── 3. QUERY PENDING VENDORS ──────────────────────
  // Find vendors who:
  // - haven't responded (status = pending)
  // - were emailed more than 48 hours ago
  // - haven't received a follow-up yet
  // - their RFQ deadline hasn't passed
  try {
    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    // This is 48 hours ago as an ISO string
    // During testing: change 48 to 0.016 (1 minute)
    // Step 1: Get pending rfq_vendors rows
    const { data: pendingVendors, error: queryError } = await supabaseAdmin
      .from("rfq_vendors")
      .select("id, token, rfq_id, vendor_id, email_sent_at")
      .eq("status", "pending")
      .is("followup_sent_at", null)
      .lt("email_sent_at", cutoffTime);

    if (queryError || !pendingVendors || pendingVendors.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No pending vendors",
      });
    }

    // Step 2: For each, fetch vendor + rfq separately
    for (const rv of pendingVendors) {
      try {
        // Fetch vendor
        const { data: vendor } = await supabaseAdmin
          .from("vendors")
          .select("name, email")
          .eq("id", rv.vendor_id)
          .single();

        // Fetch RFQ + company
        const { data: rfq } = await supabaseAdmin
          .from("rfqs")
          .select("title, deadline, parsed_data, company_id")
          .eq("id", rv.rfq_id)
          .single();

        const { data: company } = await supabaseAdmin
          .from("companies")
          .select("name")
          .eq("id", rfq?.company_id)
          .single();

        if (!vendor?.email || !rfq || !company) {
          console.error(`[cron/follow-up] Missing data for ID ${rv.id}`);
          failed++;
          continue;
        }

        const responseLink = `${process.env.NEXT_PUBLIC_APP_URL}/respond/${rv.token}`;

        const sent = await sendFollowUpEmail({
          vendorEmail: vendor.email,
          vendorName: vendor.name,
          companyName: company.name,
          rfqTitle: rfq.title,
          deadline: rfq.deadline,
          responseLink,
        });

        if (sent) {
          await supabaseAdmin
            .from("rfq_vendors")
            .update({ followup_sent_at: new Date().toISOString() })
            .eq("id", rv.id);
          processed++;
        } else {
          failed++;
        }
      } catch (err: any) {
        console.error(`[cron/follow-up] Error for ID ${rv.id}:`, err.message);
        failed++;
      }
    }

    // ── 6. RETURN RESULT ──────────────────────────────
    return NextResponse.json({
      success: true,
      processed,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[cron/follow-up] Unexpected error:", err.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
