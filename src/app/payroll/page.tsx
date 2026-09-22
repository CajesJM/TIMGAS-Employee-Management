import type { Metadata } from "next";
import { Calculator, CheckCircle2, Clock3, LockKeyhole, SlidersHorizontal } from "lucide-react";
import { EmptyAction, PageHeader, PrimaryAction, SectionHeading, StatusBadge } from "@/components/ui";
import { deductionTypes, formatMoney, payrollRows } from "@/data/mock-data";

export const metadata: Metadata = { title: "Payroll" };

export default function PayrollPage() {
  const gross = payrollRows.reduce((sum, row) => sum + row.gross, 0);
  const deductions = payrollRows.reduce((sum, row) => sum + row.deductions, 0);
  const adjustments = payrollRows.reduce((sum, row) => sum + row.adjustments, 0);
  const net = payrollRows.reduce((sum, row) => sum + row.net, 0);

  return (
    <>
      <PageHeader eyebrow="Compensation · Semi-monthly" title="Payroll workspace" description="Prepare, review, and finalize employee pay for the 15th and end-of-month payroll schedules." action={<PrimaryAction>New payroll period</PrimaryAction>} />

      <div className="notice" style={{ marginBottom: 18 }}><strong>Frontend preview:</strong> calculated values are illustrative until TIMGAS confirms the payroll formulas and a backend is connected.</div>

      <section className="metrics-grid" aria-label="Payroll period totals">
        <article className="metric-card"><div className="metric-top"><span>Gross salary</span><Calculator size={18} /></div><p className="metric-value" style={{ fontSize: 23 }}>{formatMoney(gross)}</p><span className="metric-note">Before deductions and adjustments</span></article>
        <article className="metric-card metric-card--red"><div className="metric-top"><span>Total deductions</span><SlidersHorizontal size={18} /></div><p className="metric-value" style={{ fontSize: 23 }}>{formatMoney(deductions)}</p><span className="metric-note">Across 13 deduction categories</span></article>
        <article className="metric-card metric-card--amber"><div className="metric-top"><span>Adjustments / OT</span><Clock3 size={18} /></div><p className="metric-value" style={{ fontSize: 23 }}>{formatMoney(adjustments)}</p><span className="metric-note">Additional period earnings</span></article>
        <article className="metric-card metric-card--green"><div className="metric-top"><span>Net payroll</span><CheckCircle2 size={18} /></div><p className="metric-value" style={{ fontSize: 23 }}>{formatMoney(net)}</p><span className="metric-note">5 employees in this preview</span></article>
      </section>

      <div className="content-grid">
        <section className="panel">
          <SectionHeading title="September 16–30 payroll" meta="Draft · last updated September 22 at 3:14 PM" />
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Station</th><th>Gross</th><th>Deductions</th><th>Adjustments</th><th>Net pay</th><th>Status</th></tr></thead>
              <tbody>
                {payrollRows.map((row) => (
                  <tr key={row.employee}>
                    <td><strong>{row.employee}</strong></td><td>{row.station}</td><td className="money">{formatMoney(row.gross)}</td><td className="money">{formatMoney(row.deductions)}</td><td className="money">{formatMoney(row.adjustments)}</td><td className="money"><strong>{formatMoney(row.net)}</strong></td><td><StatusBadge tone={row.status === "Ready" ? "success" : "warning"}>{row.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination"><span>5 employee payroll records</span><div style={{ display: "flex", gap: 8 }}><EmptyAction>Recalculate preview</EmptyAction><button className="button button--primary" type="button"><LockKeyhole size={16} /> Finalize payroll</button></div></div>
        </section>

        <aside className="panel">
          <SectionHeading title="Supported payroll items" meta="From the TIMGAS feature requirements" />
          <div className="panel-body" style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            <StatusBadge tone="info">OT</StatusBadge>
            {deductionTypes.map((type) => <StatusBadge key={type}>{type}</StatusBadge>)}
          </div>
          <div className="settings-list">
            <div className="settings-row"><div><strong>First payroll</strong><p>Every 15th day of the month</p></div><span className="mono">15TH</span></div>
            <div className="settings-row"><div><strong>Second payroll</strong><p>At the end of the month</p></div><span className="mono">EOM</span></div>
          </div>
        </aside>
      </div>
    </>
  );
}
