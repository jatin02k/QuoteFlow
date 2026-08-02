"use server";

import { QuoteSchema } from "@/lib/schemas";
import { createAdminClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types";
import { sendQuoteSubmittedNotification } from "@/lib/resend";
import { revalidatePath } from "next/cache";

export async function submitQuote(
  token: string,
  input: unknown
): Promise<ActionResult> {
  if (!token || typeof token !== "string") {
    return { success: false, error: "Invalid single-use token link." };
  }

  const result = QuoteSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const adminSupabase = createAdminClient();

    // 1. Look up rfq_vendors by token
    const { data: rfqVendor, error: rvError } = await adminSupabase
      .from("rfq_vendors")
      .select("*")
      .eq("token", token)
      .single();

    if (rvError || !rfqVendor) {
      console.error("[submitQuote] Token lookup failed:", rvError?.message);
      return { success: false, error: "This link is invalid or has expired." };
    }

    // 2. Fetch linked RFQ details
    const { data: rfq, error: rfqError } = await adminSupabase
      .from("rfqs")
      .select("*")
      .eq("id", rfqVendor.rfq_id)
      .single();

    if (rfqError || !rfq) {
      console.error("[submitQuote] RFQ fetch failed:", rfqError?.message);
      return { success: false, error: "Associated RFQ record not found." };
    }

    // 3. Check if deadline has passed
    if (rfq.deadline) {
      const deadlineDate = new Date(rfq.deadline);
      const now = new Date();
      // Set end of day for deadline date comparison if date only
      deadlineDate.setHours(23, 59, 59, 999);
      if (now > deadlineDate) {
        return { success: false, error: "This RFQ is no longer accepting quotes as the deadline has passed." };
      }
    }

    // 4. Check if quote already exists for this rfq_vendor_id or status is submitted
    const { data: existingQuote } = await adminSupabase
      .from("quotes")
      .select("id")
      .eq("rfq_vendor_id", rfqVendor.id)
      .maybeSingle();

    if (existingQuote || rfqVendor.status === "submitted") {
      return { success: false, error: "A quote has already been submitted using this link." };
    }

    // Fetch vendor info
    const { data: vendor } = await adminSupabase
      .from("vendors")
      .select("name, email")
      .eq("id", rfqVendor.vendor_id)
      .single();

    const vendorName = vendor?.name || "Supplier";

    // Domain Logic: Total Cost = Unit Price * Requested RFQ Quantity (or quantity_available)
    const rfqParsed = (rfq.parsed_data || {}) as Record<string, any>;
    const requestedQty = Number(rfqParsed.quantity) || result.data.quantity_available;
    const totalCost = Number((result.data.unit_price * requestedQty).toFixed(2));

    // 5. Insert into quotes table
    const { data: quoteData, error: quoteError } = await adminSupabase
      .from("quotes")
      .insert({
        rfq_id: rfqVendor.rfq_id,
        vendor_id: rfqVendor.vendor_id,
        rfq_vendor_id: rfqVendor.id,
        unit_price: result.data.unit_price,
        quantity_available: result.data.quantity_available,
        lead_time_days: result.data.lead_time_days,
        payment_terms: result.data.payment_terms,
        valid_until: result.data.valid_until,
        notes: result.data.notes?.trim() || null,
        total_cost: totalCost,
      })
      .select("id")
      .single();

    if (quoteError || !quoteData) {
      console.error("[submitQuote] Insert quote error:", quoteError?.message);
      return { success: false, error: "Failed to submit quote. Please try again." };
    }

    // 6. Update rfq_vendors status to 'submitted'
    await adminSupabase
      .from("rfq_vendors")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", rfqVendor.id);

    // 7. Increment rfq.quotes_received count
    const nextQuotesReceived = (rfq.quotes_received || 0) + 1;
    const nextRfqStatus = rfq.status === "sent" ? "comparing" : rfq.status;

    await adminSupabase
      .from("rfqs")
      .update({
        quotes_received: nextQuotesReceived,
        status: nextRfqStatus,
      })
      .eq("id", rfq.id);

    // 8. Fetch owner email & send notification email
    const { data: companyUser } = await adminSupabase.auth.admin.getUserById(rfq.company_id);
    const ownerEmail = companyUser?.user?.email;

    if (ownerEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const rfqLink = `${appUrl}/rfqs/${rfq.id}`;
      await sendQuoteSubmittedNotification({
        ownerEmail,
        vendorName,
        rfqTitle: rfq.title,
        unitPrice: result.data.unit_price,
        totalCost,
        rfqLink,
      });
    }

    revalidatePath("/rfqs");
    revalidatePath(`/rfqs/${rfq.id}`);

    return { success: true, data: null };
  } catch (err: any) {
    console.error("[submitQuote] Unexpected error submitting quote:", err?.message || err);
    return { success: false, error: "An unexpected error occurred while processing your quote." };
  }
}
