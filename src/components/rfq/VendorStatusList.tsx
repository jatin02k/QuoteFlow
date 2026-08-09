"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RFQStatus, RFQVendorWithDetails } from "@/types";
import { closeRFQ } from "@/actions/rfq";

interface VendorStatusListProps {
  rfqId: string;
  rfqStatus: RFQStatus;
  vendors: RFQVendorWithDetails[];
}

export default function VendorStatusList({
  rfqId,
  rfqStatus,
  vendors,
}: VendorStatusListProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<RFQStatus>(rfqStatus);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isClosed = currentStatus === "closed";
  const totalCount = vendors.length;
  const submittedCount = vendors.filter((v) => v.status === "submitted" || Boolean(v.quote)).length;
  const pendingCount = totalCount - submittedCount;

  async function handleCloseRFQ() {
    setIsClosing(true);
    setErrorMessage(null);

    try {
      const res = await closeRFQ(rfqId);
      if (res.success) {
        setCurrentStatus("closed");
        setShowConfirmModal(false);
        router.refresh();
      } else {
        setErrorMessage(res.error || "Failed to close RFQ.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred while closing the RFQ.");
    } finally {
      setIsClosing(false);
    }
  }

  return (
    <div className="bg-bg-surface border border-border-strong rounded-sm p-6 space-y-5 shadow-xs">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-default">
        <div>
          <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase block mb-0.5">
            SUPPLIER DISPATCH TRACKER
          </span>
          <h2 className="font-heading text-lg font-bold text-text-primary">
            Supplier Engagement & Status
          </h2>
        </div>

        <div>
          {isClosed ? (
            <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-mono font-bold bg-status-success-bg text-status-success border border-status-success/30 uppercase tracking-wider">
              ✓ RFQ Closed
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-base border border-border-default rounded-sm text-xs font-mono font-bold text-status-error hover:bg-status-error-bg hover:border-status-error transition-colors shadow-xs"
            >
              <span>🔒</span> Close RFQ
            </button>
          )}
        </div>
      </div>

      {/* Engagement Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-bg-base border border-border-subtle rounded-sm text-center">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
            Dispatched
          </div>
          <div className="text-xl font-mono font-bold text-text-primary mt-1">
            {totalCount}
          </div>
        </div>

        <div className="p-3 bg-status-success-bg/40 border border-status-success/20 rounded-sm text-center">
          <div className="text-[10px] font-mono text-status-success uppercase tracking-wider font-semibold">
            Submitted
          </div>
          <div className="text-xl font-mono font-bold text-status-success mt-1">
            {submittedCount}
          </div>
        </div>

        <div className="p-3 bg-status-warning-bg/40 border border-status-warning/20 rounded-sm text-center">
          <div className="text-[10px] font-mono text-status-warning uppercase tracking-wider font-semibold">
            Pending
          </div>
          <div className="text-xl font-mono font-bold text-status-warning mt-1">
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Dispatched Vendor List */}
      {vendors.length === 0 ? (
        <div className="p-6 bg-bg-base border border-border-subtle rounded-sm text-center text-xs text-text-muted font-body">
          No suppliers dispatched yet. Select and dispatch suppliers to track quote responses.
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="text-xs font-heading font-bold text-text-secondary uppercase tracking-wider px-1">
            Dispatched Vendors ({vendors.length})
          </div>

          <div className="divide-y divide-border-subtle border border-border-default rounded-sm bg-bg-base overflow-hidden">
            {vendors.map((v) => {
              const isSubmitted = v.status === "submitted" || Boolean(v.quote);

              return (
                <div
                  key={v.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-bg-surface/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs text-text-primary">
                        {v.vendor.name}
                      </span>
                      {v.vendor.category && (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 bg-bg-sunken text-text-muted border border-border-subtle rounded-xs">
                          {v.vendor.category}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-text-muted flex items-center gap-3">
                      <span>{v.vendor.email}</span>
                      {v.email_sent_at && (
                        <span className="text-[10px] text-text-disabled">
                          Sent:{" "}
                          {new Date(v.email_sent_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isSubmitted ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold bg-status-success-bg text-status-success border border-status-success/30 uppercase tracking-wider">
                        ✓ Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold bg-status-warning-bg text-status-warning border border-status-warning/40 uppercase tracking-wider">
                        ⏳ Pending Response
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-base border border-border-strong rounded-sm max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-status-error-bg text-status-error rounded-sm shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-base font-bold text-text-primary">
                  Close Request for Quotation?
                </h3>
                <p className="text-xs text-text-secondary font-body leading-relaxed">
                  Are you sure you want to close this RFQ? Closing this RFQ will mark it as closed and prevent further vendor quote submissions.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-status-error-bg border border-status-error text-status-error text-xs rounded-sm">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setErrorMessage(null);
                }}
                disabled={isClosing}
                className="px-4 py-2 bg-bg-surface border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-sunken text-xs font-semibold rounded-sm transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCloseRFQ}
                disabled={isClosing}
                className="px-4 py-2 bg-status-error text-white font-bold text-xs rounded-sm hover:bg-red-800 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isClosing ? "Closing RFQ..." : "Confirm & Close RFQ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
