"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { SignOut } from "@/actions/auth";

interface SidebarNavProps {
  userEmail: string;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="square">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    name: "RFQs",
    href: "/rfqs",
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="square">
        <path d="M9 12h6M9 16h6M9 8h6M5 3h14v18H5V3z" />
      </svg>
    ),
  },
  {
    name: "Vendors",
    href: "/vendors",
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="square">
        <path d="M3 21h18V8l-4 3V8l-4 3V8l-6 4v9z" />
        <path d="M14 15h2v6h-2z" />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/settings",
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="square">
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 10h6M9 8h6M17 12h6" />
      </svg>
    ),
  },
];

export default function SidebarNav({ userEmail }: SidebarNavProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await SignOut();
    });
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-bg-surface border-r border-border-strong flex-col h-screen sticky top-0 shrink-0">
        {/* Logo Header */}
        <div className="h-16 border-b border-border-default px-6 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="bg-accent text-white font-mono font-bold text-sm tracking-tight flex items-center justify-center h-8 w-8 border border-accent-hover rounded-sm">
              RP
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-text-primary block leading-none">
                RFQPilot
              </span>
              <span className="font-mono text-[9px] text-text-muted tracking-wider uppercase block mt-0.5">
                SYS.VER 1.0 // P2P
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard" 
              ? pathname === "/dashboard" 
              : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                id={`sidebar-link-${item.name.toLowerCase()}`}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-sm border-l-[3px] ${
                  isActive
                    ? "bg-accent-light text-text-primary border-accent font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-sunken border-transparent"
                }`}
              >
                {item.icon(
                  `w-4.5 h-4.5 ${isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"}`
                )}
                <span className="font-body">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info & Sign Out */}
        <div className="border-t border-border-default p-4 bg-bg-surface space-y-3">
          {/* Operator Profile Plate */}
          <div className="border border-border-default bg-bg-sunken p-3 rounded-sm text-xs">
            <div className="text-[10px] font-heading font-semibold text-text-muted tracking-wider uppercase mb-1">
              ACTIVE OPERATOR
            </div>
            <div className="font-mono text-text-primary truncate" title={userEmail}>
              {userEmail}
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            id="sidebar-button-signout"
            onClick={handleSignOut}
            disabled={isPending}
            className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-secondary hover:text-status-error hover:bg-status-error-bg hover:border-status-error border border-transparent rounded-sm transition-all cursor-pointer font-heading tracking-wide uppercase disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="square">
              <path d="M9 21H3V3h6M15 17l5-5-5-5M20 12H9" />
            </svg>
            {isPending ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-surface border-t-2 border-border-strong px-2 py-1.5 flex items-center justify-around shadow-2xl backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              id={`mobile-nav-link-${item.name.toLowerCase()}`}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-sm transition-all text-center min-w-[60px] ${
                isActive
                  ? "text-accent font-bold bg-accent-light/80 border-t-2 border-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.icon(`w-5 h-5 mb-0.5 ${isActive ? "text-accent" : "text-text-muted"}`)}
              <span className="text-[10px] font-heading font-semibold uppercase tracking-wider leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
