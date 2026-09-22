"use client";

import {
  Banknote,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  Gauge,
  Menu,
  ReceiptText,
  Settings,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/", label: "Command center", icon: Gauge }],
  },
  {
    label: "People",
    items: [
      { href: "/employees", label: "Employees", icon: Users },
      { href: "/contracts", label: "Contracts", icon: FileText },
      { href: "/violations", label: "Violations", icon: ShieldAlert },
      { href: "/stations", label: "Stations", icon: Building2 },
    ],
  },
  {
    label: "Compensation",
    items: [
      { href: "/payroll", label: "Payroll", icon: Banknote },
      { href: "/payslips", label: "Payslips", icon: ReceiptText },
      { href: "/leave", label: "Leave credits", icon: CalendarDays },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/reports", label: "Reports", icon: ClipboardList },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="mobile-header">
        <Link className="brand brand--compact" href="/" aria-label="TIMGAS Workforce home">
          <span className="brand-mark">TG</span>
          <span>TIMGAS</span>
        </Link>
        <button className="icon-button" onClick={() => setOpen(true)} aria-label="Open navigation">
          <Menu size={21} />
        </button>
      </header>

      {open && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="sidebar-top">
          <Link className="brand" href="/" onClick={() => setOpen(false)}>
            <span className="brand-mark">TG</span>
            <span>
              <strong>TIMGAS</strong>
              <small>Workforce desk</small>
            </span>
          </Link>
          <button className="icon-button sidebar-close" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X size={20} />
          </button>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const current = isCurrent(pathname, item.href);
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={current ? "nav-link nav-link--active" : "nav-link"}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <span className="avatar avatar--small">JM</span>
          <span className="sidebar-user-copy">
            <strong>John Manager</strong>
            <small>System manager</small>
          </span>
          <ChevronDown size={16} />
        </div>
      </aside>

      <main id="main-content" className="main-content">{children}</main>
    </div>
  );
}
