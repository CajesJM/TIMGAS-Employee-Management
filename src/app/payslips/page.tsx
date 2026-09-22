import type { Metadata } from "next";
import { Download, Printer, ReceiptText } from "lucide-react";
import Link from "next/link";
import { PageHeader, SectionHeading, StatusBadge } from "@/components/ui";
import { formatMoney, payrollRows } from "@/data/mock-data";

export const metadata: Metadata = { title: "Payslips" };

export default function PayslipsPage() {
  return (
    <>
      <PageHeader eyebrow="Payroll receipts" title="Payslips" description="Preview, print, or download an employee salary receipt for each finalized payroll period." action={<button className="button button--secondary" type="button"><Download size={16} /> Download period</button>} />
      <section className="panel">
        <SectionHeading title="September 16–30, 2026" meta="5 generated salary receipts · Draft preview" />
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Payslip</th><th>Employee</th><th>Payroll period</th><th>Gross pay</th><th>Total deductions</th><th>Net pay</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {payrollRows.map((row, index) => (
                <tr key={row.employee}>
                  <td className="mono">PS-202609-{String(index + 1).padStart(3, "0")}</td><td><strong>{row.employee}</strong><br /><small style={{ color: "var(--ink-500)" }}>{row.station}</small></td><td>Sep 16–30, 2026</td><td className="money">{formatMoney(row.gross)}</td><td className="money">{formatMoney(row.deductions)}</td><td className="money"><strong>{formatMoney(row.net)}</strong></td><td><StatusBadge tone="warning">Preview</StatusBadge></td><td><div style={{ display: "flex", gap: 6 }}><Link className="icon-button" href={`/payslips/${index + 1}`} aria-label={`Preview ${row.employee} payslip`}><ReceiptText size={16} /></Link><Link className="icon-button" href={`/payslips/${index + 1}`} aria-label={`Print ${row.employee} payslip`}><Printer size={16} /></Link></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
