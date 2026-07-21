"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RFQ, RFQStatus } from "@/types";
import { deleteRFQ, duplicateRFQ } from "@/actions/rfq";

interface RFQListProps {
  initialRFQs: RFQ[];
}

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

export default function RFQList({ initialRFQs }: RFQListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [thisMonthOnly, setThisMonthOnly] = useState(false);

  // Menu & Dialog state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deleteModalTitle, setDeleteModalTitle] = useState<string>("");

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Close open menu on click outside, scroll, or resize
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
        setMenuPos(null);
      }
    };
    const handleScrollOrResize = () => {
      if (openMenuId) {
        setOpenMenuId(null);
        setMenuPos(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [openMenuId]);

  const handleToggleMenu = (rfqId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (openMenuId === rfqId) {
      setOpenMenuId(null);
      setMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
      setOpenMenuId(rfqId);
    }
  };

  // Duplicate Action
  const handleDuplicate = (id: string) => {
    setOpenMenuId(null);
    setMenuPos(null);
    startTransition(async () => {
      const res = await duplicateRFQ(id);
      if (res.success) {
        showToast("RFQ duplicated successfully!", "success");
        router.refresh();
      } else {
        showToast(res.error || "Failed to duplicate RFQ.", "error");
      }
    });
  };

  // Delete Action
  const confirmDelete = () => {
    if (!deleteModalId) return;
    const targetId = deleteModalId;
    setDeleteModalId(null);

    startTransition(async () => {
      const res = await deleteRFQ(targetId);
      if (res.success) {
        showToast("RFQ deleted successfully.", "success");
        router.refresh();
      } else {
        showToast(res.error || "Failed to delete RFQ.", "error");
      }
    });
  };

  // Filter calculations
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const filteredRFQs = initialRFQs.filter((rfq) => {
    // 1. Search Query
    if (searchQuery.trim() && !rfq.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
      return false;
    }
    // 2. Status Filter
    if (statusFilter !== "ALL" && rfq.status !== statusFilter) {
      return false;
    }
    // 3. This Month Filter
    if (thisMonthOnly) {
      const created = new Date(rfq.created_at);
      if (created.getMonth() !== currentMonth || created.getFullYear() !== currentYear) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 border px-4 py-3 rounded-sm shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 ${
            toast.type === "success"
              ? "bg-bg-surface border-accent text-text-primary"
              : "bg-status-error-bg border-status-error text-status-error"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              toast.type === "success" ? "bg-accent animate-ping" : "bg-status-error"
            }`}
          />
          <span className="font-mono text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setDeleteModalId(null)}
        >
          <div
            className="w-full max-w-md bg-bg-base border border-border-strong p-6 shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5 mb-4">
              <div className="p-2 bg-status-error-bg text-status-error border border-status-error/30 rounded-sm shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[9px] text-status-error font-semibold tracking-wider uppercase block">
                  MUTATION // CONFIRM DELETION
                </span>
                <h3 className="font-heading text-lg font-bold text-text-primary mt-0.5">
                  Delete RFQ?
                </h3>
                <p className="text-xs text-text-secondary mt-1 font-body leading-relaxed">
                  Are you sure you want to delete <strong className="text-text-primary">&quot;{deleteModalTitle}&quot;</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default mt-4">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 border border-border-default hover:bg-bg-sunken text-text-secondary hover:text-text-primary text-xs font-semibold rounded-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirmDelete}
                className="bg-status-error hover:bg-status-error/90 text-white text-xs font-semibold px-4 py-2 border border-status-error rounded-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                {isPending ? "Deleting..." : "Delete RFQ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar: Search + Filter Tabs + Month Toggle + Count */}
      <div className="bg-bg-surface border border-border-default rounded-sm p-4 space-y-4 shadow-xs">
        {/* Search & Month Filter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search RFQs by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-bg-base border border-border-default rounded-sm font-body text-xs text-text-primary transition-all outline-hidden placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-text-muted hover:text-text-primary cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Month Toggle & Count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setThisMonthOnly(!thisMonthOnly)}
              className={`px-3 py-1.5 border text-xs font-mono font-medium rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
                thisMonthOnly
                  ? "bg-accent-light border-accent text-accent"
                  : "bg-bg-base border-border-default text-text-secondary hover:bg-bg-sunken"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>This Month</span>
            </button>

            <span className="font-mono text-xs text-text-muted bg-bg-sunken px-2.5 py-1 border border-border-default rounded-sm whitespace-nowrap">
              {filteredRFQs.length} total request{filteredRFQs.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider mr-1">
            STATUS:
          </span>
          {[
            { label: "All Status", value: "ALL" },
            { label: "Draft", value: "draft" },
            { label: "Sent", value: "sent" },
            { label: "Comparing", value: "comparing" },
            { label: "Closed", value: "closed" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1 text-xs font-mono rounded-sm border transition-all cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-accent hover:bg-accent-hover text-white border-accent-hover font-semibold"
                  : "bg-bg-base hover:bg-bg-sunken text-text-secondary border-border-default"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / Empty State */}
      {initialRFQs.length === 0 ? (
        /* Empty State with 3-Step Guide */
        <div className="bg-bg-surface border border-border-default rounded-sm p-8 sm:p-12 text-center max-w-4xl mx-auto my-8 shadow-xs">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-accent-light text-accent border border-accent-border mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="font-heading text-xl font-bold text-text-primary mb-2">
            No RFQs Created Yet
          </h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto mb-8 font-body">
            Streamline your procurement workflow in 3 simple steps. Get started by creating your first request for quotation.
          </p>

          {/* 3-Step Guide Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
            <div className="bg-bg-base border border-border-default p-5 rounded-sm relative">
              <div className="font-mono text-xs font-bold text-accent mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-sm bg-accent-light border border-accent-border flex items-center justify-center text-accent">1</span>
                STEP 01
              </div>
              <h3 className="font-heading text-sm font-bold text-text-primary mb-1">
                Create RFQ
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Paste your requirement specs or type manually to structure product details and quantity demands.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-sm relative">
              <div className="font-mono text-xs font-bold text-accent mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-sm bg-accent-light border border-accent-border flex items-center justify-center text-accent">2</span>
                STEP 02
              </div>
              <h3 className="font-heading text-sm font-bold text-text-primary mb-1">
                Send to Vendors
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Select target suppliers from your directory and send secure one-time response links.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-sm relative">
              <div className="font-mono text-xs font-bold text-accent mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-sm bg-accent-light border border-accent-border flex items-center justify-center text-accent">3</span>
                STEP 03
              </div>
              <h3 className="font-heading text-sm font-bold text-text-primary mb-1">
                Compare Quotes
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Receive standardized pricing responses and calculate total cost automatically side-by-side.
              </p>
            </div>
          </div>

          <Link
            href="/rfqs/new"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-6 py-2.5 border border-accent-hover rounded-sm transition-colors cursor-pointer shadow-xs"
          >
            <span>Create your first RFQ</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      ) : filteredRFQs.length === 0 ? (
        /* Filtered Empty State */
        <div className="bg-bg-surface border border-border-default rounded-sm p-8 text-center my-6">
          <p className="text-sm text-text-secondary font-body mb-3">
            No requests match your selected search query or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setThisMonthOnly(false);
            }}
            className="text-xs font-mono font-bold text-accent hover:underline uppercase tracking-wider cursor-pointer"
          >
            // Reset Filters
          </button>
        </div>
      ) : (
        /* RFQs Table */
        <div className="bg-bg-surface border border-border-default rounded-sm shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-default bg-bg-sunken text-[11px] font-heading font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4 w-32">RFQ ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Vendors Contacted</th>
                  <th className="py-3 px-4 text-center">Responses Received</th>
                  <th className="py-3 px-4">Date Created</th>
                  <th className="py-3 px-4 text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-bg-base font-body">
                {filteredRFQs.map((rfq, idx) => {
                  const createdDate = new Date(rfq.created_at);
                  const formattedDate = createdDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  // Generate formatted RFQ ID like RFQ-2026-001 based on index
                  const displayNum = String(filteredRFQs.length - idx).padStart(3, "0");
                  const displayId = `RFQ-${createdDate.getFullYear()}-${displayNum}`;

                  return (
                    <tr key={rfq.id} className="hover:bg-bg-surface/60 transition-colors">
                      {/* RFQ ID */}
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-accent whitespace-nowrap">
                        {displayId}
                      </td>

                      {/* Title with Doc Icon */}
                      <td className="py-3.5 px-4 font-medium text-text-primary max-w-xs">
                        <div className="flex items-center gap-2 truncate">
                          <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="square" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="truncate" title={rfq.title}>
                            {rfq.title}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={rfq.status} />
                      </td>

                      {/* Vendors Contacted */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-text-secondary">
                        {rfq.vendors_contacted ?? 0}
                      </td>

                      {/* Responses Received */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-text-secondary">
                        {rfq.quotes_received ?? 0}
                      </td>

                      {/* Date Created */}
                      <td className="py-3.5 px-4 font-mono text-xs text-text-muted whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Three-Dot Actions Menu */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => handleToggleMenu(rfq.id, e)}
                          className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-sunken rounded-sm transition-colors cursor-pointer"
                          aria-label="Actions menu"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>

                        {/* Floating Fixed Dropdown Menu Popup (No Table Scroll) */}
                        {openMenuId === rfq.id && menuPos && (
                          <div
                            ref={menuRef}
                            style={{
                              top: `${menuPos.top}px`,
                              right: `${menuPos.right}px`,
                            }}
                            className="fixed z-50 w-44 bg-bg-base border border-border-strong rounded-sm shadow-xl py-1 text-left animate-in fade-in zoom-in-95 duration-100"
                          >
                            <Link
                              href={`/rfqs/${rfq.id}`}
                              onClick={() => {
                                setOpenMenuId(null);
                                setMenuPos(null);
                              }}
                              className="w-full px-3 py-2 text-xs font-mono text-text-primary hover:bg-bg-sunken flex items-center gap-2 cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="square" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="square" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View Details</span>
                            </Link>

                            <Link
                              href={`/rfqs/${rfq.id}/edit`}
                              onClick={() => {
                                setOpenMenuId(null);
                                setMenuPos(null);
                              }}
                              className="w-full px-3 py-2 text-xs font-mono text-text-primary hover:bg-bg-sunken flex items-center gap-2 cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="square" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </Link>

                            <button
                              onClick={() => handleDuplicate(rfq.id)}
                              className="w-full px-3 py-2 text-xs font-mono text-text-primary hover:bg-bg-sunken flex items-center gap-2 cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="square" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Duplicate</span>
                            </button>

                            <div className="my-1 border-t border-border-default" />

                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setMenuPos(null);
                                setDeleteModalId(rfq.id);
                                setDeleteModalTitle(rfq.title);
                              }}
                              className="w-full px-3 py-2 text-xs font-mono text-status-error hover:bg-status-error-bg flex items-center gap-2 cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5 text-status-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="square" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
