"use client";

import React, { useTransition } from "react";
import { SignOut } from "@/actions/auth";

interface MobileHeaderActionsProps {
  userEmail: string;
}

export default function MobileHeaderActions({ userEmail }: MobileHeaderActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await SignOut();
    });
  };

  return (
    <div className="flex md:hidden items-center gap-2">
      <span className="font-mono text-[10px] text-text-muted max-w-[100px] truncate" title={userEmail}>
        {userEmail.split("@")[0]}
      </span>
      <button
        onClick={handleSignOut}
        disabled={isPending}
        title="Sign Out"
        className="px-2 py-1 bg-bg-sunken border border-border-default hover:bg-status-error-bg hover:text-status-error hover:border-status-error rounded-sm text-[10px] font-heading font-semibold uppercase tracking-wider text-text-secondary transition-colors"
      >
        {isPending ? "..." : "Exit"}
      </button>
    </div>
  );
}
