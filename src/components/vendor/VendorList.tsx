"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteVendor } from "@/actions/vendor";
import { Vendor } from "@/types";
import VendorForm from "./VendorForm";

interface VendorListProps {
  initialVendors: Vendor[];
}

export default function VendorList({ initialVendors }: VendorListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  
  // Delete dialog states
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Filter vendors based on search and category
  const filteredVendors = initialVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All" || vendor.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEditClick = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingVendor(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setDeleteError(null);
  };

  const confirmDelete = () => {
    if (!vendorToDelete) return;

    startDeleteTransition(async () => {
      try {
        const res = await deleteVendor(vendorToDelete.id);
        if (res.success) {
          setVendorToDelete(null);
          router.refresh();
        } else {
          setDeleteError(res.error || "Failed to delete vendor.");
        }
      } catch (err) {
        console.error(err);
        setDeleteError("An unexpected error occurred during deletion.");
      }
    });
  };

  const handleFormSuccess = () => {
    router.refresh();
  };

  // Helper for category badge styling using the theme variables
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "Raw Material":
        return "bg-accent-light text-accent border-accent-border/30";
      case "Components":
        return "bg-status-success-bg text-status-success border-status-success/20";
      case "Packaging":
        return "bg-bg-sunken text-text-secondary border-border-strong/40";
      case "Electrical":
        return "bg-status-warning-bg text-status-warning border-status-warning/20";
      case "Chemicals":
        return "bg-status-error-bg text-status-error border-status-error/15";
      case "Machinery":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      default:
        return "bg-bg-surface text-text-muted border-border-default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Supplier Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border-default">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            Supplier Directory
          </h1>
          <p className="text-sm text-text-secondary mt-1 font-body">
            Manage your network of raw material, components, packaging, and machinery suppliers.
          </p>
        </div>
        <button
          id="btn-add-vendor"
          onClick={handleAddClick}
          className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2.5 border border-accent-hover rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs self-start sm:self-center"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="square" d="M12 4v16m-8-8h16" />
          </svg>
          Register Supplier
        </button>
      </div>

      {/* Main Content Layout */}
      {initialVendors.length === 0 ? (
        /* Empty State Layout */
        <div className="border border-border-default bg-bg-surface p-12 text-center rounded-sm max-w-2xl mx-auto my-12 shadow-xs">
          <div className="mx-auto w-16 h-16 bg-bg-sunken border border-border-default rounded-sm flex items-center justify-center text-text-muted mb-5">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M5 21H3m4 0h10M9 7h1m-1 4h1m4-4h1m-1 4h1" />
            </svg>
          </div>
          <span className="font-mono text-[9px] text-accent font-semibold tracking-wider uppercase block mb-1">
            REGISTRY EMPTY // P2P ENGINE
          </span>
          <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
            No Suppliers Registered Yet
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto mb-6">
            Build your supplier database. Dispatch active RFQs to multiple suppliers with one click and let QuoteFlow auto-compare incoming pricing models.
          </p>
          <button
            id="empty-state-add-vendor"
            onClick={handleAddClick}
            className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 border border-accent-hover rounded-sm inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="square" d="M12 4v16m-8-8h16" />
            </svg>
            Add Your First Supplier
          </button>
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-surface border border-border-default p-4 rounded-sm">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                id="vendor-search"
                type="text"
                placeholder="Search by supplier name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-bg-base border border-border-default rounded-sm text-sm text-text-primary focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all font-body placeholder:text-text-muted/60"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <label htmlFor="category-filter" className="text-xs font-heading font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                Category:
              </label>
              <div className="relative">
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-bg-base border border-border-default rounded-sm text-sm text-text-primary appearance-none focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer min-w-[160px]"
                >
                  <option value="All">All Categories</option>
                  <option value="Raw Material">Raw Material</option>
                  <option value="Components">Components</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-text-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center text-xs text-text-muted font-mono px-1">
            <span>SHOWING {filteredVendors.length} OF {initialVendors.length} SUPPLIERS</span>
            {searchQuery || selectedCategory !== "All" ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-accent hover:underline cursor-pointer"
              >
                RESET FILTERS
              </button>
            ) : null}
          </div>

          {/* Data Table */}
          {filteredVendors.length === 0 ? (
            <div className="border border-border-default bg-bg-surface p-12 text-center rounded-sm">
              <p className="text-sm text-text-secondary">No suppliers match your search filter criteria.</p>
            </div>
          ) : (
            <div className="border border-border-default bg-bg-base rounded-sm overflow-x-auto shadow-xs">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border-default bg-bg-surface font-heading text-xs font-bold text-text-secondary uppercase tracking-wider">
                    <th scope="col" className="px-6 py-3.5">Supplier Name</th>
                    <th scope="col" className="px-6 py-3.5">Category</th>
                    <th scope="col" className="px-6 py-3.5">Email Address</th>
                    <th scope="col" className="px-6 py-3.5">Phone Number</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-body text-text-primary">
                  {filteredVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="hover:bg-bg-sunken/45 transition-colors group"
                    >
                      <td className="px-6 py-4 font-semibold text-text-primary">
                        {vendor.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium font-mono border ${getCategoryStyles(vendor.category)}`}>
                          {vendor.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                        {vendor.email}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                        {vendor.phone || <span className="text-text-disabled">—</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleEditClick(vendor)}
                            className="p-1 text-text-muted hover:text-accent hover:bg-bg-sunken border border-transparent hover:border-border-default rounded-sm transition-all cursor-pointer"
                            title="Edit Supplier"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="square" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(vendor)}
                            className="p-1 text-text-muted hover:text-status-error hover:bg-status-error-bg border border-transparent hover:border-status-error/20 rounded-sm transition-all cursor-pointer"
                            title="Delete Supplier"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="square" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Form Modal */}
      <VendorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        vendor={editingVendor}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {vendorToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => {
            if (!isDeleting) setVendorToDelete(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div
            className="w-full max-w-md bg-bg-base border border-border-strong p-6 shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 rounded-sm"
            style={{ borderRadius: "4px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-default mb-4">
              <div>
                <span className="font-mono text-[9px] text-status-error font-semibold tracking-wider uppercase block">
                  DESTRUCTIVE MUTATION // SYSTEM WARN
                </span>
                <h2
                  id="delete-modal-title"
                  className="font-heading text-lg font-bold tracking-tight text-text-primary mt-0.5"
                >
                  Delete Supplier Record
                </h2>
              </div>
              <button
                disabled={isDeleting}
                onClick={() => setVendorToDelete(null)}
                className="text-text-muted hover:text-text-primary p-1 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                aria-label="Close dialog"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error Banner */}
            {deleteError && (
              <div className="mb-4 p-3 bg-status-error-bg border border-status-error text-status-error text-xs rounded-sm">
                {deleteError}
              </div>
            )}

            {/* Content */}
            <div className="space-y-4">
              <p className="text-sm text-text-secondary leading-relaxed">
                Are you sure you want to delete the supplier record for <strong className="text-text-primary font-semibold">{vendorToDelete.name}</strong>?
              </p>
              <div className="p-3 bg-bg-sunken border border-border-default text-xs text-text-muted space-y-1.5 rounded-sm">
                <p className="font-semibold text-text-secondary">SYSTEM IMPACTS:</p>
                <ul className="list-disc pl-4 space-y-1 font-mono text-[11px]">
                  <li>Vendor access credentials will be immediately revoked.</li>
                  <li>Ongoing quotes for pending RFQs will be permanently deleted.</li>
                  <li>Historical logs for this vendor will become inaccessible.</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default mt-6">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setVendorToDelete(null)}
                className="px-4 py-2 border border-border-default hover:bg-bg-sunken text-text-secondary hover:text-text-primary text-sm font-semibold rounded-sm transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="bg-status-error hover:bg-red-800 text-white text-sm font-semibold px-5 py-2 border border-transparent rounded-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Supplier</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
