import React from "react";
import { createAdminClient } from "@/lib/supabase/server";
import VendorQuoteResponseForm from "@/components/vendor/VendorQuoteResponseForm";

export const metadata = {
  title: "Submit Vendor Quote // RFQPilot",
  description: "Public vendor response portal for price and delivery quotation.",
};

export default async function VendorRespondPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!token) {
    return <ErrorContainer title="Invalid Link" message="This quote response link is invalid or incomplete." />;
  }

  const adminSupabase = createAdminClient();

  // 1. Look up token in rfq_vendors
  const { data: rfqVendor, error: rvError } = await adminSupabase
    .from("rfq_vendors")
    .select("*")
    .eq("token", token)
    .single();

  if (rvError || !rfqVendor) {
    return <ErrorContainer title="Invalid or Expired Link" message="This link is invalid or has expired. Please contact the company that issued this RFQ for a new link." />;
  }

  // 2. Fetch linked RFQ, vendor, and company details in parallel
  const [rfqRes, vendorRes] = await Promise.all([
    adminSupabase.from("rfqs").select("*").eq("id", rfqVendor.rfq_id).single(),
    adminSupabase.from("vendors").select("*").eq("id", rfqVendor.vendor_id).single(),
  ]);

  if (rfqRes.error || !rfqRes.data) {
    return <ErrorContainer title="RFQ Not Found" message="The associated Request for Quotation record is no longer available." />;
  }

  const rfq = rfqRes.data;
  const vendor = vendorRes.data;
  const vendorName = vendor?.name || "Valued Supplier";

  // Fetch company name
  let companyName = "Industrial Sourcing";
  if (rfq.company_id) {
    const { data: company } = await adminSupabase
      .from("companies")
      .select("name")
      .eq("id", rfq.company_id)
      .single();
    if (company?.name) companyName = company.name;
  }

  // 3. Check if ALREADY SUBMITTED
  const { data: existingQuote } = await adminSupabase
    .from("quotes")
    .select("*")
    .eq("rfq_vendor_id", rfqVendor.id)
    .maybeSingle();

  if (existingQuote || rfqVendor.status === "submitted") {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col justify-center items-center p-4">
        <div className="max-w-xl w-full bg-bg-surface border border-status-success/40 p-8 rounded-sm shadow-md space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border-default">
            <div className="w-10 h-10 bg-status-success-bg text-status-success rounded-full flex items-center justify-center font-bold text-lg border border-status-success/30">
              ✓
            </div>
            <div>
              <span className="font-mono text-[10px] text-status-success font-bold tracking-widest uppercase block">
                SUBMISSION CONFIRMED
              </span>
              <h1 className="font-heading text-xl font-bold text-text-primary">
                Quote Already Submitted
              </h1>
            </div>
          </div>

          <p className="text-xs font-body text-text-secondary leading-relaxed">
            A quote has already been submitted for <strong>{rfq.title}</strong> to <strong>{companyName}</strong> by <strong>{vendorName}</strong>.
          </p>

          {existingQuote && (
            <div className="bg-bg-base border border-border-default rounded-sm p-4 text-xs font-mono space-y-2">
              <div className="font-heading text-xs font-bold text-accent uppercase tracking-wider mb-2">
                Submitted Quote Summary
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Unit Price:</span>
                <span className="font-bold text-text-primary">₹{Number(existingQuote.unit_price).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Quantity Available:</span>
                <span className="text-text-primary">{existingQuote.quantity_available}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Lead Time:</span>
                <span className="text-text-primary">{existingQuote.lead_time_days} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Payment Terms:</span>
                <span className="text-text-primary">{existingQuote.payment_terms}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Valid Until:</span>
                <span className="text-text-primary">{existingQuote.valid_until}</span>
              </div>
            </div>
          )}

          <div className="text-center pt-2 text-[11px] font-mono text-text-muted">
            If you need to revise your quotation, please reach out directly to {companyName}.
          </div>
        </div>
      </div>
    );
  }

  // 4. Check if EXPIRED (past deadline)
  if (rfq.deadline) {
    const deadlineDate = new Date(rfq.deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    if (new Date() > deadlineDate) {
      return (
        <ErrorContainer
          title="RFQ Deadline Expired"
          message={`This Request for Quotation (${rfq.title}) closed on ${rfq.deadline} and is no longer accepting quotes.`}
        />
      );
    }
  }

  // Default valid until date set to 30 days in future
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const defaultValidUntilStr = thirtyDaysLater.toISOString().split("T")[0];

  const parsedData = (rfq.parsed_data || {}) as Record<string, any>;
  const defaultQuantity = Number(parsedData.quantity) || 1;

  return (
    <div className="min-h-screen bg-bg-base py-8 px-4 font-body text-text-primary antialiased flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-1">
          <span className="font-heading font-bold text-2xl tracking-tight text-text-primary">
            RFQPilot
          </span>
          <p className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
            SECURE VENDOR QUOTATION PORTAL
          </p>
        </div>

        {/* RFQ Context Header Card */}
        <div className="bg-bg-surface border border-border-strong p-6 rounded-sm space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-default">
            <div>
              <span className="font-mono text-[9px] text-accent font-semibold tracking-wider uppercase block">
                RFQ ISSUER: {companyName.toUpperCase()}
              </span>
              <h1 className="font-heading text-xl font-bold text-text-primary mt-0.5">
                {rfq.title}
              </h1>
            </div>
            <div className="text-xs font-mono text-text-muted">
              Recipient: <strong className="text-text-primary">{vendorName}</strong>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-bg-base border border-border-default rounded-sm p-4 text-xs space-y-2">
            <div className="font-heading text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
              RFQ Requirements Summary
            </div>
            {parsedData.product_name && (
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Product / Item:</span>
                <span className="font-bold text-text-primary">{parsedData.product_name}</span>
              </div>
            )}
            {parsedData.quantity && (
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Requested Quantity:</span>
                <span className="font-mono font-semibold text-text-primary">
                  {parsedData.quantity} {parsedData.unit || ""}
                </span>
              </div>
            )}
            {rfq.deadline && (
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Submission Deadline:</span>
                <span className="font-mono text-text-primary">{rfq.deadline}</span>
              </div>
            )}
            {parsedData.delivery_location && (
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Delivery Destination:</span>
                <span className="text-text-primary">{parsedData.delivery_location}</span>
              </div>
            )}
            {parsedData.specifications && Array.isArray(parsedData.specifications) && (
              <div className="py-1">
                <span className="text-text-muted block mb-1">Specifications:</span>
                <ul className="list-disc list-inside text-text-secondary space-y-0.5">
                  {parsedData.specifications.map((spec: string, idx: number) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}
            {rfq.raw_text && (
              <div className="pt-2 border-t border-border-subtle">
                <span className="text-text-muted block mb-1 text-[10px] font-mono uppercase">Full Description:</span>
                <p className="font-mono text-[11px] text-text-secondary whitespace-pre-wrap bg-bg-sunken p-2.5 rounded-sm border border-border-subtle">
                  {rfq.raw_text}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Quote Response Form */}
        <VendorQuoteResponseForm
          token={token}
          defaultQuantity={defaultQuantity}
          companyName={companyName}
          defaultValidUntil={defaultValidUntilStr}
        />

        {/* Footer */}
        <div className="text-center text-[10px] font-mono text-text-muted py-4">
          © {new Date().getFullYear()} RFQPilot. All rights reserved. Secure encrypted token verification.
        </div>
      </div>
    </div>
  );
}

function ErrorContainer({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-center items-center p-4 font-body">
      <div className="max-w-md w-full bg-bg-surface border border-status-error p-8 rounded-sm shadow-md text-center space-y-4">
        <div className="w-12 h-12 bg-status-error-bg text-status-error rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-status-error/30">
          ✕
        </div>
        <span className="font-mono text-[10px] text-status-error font-bold tracking-widest uppercase block">
          ACCESS ERROR // TOKEN INVALID
        </span>
        <h1 className="font-heading text-xl font-bold text-text-primary">{title}</h1>
        <p className="text-xs text-text-secondary leading-relaxed">{message}</p>
        <div className="pt-4 border-t border-border-default text-[10px] font-mono text-text-muted">
          RFQPilot Vendor Gateway
        </div>
      </div>
    </div>
  );
}
