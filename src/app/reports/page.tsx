import type { Metadata } from "next";
import { Banknote, CalendarDays, Download, FileClock, Landmark, ListChecks, ShieldAlert, Users } from "lucide-react";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Reports" };

const reports = [
  { title: "Employee master list", description: "Employment, position, status, and station records.", icon: Users },
  { title: "Payroll register", description: "Gross pay, adjustments, deductions, and net pay by period.", icon: Banknote },
  { title: "Deduction summary", description: "Totals grouped by deduction and adjustment type.", icon: ListChecks },
  { title: "Leave balances", description: "Available sick, vacation, and force leave per employee.", icon: CalendarDays },
  { title: "Contract expiry", description: "Contracts ordered by end date and current status.", icon: FileClock },
  { title: "Violation history", description: "Employee incidents, actions, and resolution status.", icon: ShieldAlert },
  { title: "Station workforce", description: "Employees and compensation grouped by TIMGAS station.", icon: Landmark },
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader eyebrow="Operational records" title="Reports" description="Prepare workforce and payroll information for review, printing, or export." />
      <section className="report-grid">
        {reports.map((report) => { const Icon = report.icon; return <button className="report-card" type="button" key={report.title} style={{ textAlign: "left" }}><span className="report-icon"><Icon size={18} /></span><h2>{report.title}</h2><p>{report.description}</p><span className="text-link"><Download size={14} /> Prepare report</span></button>; })}
      </section>
    </>
  );
}
