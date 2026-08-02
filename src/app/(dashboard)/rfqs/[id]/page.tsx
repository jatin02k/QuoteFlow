import React from "react";
import Link from "next/link";
import { getRFQ } from "@/actions/rfq";
import { RFQStatus } from "@/types";

export const metadata = {
  title: "RFQ Details // RFQPilot",
  description: "View RFQ details and vendor quotes.",
};

function StatusBadge({ status }: { status: RFQStatus }) {
  switch (status) {
    case "draft":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-medium bg-bg-sunken text-text-secondary border border-border-default uppercase tracking-wider">
          Draft
        </span>
      );
    case "sent":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
          Sent
        </span>
      );
    case "comparing":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-medium bg-accent-light text-accent border border-accent-border uppercase tracking-wider">
          Comparing
        </span>
      );
    case "closed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-medium bg-status-success-bg text-status-success border border-status-success/30 uppercase tracking-wider">
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-medium bg-bg-sunken text-text-secondary border border-border-default uppercase tracking-wider">
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
  const result = await getRFQ(id);

  if (!result.success) {
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
              {result.error}
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

  const rfq = result.data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
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
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            {rfq.title}
          </h1>
          <StatusBadge status={rfq.status} />
        </div>
      </div>

      {/* Details Placeholder Card */}
      <div className="bg-bg-surface border border-border-default rounded-sm p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <span className="font-mono text-xs text-text-secondary uppercase tracking-wider font-semibold">
            RFQ OVERVIEW (PLACEHOLDER)
          </span>
          <span className="font-mono text-[10px] text-text-muted">
            STAGE 12 FEATURE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
          <div>
            <span className="text-xs text-text-muted font-mono block">Status</span>
            <span className="font-semibold text-text-primary uppercase">{rfq.status}</span>
          </div>
          <div>
            <span className="text-xs text-text-muted font-mono block">Created At</span>
            <span className="font-mono text-text-secondary">
              {new Date(rfq.created_at).toLocaleString()}
            </span>
          </div>
          {rfq.deadline && (
            <div>
              <span className="text-xs text-text-muted font-mono block">Delivery Deadline</span>
              <span className="font-mono text-text-secondary">{rfq.deadline}</span>
            </div>
          )}
          {rfq.raw_text && (
            <div className="sm:col-span-2">
              <span className="text-xs text-text-muted font-mono block mb-1">Raw Requirement</span>
              <p className="p-3 bg-bg-base border border-border-default rounded-sm font-mono text-xs whitespace-pre-wrap text-text-secondary">
                {rfq.raw_text}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-accent-light/50 border border-accent-border text-accent text-xs rounded-sm font-mono">
          Full RFQ detail view, quote comparisons, vendor dispatch status, and negotiation controls will be implemented in Stage 12.
        </div>
      </div>
    </div>
  );
}
