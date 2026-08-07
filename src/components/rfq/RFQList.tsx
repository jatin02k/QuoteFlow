"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RFQ, RFQStatus } from "@/types";
import { deleteRFQ, duplicateRFQ, restoreRFQ, hardDeleteRFQ } from "@/actions/rfq";

interface RFQListProps {
  initialActiveRFQs?: RFQ[];
  initialDeletedRFQs?: RFQ[];
  initialRFQs?: RFQ[];
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
    case "deleted":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-medium bg-status-error-bg text-status-error border border-status-error/30 uppercase tracking-wider">
          Deleted
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

function getDaysRemaining(deletedAtIso?: string | null): number {
  if (!deletedAtIso) return 7;
  const deletedTime = new Date(deletedAtIso).getTime();
  const elapsedDays = (Date.now() - deletedTime) / (1000 * 60 * 60 * 24);
  const remaining = Math.ceil(7 - elapsedDays);
  return Math.max(1, Math.min(7, remaining));
}

export default function RFQList({
  initialActiveRFQs = [],
  initialDeletedRFQs = [],
  initialRFQs,
}: RFQListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active vs Deleted View Mode Toggle
  const [viewMode, setViewMode] = useState<"active" | "deleted">("active");

  // Track permanently deleted IDs locally during session to prevent re-rendering
  const permanentlyDeletedIdsRef = useRef<Set<string>>(new Set());

  // Active & Deleted state
  const activeSource = initialRFQs || initialActiveRFQs;
  const [activeRFQs, setActiveRFQs] = useState<RFQ[]>(
    activeSource.filter((r) => !permanentlyDeletedIdsRef.current.has(r.id))
  );
  const [deletedRFQs, setDeletedRFQs] = useState<RFQ[]>(
    initialDeletedRFQs.filter((r) => !permanentlyDeletedIdsRef.current.has(r.id))
  );

  useEffect(() => {
    const rawActive = initialRFQs || initialActiveRFQs;
    setActiveRFQs(
      rawActive.filter((r) => !permanentlyDeletedIdsRef.current.has(r.id))
    );
    setDeletedRFQs(
      initialDeletedRFQs.filter((r) => !permanentlyDeletedIdsRef.current.has(r.id))
    );
  }, [initialActiveRFQs, initialDeletedRFQs, initialRFQs]);

  // Filters for Active List
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [thisMonthOnly, setThisMonthOnly] = useState(false);

  // Menu & Dialog state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  
  // Soft Delete Modal State
  const [softDeleteModalId, setSoftDeleteModalId] = useState<string | null>(null);
  const [softDeleteModalTitle, setSoftDeleteModalTitle] = useState<string>("");

  // Hard Delete Modal State
  const [hardDeleteModalId, setHardDeleteModalId] = useState<string | null>(null);
  const [hardDeleteModalTitle, setHardDeleteModalTitle] = useState<string>("");

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
      const rightPos = Math.max(12, window.innerWidth - rect.right);
      const topPos = Math.min(rect.bottom + 4, window.innerHeight - 180);
      setMenuPos({
        top: topPos,
        right: rightPos,
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

  // Soft Delete Action
  const confirmSoftDelete = () => {
    if (!softDeleteModalId) return;
    const targetId = softDeleteModalId;
    const targetTitle = softDeleteModalTitle;
    setSoftDeleteModalId(null);

    // Optimistic UI update
    const targetItem = activeRFQs.find((r) => r.id === targetId);
    if (targetItem) {
      setActiveRFQs((prev) => prev.filter((r) => r.id !== targetId));
      setDeletedRFQs((prev) => [
        {
          ...targetItem,
          status: "deleted",
          deleted_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    startTransition(async () => {
      const res = await deleteRFQ(targetId);
      if (res.success) {
        showToast(`"${targetTitle}" moved to Recently Deleted (auto-purged in 7 days).`, "success");
        router.refresh();
      } else {
        showToast(res.error || "Failed to delete RFQ.", "error");
        router.refresh();
      }
    });
  };

  // Restore Action
  const handleRestore = (id: string, title: string) => {
    // Optimistic UI update
    const targetItem = deletedRFQs.find((r) => r.id === id);
    if (targetItem) {
      setDeletedRFQs((prev) => prev.filter((r) => r.id !== id));
      setActiveRFQs((prev) => [
        { ...targetItem, status: "draft" },
        ...prev,
      ]);
    }

    startTransition(async () => {
      const res = await restoreRFQ(id);
      if (res.success) {
        showToast(`"${title}" restored to Active RFQs list.`, "success");
        router.refresh();
      } else {
        showToast(res.error || "Failed to restore RFQ.", "error");
        router.refresh();
      }
    });
  };

  // Hard Delete Action
  const confirmHardDelete = () => {
    if (!hardDeleteModalId) return;
    const targetId = hardDeleteModalId;
    const targetTitle = hardDeleteModalTitle;
    setHardDeleteModalId(null);

    // Track permanently deleted ID
    permanentlyDeletedIdsRef.current.add(targetId);

    // Optimistic UI update - remove from state immediately
    setDeletedRFQs((prev) => prev.filter((r) => r.id !== targetId));
    setActiveRFQs((prev) => prev.filter((r) => r.id !== targetId));

    startTransition(async () => {
      const res = await hardDeleteRFQ(targetId);
      if (res.success) {
        showToast(`"${targetTitle}" permanently deleted.`, "success");
        router.refresh();
      } else {
        permanentlyDeletedIdsRef.current.delete(targetId);
        showToast(res.error || "Failed to permanently delete RFQ.", "error");
        router.refresh();
      }
    });
  };

  // Active RFQ Filter calculations
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const filteredRFQs = activeRFQs.filter((rfq) => {
    if (searchQuery.trim() && !rfq.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
      return false;
    }
    if (statusFilter !== "ALL" && rfq.status !== statusFilter) {
      return false;
    }
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

      {/* Soft Delete Confirmation Modal */}
      {softDeleteModalId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setSoftDeleteModalId(null)}
        >
          <div
            className="w-full max-w-md bg-bg-base border border-border-strong p-6 shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5 mb-4">
              <div className="p-2 bg-status-warning/10 text-status-warning border border-status-warning/30 rounded-sm shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[9px] text-status-warning font-semibold tracking-wider uppercase block">
                  MUTATION // SOFT DELETE RFQ
                </span>
                <h3 className="font-heading text-lg font-bold text-text-primary mt-0.5">
                  Move RFQ to Trash?
                </h3>
                <p className="text-xs text-text-secondary mt-1 font-body leading-relaxed">
                  Are you sure you want to delete <strong className="text-text-primary">&quot;{softDeleteModalTitle}&quot;</strong>? It will be moved to <strong className="text-text-primary">Recently Deleted RFQs</strong> and automatically purged after 7 days.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default mt-4">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setSoftDeleteModalId(null)}
                className="px-4 py-2 border border-border-default hover:bg-bg-sunken text-text-secondary hover:text-text-primary text-xs font-semibold rounded-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirmSoftDelete}
                className="bg-status-warning hover:bg-status-warning/90 text-white text-xs font-semibold px-4 py-2 border border-status-warning rounded-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                {isPending ? "Moving to Trash..." : "Move to Trash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hard Delete Confirmation Modal */}
      {hardDeleteModalId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setHardDeleteModalId(null)}
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
                  MUTATION // HARD DELETE PERMANENT
                </span>
                <h3 className="font-heading text-lg font-bold text-text-primary mt-0.5">
                  Permanently Delete RFQ?
                </h3>
                <p className="text-xs text-text-secondary mt-1 font-body leading-relaxed">
                  Are you sure you want to permanently erase <strong className="text-text-primary">&quot;{hardDeleteModalTitle}&quot;</strong>? This action <strong className="text-status-error">cannot be undone</strong> and will delete all quotes associated with it.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default mt-4">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setHardDeleteModalId(null)}
                className="px-4 py-2 border border-border-default hover:bg-bg-sunken text-text-secondary hover:text-text-primary text-xs font-semibold rounded-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirmHardDelete}
                className="bg-status-error hover:bg-status-error/90 text-white text-xs font-semibold px-4 py-2 border border-status-error rounded-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                {isPending ? "Erasing..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TOGGLE TABS: ACTIVE RFQS VS RECENTLY DELETED */}
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("active")}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-sm border transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "active"
                ? "bg-accent text-white border-accent-hover shadow-xs"
                : "bg-bg-base text-text-secondary hover:text-text-primary border-border-default hover:bg-bg-sunken"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Active RFQs</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              viewMode === "active" ? "bg-white/20 text-white" : "bg-bg-sunken text-text-muted border border-border-default"
            }`}>
              {activeRFQs.length}
            </span>
          </button>

          <button
            onClick={() => setViewMode("deleted")}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-sm border transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "deleted"
                ? "bg-status-error text-white border-status-error shadow-xs"
                : "bg-bg-base text-text-secondary hover:text-status-error border-border-default hover:bg-status-error-bg/30"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Recently Deleted</span>
            {deletedRFQs.length > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                viewMode === "deleted"
                  ? "bg-white/20 text-white"
                  : "bg-status-error-bg text-status-error border border-status-error/30"
              }`}>
                {deletedRFQs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MODE 1: ACTIVE RFQS VIEW */}
      {viewMode === "active" && (
        <div className="space-y-4">
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
                  placeholder="Search active RFQs by title..."
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
                  {filteredRFQs.length} active request{filteredRFQs.length === 1 ? "" : "s"}
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

          {/* Main Active Table / Empty State */}
          {activeRFQs.length === 0 ? (
            /* Empty State with 3-Step Guide */
            <div className="bg-bg-surface border border-border-default rounded-sm p-8 sm:p-12 text-center max-w-4xl mx-auto my-6 shadow-xs">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-accent-light text-accent border border-accent-border mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-bold text-text-primary mb-2">
                No Active RFQs
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
            /* Active RFQs Table */
            <div className="bg-bg-surface border border-border-default rounded-sm shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[650px]">
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

                            {/* Floating Dropdown Menu */}
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
                                    setSoftDeleteModalId(rfq.id);
                                    setSoftDeleteModalTitle(rfq.title);
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
      )}

      {/* MODE 2: RECENTLY DELETED RFQS VIEW */}
      {viewMode === "deleted" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-status-error-bg/30 border border-status-error/20 rounded-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-status-error text-white rounded-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Recently Deleted RFQs (Trash)
                </h3>
                <p className="text-xs text-text-secondary font-body">
                  Items in trash are automatically hard-deleted after 7 days unless restored.
                </p>
              </div>
            </div>

            <span className="font-mono text-xs text-status-error bg-bg-base px-3 py-1 border border-status-error/30 rounded-sm font-semibold self-start sm:self-auto">
              {deletedRFQs.length} item{deletedRFQs.length === 1 ? "" : "s"} in trash
            </span>
          </div>

          {deletedRFQs.length === 0 ? (
            /* Trash Empty State */
            <div className="bg-bg-surface border border-border-default rounded-sm p-12 text-center my-6 shadow-xs">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-status-success-bg text-status-success border border-status-success/30 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-text-primary mb-1">
                Trash is Empty
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6 font-body">
                There are no recently deleted requests. Any RFQ you delete will stay here for 7 days before permanent removal.
              </p>
              <button
                onClick={() => setViewMode("active")}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-2 border border-accent-hover rounded-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>Back to Active RFQs</span>
              </button>
            </div>
          ) : (
            /* Trash Table */
            <div className="bg-bg-surface border border-border-default rounded-sm shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border-default bg-bg-sunken text-[11px] font-heading font-semibold text-text-secondary uppercase tracking-wider">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Auto Purge Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle bg-bg-base font-body">
                    {deletedRFQs.map((rfq) => {
                      const daysLeft = getDaysRemaining(rfq.deleted_at || (rfq.parsed_data as any)?.deleted_at);

                      return (
                        <tr key={rfq.id} className="hover:bg-bg-surface/60 transition-colors">
                          {/* Title */}
                          <td className="py-3.5 px-4 font-medium text-text-primary max-w-xs">
                            <div className="flex items-center gap-2 truncate">
                              <svg className="w-4 h-4 text-status-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="square" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="truncate text-text-secondary line-through" title={rfq.title}>
                                {rfq.title}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <StatusBadge status="deleted" />
                          </td>

                          {/* Days Remaining Countdown */}
                          <td className="py-3.5 px-4 font-mono text-xs">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-status-warning/10 text-status-warning border border-status-warning/30 font-semibold">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="square" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Auto-purges in {daysLeft} day{daysLeft === 1 ? "" : "s"}
                            </span>
                          </td>

                          {/* Restore & Hard Delete Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleRestore(rfq.id, rfq.title)}
                                disabled={isPending}
                                className="px-3 py-1.5 border border-accent/40 bg-accent-light hover:bg-accent text-accent hover:text-white text-xs font-mono font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="square" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Restore</span>
                              </button>

                              <button
                                onClick={() => {
                                  setHardDeleteModalId(rfq.id);
                                  setHardDeleteModalTitle(rfq.title);
                                }}
                                disabled={isPending}
                                className="px-3 py-1.5 border border-status-error/40 bg-status-error-bg hover:bg-status-error text-status-error hover:text-white text-xs font-mono font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="square" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete Permanently</span>
                              </button>
                            </div>
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
      )}
    </div>
  );
}
