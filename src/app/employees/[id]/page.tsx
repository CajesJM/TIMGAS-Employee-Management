import type { Metadata } from "next";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading, StatusBadge } from "@/components/ui";
import { formatMoney } from "@/lib/format";
import { getEmployeeFormOptions, getEmployees } from "@/server/workforce";
import { archiveEmployee } from "../actions";
import { ArchiveEmployee } from "../_components/archive-employee";
import { EditEmployeeModal } from "../_components/edit-employee-modal";

export const metadata: Metadata = { title: "Employee profile" };

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [employees, options] = await Promise.all([
    getEmployees(),
    getEmployeeFormOptions(),
  ]);
  const employee = employees.find((item) => item.id === id);
  if (!employee) notFound();
  const archiveAction = archiveEmployee.bind(null, id);

  return (
    <>
      <Link
        className="text-link"
        href="/employees"
        style={{ marginBottom: 14 }}
      >
        <ArrowLeft size={15} /> Back to employees
      </Link>
      <div className="detail-actions">
        <EditEmployeeModal
          employeeId={id}
          employeeName={employee.name}
          employee={employee.edit}
          options={options}
        />
        <ArchiveEmployee action={archiveAction} employeeName={employee.name} />
      </div>
      <section className="detail-hero">
        <div className="detail-person">
          <span className="avatar">{employee.initials}</span>
          <div>
            <StatusBadge
              tone={employee.status === "Active" ? "success" : "neutral"}
            >
              {employee.status}
            </StatusBadge>
            <h1>{employee.name}</h1>
            <p>{employee.position}</p>
          </div>
        </div>
        <div className="detail-meta">
          <div>
            <span>Station</span>
            <strong>{employee.station}</strong>
          </div>
          <div>
            <span>Monthly salary</span>
            <strong className="mono">
              {formatMoney(employee.monthlySalary)}
            </strong>
          </div>
        </div>
      </section>

      <nav className="tabs" aria-label="Employee profile sections">
        <span className="tab tab--active">Overview</span>
        <span className="tab">Contracts</span>
        <span className="tab">Leave</span>
        <span className="tab">Violations</span>
        <span className="tab">Payroll history</span>
        <span className="tab">Loans & deductions</span>
      </nav>

      <div className="content-grid">
        <div className="stack">
          <section className="panel">
            <SectionHeading
              title="Employment details"
              meta="Current recorded information"
            />
            <div className="panel-body profile-grid">
              <div className="info-card">
                <p>Date hired</p>
                <strong>{employee.dateHired}</strong>
              </div>
              <div className="info-card">
                <p>Contract end</p>
                <strong>{employee.contractEnd}</strong>
              </div>
              <div className="info-card">
                <p>Employment status</p>
                <strong>{employee.status}</strong>
                <small>
                  {employee.separationDate
                    ? `Separated ${employee.separationDate}`
                    : "No separation recorded"}
                </small>
              </div>
              <div className="info-card">
                <p>Station assignment</p>
                <strong>{employee.station}</strong>
                <small>Current assignment</small>
              </div>
              <div className="info-card">
                <p>Violation record</p>
                <strong>{employee.violations} recorded</strong>
                <small>
                  {employee.violations
                    ? "Review record history"
                    : "No active record"}
                </small>
              </div>
            </div>
          </section>
          <section className="panel">
            <SectionHeading
              title="Current leave credits"
              meta="2026 allocation and available balances"
              href="/leave"
            />
            <div className="panel-body profile-grid">
              <div className="info-card">
                <p>Sick leave</p>
                <strong>{employee.leave.sick} days</strong>
                <small>Unused balance carries over</small>
              </div>
              <div className="info-card">
                <p>Vacation leave</p>
                <strong>{employee.leave.vacation} days</strong>
                <small>May convert to cash at year-end</small>
              </div>
              <div className="info-card">
                <p>Force leave</p>
                <strong>{employee.leave.force} days</strong>
                <small>Expires at year-end</small>
              </div>
            </div>
          </section>
        </div>
        <aside className="stack">
          <section className="panel">
            <SectionHeading title="Record shortcuts" />
            <div className="alert-list">
              <Link className="alert-row" href="/contracts">
                <span className="alert-icon">
                  <FileText size={16} />
                </span>
                <span className="alert-copy">
                  <strong>Contract information</strong>
                  <span>End date and contract monitoring</span>
                </span>
              </Link>
              <Link className="alert-row" href="/leave">
                <span className="alert-icon">
                  <CalendarDays size={16} />
                </span>
                <span className="alert-copy">
                  <strong>Leave ledger</strong>
                  <span>Allocations, usage, and balances</span>
                </span>
              </Link>
              <Link className="alert-row" href="/violations">
                <span className="alert-icon">
                  <ShieldAlert size={16} />
                </span>
                <span className="alert-copy">
                  <strong>Violation records</strong>
                  <span>Incidents and actions taken</span>
                </span>
              </Link>
              <Link className="alert-row" href="/payslips">
                <span className="alert-icon">
                  <WalletCards size={16} />
                </span>
                <span className="alert-copy">
                  <strong>Payroll history</strong>
                  <span>Payslips by payroll period</span>
                </span>
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
