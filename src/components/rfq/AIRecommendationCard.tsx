"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AIRecommendationData } from "@/types";

interface AIRecommendationCardProps {
  rfqId: string;
  submittedQuotesCount: number;
  initialRecommendation?: AIRecommendationData | null;
}

export default function AIRecommendationCard({
  rfqId,
  submittedQuotesCount,
  initialRecommendation = null,
}: AIRecommendationCardProps) {
  const [recommendation, setRecommendation] = useState<AIRecommendationData | null>(
    initialRecommendation
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfqId, force: forceRefresh }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      } else {
        setError(data.error || "Failed to generate AI recommendation.");
      }
    } catch (err: any) {
      console.error("[AIRecommendationCard] Fetch error:", err);
      setError("An unexpected network error occurred while generating recommendation.");
    } finally {
      setLoading(false);
    }
  }, [rfqId]);

  // Trigger recommendation if quotes exist but no recommendation cached yet
  useEffect(() => {
    if (submittedQuotesCount > 0 && !recommendation && !loading && !error) {
      fetchRecommendation();
    }
  }, [submittedQuotesCount, recommendation, loading, error, fetchRecommendation]);

  // STATE 3: No quotes submitted yet
  if (submittedQuotesCount === 0) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-sm p-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-accent-light/50 border border-accent-border flex items-center justify-center shrink-0 text-accent">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
              />
            </svg>
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider block">
              AI DECISION ENGINE
            </span>
            <p className="text-xs text-text-muted font-body">
              AI recommendation will trigger automatically once vendor responses arrive.
            </p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-mono font-semibold bg-bg-sunken text-text-muted border border-border-subtle">
            Awaiting Quotes
          </span>
        </div>
      </div>
    );
  }

  // STATE 2: Loading Skeleton while fetching from /api/recommend
  if (loading && !recommendation) {
    return (
      <div className="bg-bg-surface border border-accent-border/60 rounded-sm p-5 space-y-4 shadow-xs relative overflow-hidden animate-pulse">
        {/* Top Shimmer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-accent/30 rounded-xs" />
            <div className="h-4 w-44 bg-bg-sunken rounded-xs" />
          </div>
          <div className="h-6 w-28 bg-bg-sunken rounded-sm" />
        </div>

        {/* Shimmer Title & Content */}
        <div className="space-y-3">
          <div className="h-6 w-64 bg-bg-sunken rounded-xs" />
          <div className="space-y-2 p-3.5 bg-bg-sunken/40 rounded-sm border border-border-subtle">
            <div className="h-3 w-full bg-bg-sunken rounded-xs" />
            <div className="h-3 w-4/5 bg-bg-sunken rounded-xs" />
            <div className="h-3 w-2/3 bg-bg-sunken rounded-xs" />
          </div>
        </div>

        {/* Shimmer Trade-offs */}
        <div className="space-y-2 pt-1">
          <div className="h-3 w-32 bg-bg-sunken rounded-xs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="h-7 bg-bg-sunken rounded-sm" />
            <div className="h-7 bg-bg-sunken rounded-sm" />
          </div>
        </div>

        {/* Loading status bar */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-accent font-semibold pt-1">
          <svg className="w-3.5 h-3.5 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Analyzing supplier pricing, lead times & payment terms with Gemini AI...</span>
        </div>
      </div>
    );
  }

  // Error State fallback button
  if (error && !recommendation) {
    return (
      <div className="bg-status-error-bg/60 border border-status-error/30 rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-mono text-[10px] font-bold text-status-error uppercase tracking-wider block">
            AI ANALYSIS ERROR
          </span>
          <p className="text-text-primary font-body">{error}</p>
        </div>
        <button
          onClick={() => fetchRecommendation(true)}
          className="px-3 py-1.5 bg-bg-surface hover:bg-bg-sunken border border-border-strong text-text-primary font-mono text-xs font-bold rounded-sm transition-colors shrink-0 cursor-pointer"
        >
          Retry AI Analysis
        </button>
      </div>
    );
  }

  // STATE 1: Cached / Available Recommendation
  if (!recommendation) return null;

  return (
    <div className="bg-bg-surface border border-accent-border/80 rounded-sm p-5 md:p-6 space-y-5 shadow-xs relative overflow-hidden">
      {/* Background Subtle Accent Gradient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1 bg-accent-light text-accent border border-accent-border rounded-sm text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <svg
              className="w-3.5 h-3.5 text-accent animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
              />
            </svg>
            <span>AI BUYING RECOMMENDATION</span>
          </div>

          <span className="text-xs text-text-muted font-body hidden md:inline">
            Analyzed {submittedQuotesCount} submitted supplier quote(s)
          </span>
        </div>

        {/* Confidence Score Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-status-success-bg border border-status-success/30 rounded-sm shrink-0">
          <span className="text-[10px] font-mono font-bold text-status-success uppercase tracking-wider">
            Confidence Score:
          </span>
          <span className="font-mono text-xs font-bold text-status-success">
            {recommendation.confidence_score}%
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-muted uppercase font-bold tracking-wider">
            RECOMMENDED SUPPLIER:
          </span>
          <h3 className="font-heading text-lg font-bold text-text-primary">
            {recommendation.recommended_vendor_name}
          </h3>
        </div>

        {/* 2-3 Sentence Reasoning Paragraph */}
        <div className="p-4 bg-bg-sunken/60 border border-border-subtle rounded-sm">
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-body">
            {recommendation.reasoning}
          </p>
        </div>
      </div>

      {/* Key Evaluation Trade-Offs */}
      {recommendation.key_trade_offs && recommendation.key_trade_offs.length > 0 && (
        <div className="space-y-2.5 pt-1 relative z-10">
          <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider block">
            KEY EVALUATION TRADE-OFFS & METRICS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {recommendation.key_trade_offs.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 bg-bg-base border border-border-default rounded-sm text-xs font-body text-text-primary"
              >
                <span className="text-accent font-bold font-mono text-xs shrink-0 mt-0.5">✓</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
