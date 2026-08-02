import React from "react";
import Link from "next/link";
import { getRFQ, getRFQVendors, getCompanyName } from "@/actions/rfq";
import { getVendors } from "@/actions/vendor";
import { RFQStatus, Vendor } from "@/types";
import VendorDispatchSelector from "@/components/rfq/VendorDispatchSelector";

export const metadata = {
  title: "RFQ Details // RFQPilot",
  description: "View RFQ details, vendor email preview, and dispatch to suppliers.",
};

function StatusBadge({ status }: { status: RFQStatus }) {
  switch (status) {
    case "draft":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-bold bg-bg-sunken text-text-secondary border border-border-default uppercase tracking-wider">
          Draft
        </span>
      );
    case "sent":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
          Sent
        </span>
      );
    case "comparing":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-bold bg-accent-light text-accent border border-accent-border uppercase tracking-wider">
          Comparing
        </span>
      );
    case "closed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-bold bg-status-success-bg text-status-success border border-status-success/30 uppercase tracking-wider">
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-bold bg-bg-sunken text-text-secondary border border-border-default uppercase tracking-wider">
          {status}
        </span>
      );
  }
}

export default async function RFQDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rfqResult, vendorsResult, rfqVendorsResult, companyName] = await Promise.all([
    getRFQ(id),
    getVendors(),
    getRFQVendors(id),
    getCompanyName(),
  ]);

  if (!rfqResult.success || !rfqResult.data) {
    return (
      <div className="max-w-2xl mx-auto my-12 border border-status-error bg-status-error-bg p-6 rounded-sm shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-status-error text-white rounded-sm shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <span className="font-mono text-[9px] text-status-error font-semibold tracking-wider uppercase block">
              RFQ NOT FOUND // 404
            </span>
            <h2 className="font-heading text-lg font-bold text-text-primary mt-0.5">
              Request for Quotation Not Found
            </h2>
            <p className="text-sm text-text-secondary mt-1.5 font-body leading-relaxed">
              {rfqResult.success ? "" : rfqResult.error || "The requested RFQ record could not be loaded."}
            </p>
            <div className="mt-4 pt-3 border-t border-border-default">
              <Link
                href="/rfqs"
                className="text-xs font-mono font-bold text-accent hover:text-accent-hover transition-colors uppercase tracking-wider"
              >
                ← Back to RFQ List
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rfq = rfqResult.data;
  const vendors = (vendorsResult.success ? vendorsResult.data : []) as Vendor[];
  const rfqVendors = rfqVendorsResult.success ? rfqVendorsResult.data : [];

  const parsedData = (rfq.parsed_data || {}) as Record<string, any>;
  const specificationsList = Array.isArray(parsedData.specifications) && parsedData.specifications.length > 0
    ? parsedData.specifications.join(", ")
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Navigation Breadcrumb & Header */}
      <div className="pb-6 border-b border-border-default space-y-3">
        <div className="flex items-center gap-2">
          <Link
            href="/rfqs"
            className="font-mono text-[10px] text-text-muted hover:text-accent transition-colors uppercase tracking-widest"
          >
            RFQs
          </Link>
          <span className="text-text-muted font-mono text-[10px]">/</span>
          <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase">
            {rfq.id.substring(0, 8)}...
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase block mb-1">
              RFQ DISPATCH MODULE
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
              {rfq.title}
            </h1>
          </div>
          <StatusBadge status={rfq.status} />
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Email Preview Card */}
        <div className="lg:col-span-7 bg-bg-surface border border-border-strong rounded-sm p-6 space-y-5 shadow-xs">
          {/* Email Preview Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-accent-light text-accent border border-accent-border uppercase">
                EMAIL PREVIEW
              </span>
              <span className="text-xs text-text-muted font-body">
                This is what vendors will receive in their inbox
              </span>
            </div>
          </div>

          {/* Rendered Email Container */}
          <div className="border border-border-default bg-bg-base rounded-sm p-5 space-y-4 font-body">
            {/* Email Top Metadata */}
            <div className="bg-bg-surface border border-border-subtle p-3.5 rounded-sm space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-text-muted w-16 font-semibold uppercase">From:</span>
                <span className="text-text-primary font-bold">{companyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-muted w-16 font-semibold uppercase">Subject:</span>
                <span className="text-text-primary">
                  RFQ: {rfq.title} {rfq.deadline ? `— Quote Required by ${rfq.deadline}` : ""}
                </span>
              </div>
            </div>

            {/* Email Header Card */}
            <div className="border-l-4 border-accent bg-bg-sunken/60 p-4 rounded-r-sm space-y-1">
              <div className="font-heading text-xs font-bold text-accent uppercase tracking-wider">
                Request for Quotation
              </div>
              <div className="font-heading text-lg font-bold text-text-primary">
                {companyName}
              </div>
              <div className="text-xs text-text-muted font-mono">
                Attention: [ Vendor Representative ]
              </div>
            </div>

            {/* Email Body Intro */}
            <p className="text-xs text-text-secondary leading-relaxed">
              Dear Supplier,<br />
              <strong>{companyName}</strong> has requested a formal price and delivery quotation for the requirement outlined below.
            </p>

            {/* Specification Table */}
            <div className="border border-border-default rounded-sm overflow-hidden text-xs">
              <div className="bg-bg-surface px-3 py-2 border-b border-border-default font-heading font-bold text-text-secondary uppercase tracking-wider text-[11px]">
                Requirement Details
              </div>
              <div className="divide-y divide-border-subtle">
                {parsedData.product_name && (
                  <div className="grid grid-cols-12 p-2.5 bg-accent-light/40">
                    <span className="col-span-4 text-text-secondary font-semibold">Product / Item:</span>
                    <span className="col-span-8 text-text-primary font-bold">{parsedData.product_name}</span>
                  </div>
                )}
                {parsedData.quantity && (
                  <div className="grid grid-cols-12 p-2.5">
                    <span className="col-span-4 text-text-secondary font-semibold">Quantity Requested:</span>
                    <span className="col-span-8 font-mono text-text-primary">
                      {String(parsedData.quantity)} {parsedData.unit || ""}
                    </span>
                  </div>
                )}
                {rfq.deadline && (
                  <div className="grid grid-cols-12 p-2.5">
                    <span className="col-span-4 text-text-secondary font-semibold">Deadline:</span>
                    <span className="col-span-8 font-mono text-text-primary">{rfq.deadline}</span>
                  </div>
                )}
                {parsedData.delivery_location && (
                  <div className="grid grid-cols-12 p-2.5">
                    <span className="col-span-4 text-text-secondary font-semibold">Location:</span>
                    <span className="col-span-8 text-text-primary">{parsedData.delivery_location}</span>
                  </div>
                )}
                {specificationsList && (
                  <div className="grid grid-cols-12 p-2.5">
                    <span className="col-span-4 text-text-secondary font-semibold">Specifications:</span>
                    <span className="col-span-8 text-text-primary">{specificationsList}</span>
                  </div>
                )}
                {parsedData.special_requirements && (
                  <div className="grid grid-cols-12 p-2.5">
                    <span className="col-span-4 text-text-secondary font-semibold">Special Requirements:</span>
                    <span className="col-span-8 text-text-primary">{parsedData.special_requirements}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Raw Requirement Text */}
            {rfq.raw_text && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-text-muted font-semibold uppercase">
                  Raw Requirement Text
                </span>
                <div className="p-3 bg-bg-sunken border border-border-default rounded-sm font-mono text-[11px] text-text-secondary whitespace-pre-wrap">
                  {rfq.raw_text}
                </div>
              </div>
            )}

            {/* Attachment Badge */}
            {(rfq.attachment_url || (rfq as any).attachment_name) && (
              <div className="p-3 bg-bg-surface border border-border-default rounded-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>📎</span>
                  <span className="font-semibold text-text-primary">
                    {(rfq as any).attachment_name || "RFQ_Drawing_Attachment.pdf"}
                  </span>
                </div>
                <span className="text-accent font-mono font-bold text-[11px] underline">
                  Click to download
                </span>
              </div>
            )}

            {/* Placeholder Response CTA Button */}
            <div className="pt-2 pb-1 text-center">
              <div className="inline-block bg-accent text-white text-xs font-bold px-6 py-3 rounded-sm border border-accent-hover shadow-xs">
                [ Submit Your Quote — Unique Vendor Link ]
              </div>
              <div className="text-[10px] font-mono text-text-muted mt-2">
                Clicking this button takes the vendor directly to their secure single-use quote form (No password needed)
              </div>
            </div>

            {/* Email Footer */}
            <div className="pt-3 border-t border-border-subtle text-center text-[10px] font-mono text-text-muted space-y-1">
              <div>This link is unique to each vendor. Valid until {rfq.deadline || "deadline"}.</div>
              <div className="font-semibold text-text-secondary">Powered by RFQPilot — Procurement made simple</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Vendor Dispatch Panel */}
        <div className="lg:col-span-5">
          <VendorDispatchSelector
            rfqId={rfq.id}
            rfqStatus={rfq.status}
            vendors={vendors}
            rfqVendors={rfqVendors}
          />
        </div>
      </div>
    </div>
  );
}
