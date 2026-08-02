"use client";

import React, { useState, useTransition } from "react";
import { submitQuote } from "@/actions/quote";

interface VendorQuoteResponseFormProps {
  token: string;
  defaultQuantity: number;
  companyName: string;
  defaultValidUntil: string;
}

const PAYMENT_TERMS = ["Advance", "Net 30", "Net 45", "Net 60"] as const;

export default function VendorQuoteResponseForm({
  token,
  defaultQuantity,
  companyName,
  defaultValidUntil,
}: VendorQuoteResponseFormProps) {
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [quantityAvailable, setQuantityAvailable] = useState<string>(String(defaultQuantity || 1));
  const [leadTimeDays, setLeadTimeDays] = useState<string>("7");
  const [paymentTerms, setPaymentTerms] = useState<typeof PAYMENT_TERMS[number]>("Net 30");
  const [validUntil, setValidUntil] = useState<string>(defaultValidUntil);
  const [notes, setNotes] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(unitPrice);
    const qtyNum = parseInt(quantityAvailable, 10);
    const leadNum = parseInt(leadTimeDays, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid unit price greater than ₹0.");
      return;
    }
    if (isNaN(qtyNum) || qtyNum < 1) {
      setError("Please enter a valid quantity available (minimum 1).");
      return;
    }
    if (isNaN(leadNum) || leadNum < 1) {
      setError("Please enter a valid lead time in days.");
      return;
    }
    if (!validUntil) {
      setError("Please select a valid until date.");
      return;
    }

    const payload = {
      unit_price: priceNum,
      quantity_available: qtyNum,
      lead_time_days: leadNum,
      payment_terms: paymentTerms,
      valid_until: validUntil,
      notes: notes.trim() || undefined,
    };

    startTransition(async () => {
      const res = await submitQuote(token, payload);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || "Failed to submit quote. Please try again.");
      }
    });
  };

  if (submitted) {
    return (
      <div className="bg-bg-surface border border-status-success/40 p-8 rounded-sm text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-status-success-bg text-status-success rounded-full flex items-center justify-center mx-auto border border-status-success/30">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="square" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-mono text-[10px] text-status-success font-bold tracking-widest uppercase block">
          SUBMISSION CONFIRMED // SUCCESS
        </span>
        <h2 className="font-heading text-2xl font-bold text-text-primary">
          Quote Submitted Successfully
        </h2>
        <p className="text-sm font-body text-text-secondary leading-relaxed max-w-md mx-auto">
          Thank you for providing your pricing and delivery response. <strong>{companyName}</strong> has been notified and will review your quotation shortly.
        </p>
        <div className="pt-4 border-t border-border-default text-xs font-mono text-text-muted">
          Reference single-use token verified & locked.
        </div>
      </div>
    );
  }

  const numericPrice = parseFloat(unitPrice) || 0;
  const numericQty = parseInt(quantityAvailable, 10) || 0;
  const calculatedTotal = numericPrice * numericQty;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-bg-surface border border-border-strong p-6 sm:p-8 rounded-sm shadow-md">
      {error && (
        <div className="p-3.5 bg-status-error-bg border border-status-error text-status-error text-xs font-body rounded-sm flex items-start gap-2.5">
          <span className="font-bold shrink-0">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Pricing & Quantity Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Unit Price */}
        <div>
          <label htmlFor="unit_price" className="block font-heading text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Unit Price (₹) <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted font-mono font-bold text-sm">
              ₹
            </span>
            <input
              id="unit_price"
              type="number"
              step="0.01"
              min="0.01"
              required
              disabled={isPending}
              placeholder="0.00"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 bg-bg-base border border-border-default rounded-sm font-mono text-base font-bold text-text-primary focus:outline-hidden focus:border-accent"
            />
          </div>
        </div>

        {/* Quantity Available */}
        <div>
          <label htmlFor="quantity_available" className="block font-heading text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Quantity Available <span className="text-accent">*</span>
          </label>
          <input
            id="quantity_available"
            type="number"
            min="1"
            required
            disabled={isPending}
            placeholder={String(defaultQuantity)}
            value={quantityAvailable}
            onChange={(e) => setQuantityAvailable(e.target.value)}
            className="w-full px-3 py-2.5 bg-bg-base border border-border-default rounded-sm font-mono text-base text-text-primary focus:outline-hidden focus:border-accent"
          />
        </div>
      </div>

      {/* Dynamic Total Preview Box */}
      {calculatedTotal > 0 && (
        <div className="p-3 bg-accent-light/60 border border-accent-border rounded-sm flex items-center justify-between font-mono text-xs text-accent">
          <span>Estimated Total Value:</span>
          <span className="font-bold text-sm">
            ₹{calculatedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}

      {/* Delivery & Payment Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lead Time */}
        <div>
          <label htmlFor="lead_time_days" className="block font-heading text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Lead Time (Days) <span className="text-accent">*</span>
          </label>
          <input
            id="lead_time_days"
            type="number"
            min="1"
            required
            disabled={isPending}
            placeholder="e.g. 7"
            value={leadTimeDays}
            onChange={(e) => setLeadTimeDays(e.target.value)}
            className="w-full px-3 py-2.5 bg-bg-base border border-border-default rounded-sm font-mono text-sm text-text-primary focus:outline-hidden focus:border-accent"
          />
        </div>

        {/* Payment Terms */}
        <div>
          <label htmlFor="payment_terms" className="block font-heading text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Payment Terms <span className="text-accent">*</span>
          </label>
          <select
            id="payment_terms"
            required
            disabled={isPending}
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value as typeof PAYMENT_TERMS[number])}
            className="w-full px-3 py-2.5 bg-bg-base border border-border-default rounded-sm font-body text-sm text-text-primary focus:outline-hidden focus:border-accent cursor-pointer"
          >
            {PAYMENT_TERMS.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Valid Until Date */}
      <div>
        <label htmlFor="valid_until" className="block font-heading text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
          Quote Valid Until <span className="text-accent">*</span>
        </label>
        <input
          id="valid_until"
          type="date"
          required
          disabled={isPending}
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          className="w-full px-3 py-2.5 bg-bg-base border border-border-default rounded-sm font-mono text-sm text-text-primary focus:outline-hidden focus:border-accent cursor-pointer"
        />
      </div>

      {/* Notes / Comments */}
      <div>
        <label htmlFor="notes" className="block font-heading text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
          Additional Notes / Remarks <span className="text-text-muted text-[10px] lowercase font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          disabled={isPending}
          placeholder="Specify GST inclusion, freight charges, minimum order terms, or technical deviations..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2.5 bg-bg-base border border-border-default rounded-sm font-body text-xs text-text-primary focus:outline-hidden focus:border-accent"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-6 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded-sm border border-accent-hover transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md uppercase tracking-wider font-heading disabled:opacity-50"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Submitting Quote...</span>
            </>
          ) : (
            <span>Submit Quotation →</span>
          )}
        </button>
      </div>
    </form>
  );
}
