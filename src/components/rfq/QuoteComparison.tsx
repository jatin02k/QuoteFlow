"use client";

import React from "react";
import { RFQVendorWithDetails } from "@/types";

interface QuoteComparisonProps {
  vendors: RFQVendorWithDetails[];
  lowestUnitPrice: number | null;
}

export default function QuoteComparison({
  vendors,
  lowestUnitPrice,
}: QuoteComparisonProps) {
  // If no vendors dispatched at all, show empty card
  if (!vendors || vendors.length === 0) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-sm p-8 text-center space-y-3 shadow-xs">
        <div className="mx-auto w-12 h-12 rounded-full bg-bg-sunken flex items-center justify-center text-text-muted">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="font-heading text-base font-bold text-text-primary">
          No Quotes Received Yet
        </h3>
        <p className="text-xs text-text-muted font-body max-w-md mx-auto leading-relaxed">
          No quotes received yet. Dispatched suppliers will appear here once submitted.
        </p>
      </div>
    );
  }

  // Count active submitted quotes
  const submittedCount = vendors.filter((v) => v.quote !== null && v.quote !== undefined).length;

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-subtle">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
            <span>Quote Comparison Matrix</span>
            <span className="text-xs font-mono font-normal text-text-muted">
              ({submittedCount} / {vendors.length} Submitted)
            </span>
          </h2>
          <p className="text-xs text-text-muted font-body">
            Compare unit pricing, total costs, lead times, and payment terms across dispatched suppliers.
          </p>
        </div>

        {lowestUnitPrice !== null && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-status-success-bg border border-status-success/30 rounded-sm">
            <span className="text-[10px] font-mono font-bold text-status-success uppercase tracking-wider">
              Lowest Unit Price:
            </span>
            <span className="font-mono text-xs font-bold text-status-success">
              ₹{lowestUnitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="border border-border-strong rounded-sm overflow-hidden bg-bg-base shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-bg-surface border-b border-border-strong text-xs font-heading font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[180px]">Vendor Name</th>
                <th className="py-3 px-4 min-w-[140px] text-right">Unit Price (₹)</th>
                <th className="py-3 px-4 min-w-[140px] text-right">Total Cost (₹)</th>
                <th className="py-3 px-4 min-w-[120px] text-center">Lead Time</th>
                <th className="py-3 px-4 min-w-[120px]">Payment Terms</th>
                <th className="py-3 px-4 min-w-[120px]">Valid Until</th>
                <th className="py-3 px-4 min-w-[160px]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs font-body">
              {vendors.map((v) => {
                const isSubmitted = Boolean(v.quote);
                const quote = v.quote;
                const isLowest =
                  isSubmitted &&
                  quote?.unit_price !== undefined &&
                  lowestUnitPrice !== null &&
                  quote.unit_price === lowestUnitPrice;

                return (
                  <tr
                    key={v.id}
                    className={`transition-colors hover:bg-bg-surface/60 ${
                      isLowest ? "bg-status-success-bg/40" : ""
                    }`}
                  >
                    {/* Vendor Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-text-primary flex items-center gap-1.5">
                        {v.vendor.name}
                        {isLowest && (
                          <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase bg-status-success text-white rounded-xs">
                            Best Rate
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-muted font-mono truncate max-w-[200px]">
                        {v.vendor.email}
                      </div>
                    </td>

                    {/* Unit Price (₹) */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      {isSubmitted && quote ? (
                        <div
                          className={`inline-flex items-center justify-end px-2.5 py-1 rounded-sm ${
                            isLowest
                              ? "bg-status-success-bg text-status-success border border-status-success/30 font-bold"
                              : "text-text-primary font-semibold"
                          }`}
                        >
                          ₹
                          {quote.unit_price.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-mono font-semibold bg-bg-sunken text-text-muted border border-border-default">
                          Awaiting Supplier Response
                        </span>
                      )}
                    </td>

                    {/* Total Cost (₹) */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      {isSubmitted && quote && quote.total_cost !== undefined ? (
                        <span className="font-bold text-text-primary">
                          ₹
                          {quote.total_cost.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      ) : (
                        <span className="text-text-disabled">-</span>
                      )}
                    </td>

                    {/* Lead Time (Days) */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      {isSubmitted && quote ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-bg-sunken text-text-secondary font-semibold border border-border-subtle">
                          {quote.lead_time_days} {quote.lead_time_days === 1 ? "day" : "days"}
                        </span>
                      ) : (
                        <span className="text-text-disabled">-</span>
                      )}
                    </td>

                    {/* Payment Terms */}
                    <td className="py-3.5 px-4 font-mono text-text-secondary">
                      {isSubmitted && quote ? quote.payment_terms : <span className="text-text-disabled">-</span>}
                    </td>

                    {/* Valid Until */}
                    <td className="py-3.5 px-4 font-mono text-text-secondary">
                      {isSubmitted && quote ? (
                        <span>
                          {new Date(quote.valid_until).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      ) : (
                        <span className="text-text-disabled">-</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4 text-text-secondary max-w-[200px] truncate">
                      {isSubmitted && quote && quote.notes ? (
                        <span title={quote.notes}>{quote.notes}</span>
                      ) : (
                        <span className="text-text-disabled">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
