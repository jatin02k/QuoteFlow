'use client'

import React, { useState } from 'react'

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'parser' | 'dispatch'>('matrix')

  return (
    <div className="w-full bg-bg-surface border border-border-strong rounded-md overflow-hidden text-text-primary">
      {/* Top Header Bar */}
      <div className="bg-bg-sunken border-b border-border-default px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-success inline-block"></span>
            <span className="font-mono text-[11px] font-bold text-text-primary uppercase tracking-wide">
              LIVE SYSTEM PREVIEW
            </span>
          </div>
          <span className="text-border-strong font-mono text-[11px]">|</span>
          <span className="font-mono text-[11px] text-text-muted hidden sm:inline">
            RFQ-2026-084 // MS STAINLESS STEEL 304 & FLANGES
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-bg-base p-0.5 border border-border-default rounded-sm gap-0.5">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-sm transition-colors ${
              activeTab === 'matrix'
                ? 'bg-accent text-white font-bold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-sunken'
            }`}
          >
            [01] MATRIX
          </button>
          <button
            onClick={() => setActiveTab('parser')}
            className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-sm transition-colors ${
              activeTab === 'parser'
                ? 'bg-accent text-white font-bold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-sunken'
            }`}
          >
            [02] PARSER
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-sm transition-colors ${
              activeTab === 'dispatch'
                ? 'bg-accent text-white font-bold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-sunken'
            }`}
          >
            [03] DISPATCH
          </button>
        </div>
      </div>

      {/* Tab Content 1: Comparison Matrix */}
      {activeTab === 'matrix' && (
        <div className="p-3 sm:p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-border-subtle">
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-text-primary">
                Quotation Comparison Matrix
              </h4>
              <p className="text-[11px] text-text-muted font-body">
                Auto-calculated landed cost (2,500 kg raw material order)
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase bg-status-success-bg text-status-success border border-status-success/30 px-1.5 py-0.5 rounded-sm font-bold">
                ● 3 Quotes Received
              </span>
              <span className="text-[10px] font-mono uppercase bg-accent-light text-accent border border-accent-border px-1.5 py-0.5 rounded-sm font-bold">
                Gemini Match
              </span>
            </div>
          </div>

          {/* Streamlined 5-Column Table: Guaranteed No Horizontal Scrollbar */}
          <div className="border border-border-default rounded-sm w-full">
            <table className="w-full text-left text-[11px] border-collapse layout-fixed">
              <thead>
                <tr className="bg-bg-sunken border-b border-border-default font-heading text-[10px] tracking-wider text-text-secondary uppercase">
                  <th className="px-2.5 py-2 font-semibold w-[36%]">Vendor & Location</th>
                  <th className="px-2 py-2 font-semibold text-right w-[18%]">Unit Rate</th>
                  <th className="px-2 py-2 font-semibold text-center w-[20%]">Terms & Delivery</th>
                  <th className="px-2 py-2 font-semibold text-right w-[16%]">Total Value</th>
                  <th className="px-2.5 py-2 font-semibold text-center w-[10%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-body">
                {/* Row 1: Optimal Supplier (Gemini Match) */}
                <tr className="bg-accent-light border-l-4 border-l-accent hover:bg-accent-light/80">
                  <td className="px-2.5 py-2">
                    <div className="font-bold text-text-primary text-[11px] flex items-center gap-1 flex-wrap">
                      <span>Apex Steel & Alloy</span>
                      <span className="bg-accent text-white text-[8px] font-mono uppercase px-1 py-0.2 rounded-sm font-bold">
                        RECOMMENDED
                      </span>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono block">Pune, MH • Raw Material</span>
                  </td>
                  <td className="px-2 py-2 text-right font-mono font-bold text-text-primary whitespace-nowrap">
                    ₹72.50 / kg
                  </td>
                  <td className="px-2 py-2 text-center font-mono text-[10px] text-text-secondary whitespace-nowrap">
                    <span className="bg-bg-base border border-border-default px-1 py-0.5 rounded-sm">Net 30</span>
                    <span className="text-text-muted ml-1">4d</span>
                  </td>
                  <td className="px-2 py-2 text-right font-mono font-extrabold text-accent text-xs whitespace-nowrap">
                    ₹1,81,250
                  </td>
                  <td className="px-2.5 py-2 text-center">
                    <span className="inline-block bg-status-success text-white text-[9px] font-mono px-1.5 py-0.5 rounded-sm font-bold">
                      BEST
                    </span>
                  </td>
                </tr>

                {/* Row 2: Standard Supplier */}
                <tr className="bg-bg-base hover:bg-bg-surface">
                  <td className="px-2.5 py-2">
                    <div className="font-semibold text-text-primary text-[11px]">Bharat Forge & Fasteners</div>
                    <span className="text-[10px] text-text-muted font-mono block">Noida, UP • Components</span>
                  </td>
                  <td className="px-2 py-2 text-right font-mono font-bold text-text-primary whitespace-nowrap">
                    ₹76.00 / kg
                  </td>
                  <td className="px-2 py-2 text-center font-mono text-[10px] text-text-secondary whitespace-nowrap">
                    <span className="bg-bg-sunken border border-border-default px-1 py-0.5 rounded-sm">Adv 50%</span>
                    <span className="text-text-muted ml-1">2d</span>
                  </td>
                  <td className="px-2 py-2 text-right font-mono font-bold text-text-primary whitespace-nowrap">
                    ₹1,90,000
                  </td>
                  <td className="px-2.5 py-2 text-center">
                    <span className="inline-block border border-border-strong text-text-secondary text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
                      OK
                    </span>
                  </td>
                </tr>

                {/* Row 3: Standard Supplier */}
                <tr className="bg-bg-base hover:bg-bg-surface">
                  <td className="px-2.5 py-2">
                    <div className="font-semibold text-text-primary text-[11px]">Sun Metal Trading Co.</div>
                    <span className="text-[10px] text-text-muted font-mono block">Ludhiana, PB • Raw Material</span>
                  </td>
                  <td className="px-2 py-2 text-right font-mono font-bold text-text-primary whitespace-nowrap">
                    ₹74.00 / kg
                  </td>
                  <td className="px-2 py-2 text-center font-mono text-[10px] text-text-secondary whitespace-nowrap">
                    <span className="bg-bg-sunken border border-border-default px-1 py-0.5 rounded-sm">Net 45</span>
                    <span className="text-text-muted ml-1">7d</span>
                  </td>
                  <td className="px-2 py-2 text-right font-mono font-bold text-text-primary whitespace-nowrap">
                    ₹1,85,000
                  </td>
                  <td className="px-2.5 py-2 text-center">
                    <span className="inline-block border border-border-strong text-text-secondary text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
                      OK
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-bg-sunken p-2 border border-border-default rounded-sm flex flex-wrap items-center justify-between text-[11px] font-mono text-text-secondary gap-1">
            <div>
              <span className="font-bold text-text-primary">SAVINGS IDENTIFIED:</span> ₹8,750 (4.6% margin gain)
            </div>
            <div className="text-text-muted">
              Formula: <span className="text-text-primary">Unit Rate × Qty</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: AI Specification Parser */}
      {activeTab === 'parser' && (
        <div className="p-3 sm:p-4 space-y-3">
          <div className="pb-2 border-b border-border-subtle">
            <h4 className="font-heading font-bold text-xs sm:text-sm text-text-primary">
              AI Engineering Specification Extraction
            </h4>
            <p className="text-[11px] text-text-muted font-body">
              Convert raw buyer requests or PDF drawings into structured line items automatically
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Input Box */}
            <div className="bg-bg-sunken border border-border-default p-2.5 rounded-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-text-secondary uppercase">
                  RAW INPUT (PDF / TEXT)
                </span>
                <span className="text-[9px] font-mono text-status-warning bg-status-warning-bg px-1.5 py-0.2 rounded-sm border border-status-warning/30 font-bold">
                  UNSTRUCTURED
                </span>
              </div>
              <div className="p-2 bg-bg-base border border-border-default rounded-sm font-mono text-[11px] text-text-secondary leading-relaxed space-y-0.5">
                <p className="text-text-primary font-bold">"Requesting RFQ Pune plant:</p>
                <p>1) 2500 kg SS 304 Plates (10mm, IS 2062)</p>
                <p>2) 500 Pcs M16 Hex Bolts (8.8 Grade)"</p>
              </div>
            </div>

            {/* Output Parsed Structure */}
            <div className="bg-accent-light border border-accent-border p-2.5 rounded-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-accent uppercase">
                  PARSED BY GEMINI AI
                </span>
                <span className="text-[9px] font-mono text-status-success bg-status-success-bg px-1.5 py-0.2 rounded-sm border border-status-success/30 font-bold">
                  STRUCTURED
                </span>
              </div>
              
              <div className="space-y-1.5">
                <div className="p-2 bg-bg-base border border-border-default rounded-sm text-[11px] font-mono">
                  <div className="flex justify-between font-bold text-text-primary">
                    <span>ITEM #1: SS 304 Plates</span>
                    <span className="text-accent">2,500 KG</span>
                  </div>
                  <div className="text-[10px] text-text-muted">
                    Cat: Raw Material • Spec: IS 2062
                  </div>
                </div>

                <div className="p-2 bg-bg-base border border-border-default rounded-sm text-[11px] font-mono">
                  <div className="flex justify-between font-bold text-text-primary">
                    <span>ITEM #2: M16 Bolts</span>
                    <span className="text-accent">500 PCS</span>
                  </div>
                  <div className="text-[10px] text-text-muted">
                    Cat: Components • Grade 8.8
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Vendor Dispatch Tracker */}
      {activeTab === 'dispatch' && (
        <div className="p-3 sm:p-4 space-y-3">
          <div className="pb-2 border-b border-border-subtle flex flex-wrap items-center justify-between gap-1.5">
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-text-primary">
                Multi-Vendor Token Dispatch Tracker
              </h4>
              <p className="text-[11px] text-text-muted font-body">
                Vendors reply via passwordless token URLs. Zero login barriers.
              </p>
            </div>
            <span className="font-mono text-[10px] bg-bg-sunken border border-border-strong px-2 py-0.5 rounded-sm text-text-secondary">
              SECURITY: ISOLATED TOKENS
            </span>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2 bg-bg-base border border-border-default rounded-sm flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-text-primary flex items-center gap-1.5">
                  <span>Apex Steel Industries</span>
                  <span className="text-[9px] text-text-muted">tok_9918a</span>
                </div>
                <div className="text-[10px] text-text-muted">Dispatch Sent • Email Delivered</div>
              </div>
              <span className="text-[10px] font-bold text-status-success bg-status-success-bg px-1.5 py-0.5 rounded-sm border border-status-success/30">
                ✔ SUBMITTED
              </span>
            </div>

            <div className="p-2 bg-bg-base border border-border-default rounded-sm flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-text-primary flex items-center gap-1.5">
                  <span>Bharat Forge & Fasteners</span>
                  <span className="text-[9px] text-text-muted">tok_4412b</span>
                </div>
                <div className="text-[10px] text-text-muted">Dispatch Sent • Link Opened</div>
              </div>
              <span className="text-[10px] font-bold text-status-success bg-status-success-bg px-1.5 py-0.5 rounded-sm border border-status-success/30">
                ✔ SUBMITTED
              </span>
            </div>

            <div className="p-2 bg-bg-base border border-border-default rounded-sm flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-text-primary flex items-center gap-1.5">
                  <span>Mahavir Electrical & Cables</span>
                  <span className="text-[9px] text-text-muted">tok_7719d</span>
                </div>
                <div className="text-[10px] text-text-muted">Dispatch Sent • Delivered</div>
              </div>
              <span className="text-[10px] font-bold text-status-warning bg-status-warning-bg px-1.5 py-0.5 rounded-sm border border-status-warning/30">
                ⏳ PENDING
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
