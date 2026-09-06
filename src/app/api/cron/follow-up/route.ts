import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendFollowUpEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // ── 1. VERIFY SECRET ─────────────────────────────
  const authHeader = request.headers.get("authorization");
  const expectedHeader = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. SETUP ──────────────────────────────────────
  const supabaseAdmin = createAdminClient();
  let processed = 0;
  let failed = 0;

  try {
    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // ── 3. QUERY ALL DATA IN A SINGLE JOINED QUERY ────
    const { data: pendingVendors, error: queryError } = await supabaseAdmin
      .from("rfq_vendors")
      .select(`
        id,
        token,
        email_sent_at,
        vendors (
          name,
          email
        ),
        rfqs (
          title,
          deadline,
          companies (
            name
          )
        )
      `)
      .eq("status", "pending")
      .is("followup_sent_at", null)
      .lt("email_sent_at", cutoffTime);

    if (queryError || !pendingVendors || pendingVendors.length === 0) {
      if (queryError) {
        console.error("[cron/follow-up] Query Error:", queryError.message);
      }
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No pending vendors",
      });
    }

    // ── 4. PROCESS VENDORS ─────────────────────────────
    for (const rv of pendingVendors) {
      try {
        // Safe extraction handling both array and object returns
        const vendor = Array.isArray(rv.vendors) ? rv.vendors[0] : rv.vendors;
        const rfq = Array.isArray(rv.rfqs) ? rv.rfqs[0] : rv.rfqs;
        const company = Array.isArray(rfq?.companies) ? rfq?.companies[0] : rfq?.companies;

        if (!vendor?.email || !rfq || !company?.name) {
          console.error(`[cron/follow-up] Missing relation data for ID ${rv.id}`);
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
        console.error(`[cron/follow-up] Error for ID ${rv.id}:`, err?.message || err);
        failed++;
      }
    }

    // ── 5. RETURN RESULT ──────────────────────────────
    return NextResponse.json({
      success: true,
      processed,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[cron/follow-up] Unexpected error:", err?.message || err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}