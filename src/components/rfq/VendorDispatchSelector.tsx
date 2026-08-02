"use client";

import React, { useState, useTransition } from "react";
import { Vendor } from "@/types";
import { sendRFQ } from "@/actions/rfq";

interface RFQVendorRecord {
  id: string;
  rfq_id: string;
  vendor_id: string;
  token: string;
  status: string;
  email_sent_at: string | null;
}

interface VendorDispatchSelectorProps {
  rfqId: string;
  rfqStatus: string;
  vendors: Vendor[];
  rfqVendors: RFQVendorRecord[];
}

const CATEGORIES = [
  "All",
  "Raw Material",
  "Components",
  "Packaging",
  "Electrical",
  "Chemicals",
  "Machinery",
  "Other",
] as const;

export default function VendorDispatchSelector({
  rfqId,
  rfqStatus,
  vendors,
  rfqVendors,
}: VendorDispatchSelectorProps) {
  const [sentVendorIds, setSentVendorIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    rfqVendors.forEach((rv) => {
      if (rv.email_sent_at) {
        set.add(rv.vendor_id);
      }
    });
    return set;
  });

  const [selectedVendorIds, setSelectedVendorIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Filter vendors based on search query and category
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Selectable vendors (excluding already sent)
  const selectableFilteredVendors = filteredVendors.filter(
    (v) => !sentVendorIds.has(v.id)
  );

  const toggleVendor = (id: string) => {
    if (sentVendorIds.has(id)) return;
    const next = new Set(selectedVendorIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedVendorIds(next);
  };

  const handleSelectAll = () => {
    const next = new Set(selectedVendorIds);
    selectableFilteredVendors.forEach((v) => next.add(v.id));
    setSelectedVendorIds(next);
  };

  const handleDeselectAll = () => {
    const next = new Set(selectedVendorIds);
    selectableFilteredVendors.forEach((v) => next.delete(v.id));
    setSelectedVendorIds(next);
  };

  const handleSend = () => {
    if (selectedVendorIds.size === 0) return;
    setFeedback(null);

    const idsToSend = Array.from(selectedVendorIds);

    startTransition(async () => {
      const res = await sendRFQ(rfqId, idsToSend);
      if (res.success) {
        const newlySent = new Set(sentVendorIds);
        idsToSend.forEach((id) => newlySent.add(id));
        setSentVendorIds(newlySent);
        setSelectedVendorIds(new Set());

        setFeedback({
          message: `Successfully dispatched RFQ emails to ${res.data.sent} vendor(s)${res.data.failed > 0 ? ` (${res.data.failed} failed)` : ""}.`,
          type: "success",
        });
      } else {
        setFeedback({
          message: res.error || "Failed to dispatch RFQ emails.",
          type: "error",
        });
      }
    });
  };

  return (
    <div className="bg-bg-surface border border-border-strong rounded-sm p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-default">
        <div>
          <span className="font-mono text-[9px] text-accent font-semibold tracking-wider uppercase block">
            DISPATCH ENGINE // VENDOR SELECTION
          </span>
          <h2 className="font-heading text-lg font-bold text-text-primary mt-0.5">
            SEND TO VENDORS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {sentVendorIds.size > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-bold bg-status-success-bg text-status-success border border-status-success/30 uppercase tracking-wider">
              SENT ({sentVendorIds.size})
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono font-bold bg-bg-sunken text-text-secondary border border-border-default uppercase tracking-wider">
              DRAFT
            </span>
          )}
        </div>
      </div>

      {/* Confirmation Box if status is sent or has sent vendors */}
      {sentVendorIds.size > 0 && (
        <div className="p-3 bg-accent-light border border-accent-border rounded-sm text-xs text-accent font-mono flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="square" d="M5 13l4 4L19 7" />
          </svg>
          <span>RFQ previously dispatched to {sentVendorIds.size} vendor(s). You can select additional suppliers below.</span>
        </div>
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3 rounded-sm text-xs font-body leading-relaxed flex items-start gap-2 ${
            feedback.type === "success"
              ? "bg-status-success-bg border border-status-success/30 text-status-success"
              : "bg-status-error-bg border border-status-error text-status-error"
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {feedback.type === "success" ? "✓" : "⚠"}
          </div>
          <div>{feedback.message}</div>
        </div>
      )}

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Filter vendors by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 bg-bg-base border border-border-default rounded-sm text-xs font-body text-text-primary focus:outline-hidden focus:border-accent"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border-default pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-colors cursor-pointer ${
                isActive
                  ? "bg-accent text-white font-semibold"
                  : "bg-bg-base hover:bg-bg-sunken text-text-secondary border border-border-subtle"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Select/Deselect All & Count */}
      <div className="flex items-center justify-between text-xs font-mono pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            disabled={selectableFilteredVendors.length === 0 || isPending}
            className="text-accent hover:underline disabled:opacity-50 cursor-pointer text-[11px]"
          >
            Select All
          </button>
          <span className="text-text-muted">|</span>
          <button
            onClick={handleDeselectAll}
            disabled={selectedVendorIds.size === 0 || isPending}
            className="text-text-secondary hover:underline disabled:opacity-50 cursor-pointer text-[11px]"
          >
            Deselect All
          </button>
        </div>
        <span className="text-text-primary font-bold text-[11px]">
          {selectedVendorIds.size} selected
        </span>
      </div>

      {/* Vendors Checkbox List */}
      <div className="max-h-72 overflow-y-auto border border-border-default bg-bg-base rounded-sm divide-y divide-border-subtle">
        {vendors.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted font-body">
            No vendors found in your directory. Please add vendors from the Suppliers tab first.
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted font-body">
            No vendors match your search or filter criteria.
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const isSent = sentVendorIds.has(vendor.id);
            const isChecked = isSent || selectedVendorIds.has(vendor.id);

            return (
              <div
                key={vendor.id}
                onClick={() => !isSent && toggleVendor(vendor.id)}
                className={`p-3 flex items-center justify-between text-xs transition-colors ${
                  isSent
                    ? "bg-bg-sunken/50 opacity-85 cursor-not-allowed"
                    : "hover:bg-bg-sunken/40 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isSent || isPending}
                    onChange={() => toggleVendor(vendor.id)}
                    className="h-4 w-4 rounded-sm border-border-strong text-accent focus:ring-accent accent-accent cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="truncate">
                    <div className="font-semibold text-text-primary truncate">
                      {vendor.name}
                    </div>
                    <div className="font-mono text-[11px] text-text-muted truncate">
                      {vendor.email}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-3">
                  {isSent ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-status-success-bg text-status-success border border-status-success/30 uppercase">
                      Sent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono text-text-muted bg-bg-surface border border-border-default">
                      {vendor.category}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Send Action Button */}
      <div className="pt-2">
        <button
          onClick={handleSend}
          disabled={selectedVendorIds.size === 0 || isPending}
          className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-sm border border-accent-hover transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-heading"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Dispatching Emails...</span>
            </>
          ) : (
            <span>
              Send RFQ to {selectedVendorIds.size} Vendor{selectedVendorIds.size === 1 ? "" : "s"} →
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
