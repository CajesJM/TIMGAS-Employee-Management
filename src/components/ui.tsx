import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Tone } from "@/types";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action && <div className="page-actions">{action}</div>}
    </header>
  );
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`status status--${tone}`}>{children}</span>;
}

export function PrimaryAction({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <Link className="button button--primary" href={href}>
      <Plus size={17} />
      {children}
    </Link>
  );
}

export function SectionHeading({ title, meta, href }: { title: string; meta?: string; href?: string }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {meta && <p>{meta}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          View all <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}

export function EmptyAction({ children }: { children: ReactNode }) {
  return <button className="button button--secondary" type="button">{children}</button>;
}
