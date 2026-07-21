import React from "react";
import Link from "next/link";
import { getRFQs } from "@/actions/rfq";
import RFQList from "@/components/rfq/RFQList";
import { RFQ } from "@/types";

export const metadata = {
  title: "Requests for Quotation // QuoteFlow",
  description: "Manage, create, dispatch, and track manufacturing RFQs.",
};

export default async function RFQsPage() {
  const result = await getRFQs();

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
              SYSTEM ERROR // RFQ.FETCH.FAIL
            </span>
            <h2 className="font-heading text-lg font-bold text-text-primary mt-0.5">
              Unable to Load RFQs
            </h2>
            <p className="text-sm text-text-secondary mt-1.5 font-body leading-relaxed">
              {result.error}
            </p>
            <div className="mt-4 pt-3 border-t border-border-default">
              <a
                href="/rfqs"
                className="text-xs font-mono font-bold text-accent hover:text-accent-hover transition-colors uppercase tracking-wider"
              >
                // Reload Page
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { active = [], deleted = [] } = result.data || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-default">
        <div>
          <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase block mb-1">
            PROCUREMENT MODULE // ACTIVE RFQS
          </span>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            Requests for Quotation
          </h1>
        </div>
        <Link
          href="/rfqs/new"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 border border-accent-hover rounded-sm transition-colors cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="square" d="M12 5v14M5 12h14" />
          </svg>
          <span>+ New RFQ</span>
        </Link>
      </div>

      {/* Client List Component handling Active & Recently Deleted RFQs */}
      <RFQList initialActiveRFQs={active} initialDeletedRFQs={deleted} />
    </div>
  );
}