import {
  AlertTriangle,
  Banknote,
  CalendarClock,
  Clock3,
  FileWarning,
  Users,
} from "lucide-react";
import { PageHeader, SectionHeading, StatusBadge } from "@/components/ui";
import { contracts, employees, formatMoney, payrollRows } from "@/data/mock-data";

export default function DashboardPage() {
  const totalNet = payrollRows.reduce((sum, row) => sum + row.net, 0);

  return (
    <>
      <PageHeader
        eyebrow="Tuesday · 22 September 2026"
        title="Operations at a glance"
        description="Review the current payroll cycle, employee records, contracts, leave credits, and items that need a manager decision."
      />

      <section className="metrics-grid" aria-label="Workforce summary">
        <article className="metric-card">
          <div className="metric-top"><span>Active employees</span><Users size={18} /></div>
          <p className="metric-value">{employees.filter((employee) => employee.status === "Active").length}</p>
          <span className="metric-note">Across 2 TIMGAS stations</span>
        </article>
        <article className="metric-card metric-card--amber">
          <div className="metric-top"><span>Payroll in review</span><Banknote size={18} /></div>
          <p className="metric-value mono">{formatMoney(totalNet)}</p>
          <span className="metric-note">5 employee records · Sep 16–30</span>
        </article>
        <article className="metric-card metric-card--red">
          <div className="metric-top"><span>Contracts due soon</span><FileWarning size={18} /></div>
          <p className="metric-value">2</p>
          <span className="metric-note">One contract expires in 8 days</span>
        </article>
        <article className="metric-card metric-card--green">
          <div className="metric-top"><span>Leave for approval</span><CalendarClock size={18} /></div>
          <p className="metric-value">2</p>
          <span className="metric-note">3 scheduled leave days</span>
        </article>
      </section>

      <div className="content-grid">
        <div className="stack">
          <section className="panel">
            <SectionHeading title="Current payroll review" meta="Second payroll · September 16–30, 2026" href="/payroll" />
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Employee</th><th>Station</th><th>Gross</th><th>Deductions</th><th>Net pay</th><th>Status</th></tr></thead>
                <tbody>
                  {payrollRows.slice(0, 4).map((row) => (
                    <tr key={row.employee}>
                      <td><div className="person-cell"><span className="avatar">{row.employee.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><strong>{row.employee}</strong></div></td>
                      <td>{row.station}</td>
                      <td className="money">{formatMoney(row.gross)}</td>
                      <td className="money">{formatMoney(row.deductions)}</td>
                      <td className="money"><strong>{formatMoney(row.net)}</strong></td>
                      <td><StatusBadge tone={row.status === "Ready" ? "success" : "warning"}>{row.status}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <SectionHeading title="Contract watch" meta="Employees ordered by nearest contract end date" href="/contracts" />
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Employee</th><th>Station</th><th>Contract end</th><th>Remaining</th><th>Status</th></tr></thead>
                <tbody>
                  {contracts.slice(0, 3).map((contract) => (
                    <tr key={contract.employee}>
                      <td><strong>{contract.employee}</strong></td>
                      <td>{contract.station}</td>
                      <td className="mono">{contract.end}</td>
                      <td>{contract.days} days</td>
                      <td><StatusBadge tone={contract.status === "Urgent" ? "danger" : contract.status === "Due soon" ? "warning" : "success"}>{contract.status}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="stack">
          <section className="panel">
            <SectionHeading title="Payroll cycle" meta="The work still open in this period" />
            <div className="cycle-rail">
              <div className="cycle-item"><span className="cycle-date">Sep 16</span><span className="cycle-node" /><span className="cycle-copy"><strong>Period opened</strong><span>Employee salary records copied</span></span></div>
              <div className="cycle-item"><span className="cycle-date">Sep 20</span><span className="cycle-node" /><span className="cycle-copy"><strong>Inputs recorded</strong><span>OT, absences, loans, and adjustments</span></span></div>
              <div className="cycle-item cycle-item--active"><span className="cycle-date">Today</span><span className="cycle-node" /><span className="cycle-copy"><strong>Manager review</strong><span>2 employee records need attention</span></span></div>
              <div className="cycle-item"><span className="cycle-date">Sep 30</span><span className="cycle-node" /><span className="cycle-copy"><strong>Finalize and issue</strong><span>Lock payroll and generate payslips</span></span></div>
            </div>
          </section>

          <section className="panel">
            <SectionHeading title="Needs attention" meta="Items awaiting manager action" />
            <div className="alert-list">
              <div className="alert-row"><span className="alert-icon"><AlertTriangle size={16} /></span><span className="alert-copy"><strong>Arnel Dela Cruz contract</strong><span>Expires September 30 · decide on renewal</span></span></div>
              <div className="alert-row"><span className="alert-icon"><Clock3 size={16} /></span><span className="alert-copy"><strong>2 payroll records in review</strong><span>Unconfirmed overtime and absence inputs</span></span></div>
              <div className="alert-row"><span className="alert-icon"><CalendarClock size={16} /></span><span className="alert-copy"><strong>2 leave requests pending</strong><span>Review before the next station schedule</span></span></div>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
