import React from "react";
import Link from "next/link";
import { getRFQComparisonData, getCompanyName } from "@/actions/rfq";
import { getVendors } from "@/actions/vendor";
import { RFQStatus, Vendor, RFQVendorWithDetails } from "@/types";
import QuoteComparison from "@/components/rfq/QuoteComparison";
import AIRecommendationCard from "@/components/rfq/AIRecommendationCard";
import VendorDispatchSelector from "@/components/rfq/VendorDispatchSelector";

export const metadata = {
  title: "RFQ Decision Dashboard | RFQDeck",
  description: "Compare supplier quotes, track vendor engagement, and close RFQs.",
};

function StatusBadge({ status }: { status: RFQStatus }) {
  switch (status) {
    case "draft":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-mono font-bold bg-bg-sunken text-text-secondary border border-border-default uppercase tracking-wider">
          Draft
        </span>
      );
    case "sent":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
          Sent
        </span>
      );
    case "comparing":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-mono font-bold bg-accent-light text-accent border border-accent-border uppercase tracking-wider">
          Comparing Quotes
        </span>
      );
    case "closed":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-mono font-bold bg-status-success-bg text-status-success border border-status-success/30 uppercase tracking-wider">
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-mono font-bold bg-bg-sunken text-text-secondary border border-border-default uppercase tracking-wider">
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

  const [comparisonResult, vendorsResult, companyName] = await Promise.all([
    getRFQComparisonData(id),
    getVendors(),
    getCompanyName(),
  ]);

  if (!comparisonResult.success) {
    return (
      <div className="max-w-2xl mx-auto my-12 border border-status-error bg-status-error-bg p-6 rounded-sm shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-status-error text-white rounded-sm shrink-0">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="square"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
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
              {comparisonResult.error || "The requested RFQ record could not be loaded."}
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

  const { rfq, vendors: comparisonVendors, lowestUnitPrice } = comparisonResult.data;
  const allDirectoryVendors = (vendorsResult.success ? vendorsResult.data : []) as Vendor[];

  // Format parsed data for email preview / details card
  const parsedData = (rfq.parsed_data || {}) as Record<string, any>;
  const specificationsList =
    Array.isArray(parsedData.specifications) && parsedData.specifications.length > 0
      ? parsedData.specifications.join(", ")
      : null;

  const submittedQuotesCount = comparisonVendors.filter((v: RFQVendorWithDetails) => Boolean(v.quote)).length;
  const recData = rfq.recommendation as any;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="pb-6 border-b border-border-default space-y-4">
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase block mb-1">
              RFQ DECISION & MANAGEMENT DASHBOARD
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              {rfq.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={rfq.status} />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-bg-surface border border-border-default rounded-sm space-y-1">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
            Product / Item
          </div>
          <div className="font-heading font-bold text-xs text-text-primary truncate">
            {rfq.item_name}
          </div>
        </div>

        <div className="p-3.5 bg-bg-surface border border-border-default rounded-sm space-y-1">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
            Quantity
          </div>
          <div className="font-mono font-bold text-xs text-text-primary">
            {String(rfq.quantity)} {rfq.unit || ""}
          </div>
        </div>

        <div className="p-3.5 bg-bg-surface border border-border-default rounded-sm space-y-1">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
            Deadline
          </div>
          <div className="font-mono font-bold text-xs text-text-primary">
            {rfq.deadline ? rfq.deadline : "Not Set"}
          </div>
        </div>

        <div className="p-3.5 bg-bg-surface border border-border-default rounded-sm space-y-1">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
            Contacted
          </div>
          <div className="font-mono font-bold text-xs text-text-primary">
            {comparisonVendors.length} Suppliers
          </div>
        </div>

        <div className="p-3.5 bg-bg-surface border border-border-default rounded-sm space-y-1">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
            Quotes Received
          </div>
          <div className="font-mono font-bold text-xs text-accent">
            {submittedQuotesCount} Quotes
          </div>
        </div>

        <div className="p-3.5 bg-status-success-bg/40 border border-status-success/30 rounded-sm space-y-1">
          <div className="text-[10px] font-mono text-status-success uppercase tracking-wider font-bold">
            Lowest Unit Price
          </div>
          <div className="font-mono font-bold text-xs text-status-success">
            {lowestUnitPrice !== null
              ? `₹${lowestUnitPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "No Quotes"}
          </div>
        </div>
      </div>

      {/* MAIN SECTION 1: AI Recommendation Card & Quote Comparison Matrix */}
      <section className="space-y-6">
        <AIRecommendationCard
          rfqId={rfq.id}
          submittedQuotesCount={submittedQuotesCount}
          initialRecommendation={recData}
        />
        <QuoteComparison
          vendors={comparisonVendors}
          lowestUnitPrice={lowestUnitPrice}
          recommendedVendorName={recData?.recommended_vendor_name}
        />
      </section>

      {/* MAIN SECTION 2: Supplier Dispatch & Engagement Management Panel */}
      <section>
        <VendorDispatchSelector
          rfqId={rfq.id}
          rfqStatus={rfq.status}
          vendors={allDirectoryVendors}
          rfqVendors={comparisonVendors}
        />
      </section>

      {/* SECTION 3: Requirement Specifications & Email Preview (Reference Card) */}
      <section className="bg-bg-surface border border-border-default rounded-sm p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-accent-light text-accent border border-accent-border uppercase">
              SPECIFICATION REFERENCE
            </span>
            <span className="text-xs text-text-muted font-body">
              Requirement details dispatched to suppliers in email requests
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-body">
          {/* Detailed Spec Table */}
          <div className="border border-border-default rounded-sm overflow-hidden text-xs bg-bg-base">
            <div className="bg-bg-surface px-3.5 py-2 border-b border-border-default font-heading font-bold text-text-secondary uppercase tracking-wider text-[11px]">
              Extracted Parameters
            </div>
            <div className="divide-y divide-border-subtle">
              {parsedData.product_name && (
                <div className="grid grid-cols-12 p-3 bg-accent-light/30">
                  <span className="col-span-4 text-text-secondary font-semibold">Product / Item:</span>
                  <span className="col-span-8 text-text-primary font-bold">{parsedData.product_name}</span>
                </div>
              )}
              {parsedData.quantity && (
                <div className="grid grid-cols-12 p-3">
                  <span className="col-span-4 text-text-secondary font-semibold">Quantity Requested:</span>
                  <span className="col-span-8 font-mono text-text-primary font-bold">
                    {String(parsedData.quantity)} {parsedData.unit || ""}
                  </span>
                </div>
              )}
              {rfq.deadline && (
                <div className="grid grid-cols-12 p-3">
                  <span className="col-span-4 text-text-secondary font-semibold">Deadline:</span>
                  <span className="col-span-8 font-mono text-text-primary">{rfq.deadline}</span>
                </div>
              )}
              {parsedData.delivery_location && (
                <div className="grid grid-cols-12 p-3">
                  <span className="col-span-4 text-text-secondary font-semibold">Delivery Location:</span>
                  <span className="col-span-8 text-text-primary">{parsedData.delivery_location}</span>
                </div>
              )}
              {specificationsList && (
                <div className="grid grid-cols-12 p-3">
                  <span className="col-span-4 text-text-secondary font-semibold">Specifications:</span>
                  <span className="col-span-8 text-text-primary">{specificationsList}</span>
                </div>
              )}
              {parsedData.special_requirements && (
                <div className="grid grid-cols-12 p-3">
                  <span className="col-span-4 text-text-secondary font-semibold">Special Requirements:</span>
                  <span className="col-span-8 text-text-primary">{parsedData.special_requirements}</span>
                </div>
              )}
            </div>
          </div>

          {/* Raw Text & Attachments */}
          <div className="space-y-4">
            {rfq.raw_text && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-text-muted font-semibold uppercase">
                  Raw Requirement Description
                </span>
                <div className="p-3 bg-bg-sunken border border-border-default rounded-sm font-mono text-[11px] text-text-secondary whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {rfq.raw_text}
                </div>
              </div>
            )}

            {(rfq.attachment_url || (rfq as any).attachment_name) && (
              <div className="p-3 bg-bg-base border border-border-default rounded-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>📎</span>
                  <span className="font-semibold text-text-primary">
                    {(rfq as any).attachment_name || "RFQ_Drawing_Attachment.pdf"}
                  </span>
                </div>
                <a
                  href={rfq.attachment_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-mono font-bold text-[11px] hover:underline"
                >
                  Download Drawing
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
