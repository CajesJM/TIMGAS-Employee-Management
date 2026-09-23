"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui";
import { formatMoney } from "@/lib/format";
import type { Employee, EmployeeCustomField } from "@/types";
import { ManageListsModal, type ReferenceItem } from "./manage-lists-modal";
import { ManageFieldsModal } from "./manage-fields-modal";
import { EditEmployeeModal } from "./edit-employee-modal";
import type { EmployeeFormOptions } from "./employee-form";

export function EmployeeDirectory({
  employees,
  stations,
  lists,
  customFields,
  options,
  initialStation = "All stations",
}: {
  employees: Employee[];
  stations: string[];
  lists: { positions: ReferenceItem[]; stations: ReferenceItem[] };
  customFields: EmployeeCustomField[];
  options: EmployeeFormOptions;
  initialStation?: string;
}) {
  const [query, setQuery] = useState("");
  const [station, setStation] = useState(
    stations.includes(initialStation) ? initialStation : "All stations",
  );
  const [status, setStatus] = useState("All statuses");

  const rows = useMemo(
    () =>
      employees.filter((employee) => {
        const text = `${employee.name} ${employee.position}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (station === "All stations" || employee.station === station) &&
          (status === "All statuses" || employee.status === status)
        );
      }),
    [employees, query, station, status],
  );

  return (
    <section className="panel">
      <div className="toolbar">
        <label className="search-box">
          <Search size={16} />
          <span className="sr-only">Search employees</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or position…"
          />
        </label>
        <select
          className="select-control"
          aria-label="Filter by station"
          value={station}
          onChange={(event) => setStation(event.target.value)}
        >
          <option>All stations</option>
          {stations.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          className="select-control"
          aria-label="Filter by status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option>All statuses</option>
          <option>Active</option>
          <option>Resigned</option>
          <option>Terminated</option>
          <option>End of contract</option>
        </select>
        <ManageListsModal
          positions={lists.positions}
          stations={lists.stations}
        />
        <ManageFieldsModal fields={customFields} />
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Employee</th>
              <th>Position</th>
              <th>Station</th>
              <th>Date hired</th>
              <th>Years in service</th>
              {customFields
                .filter((field) => field.active)
                .map((field) => (
                  <th key={field.id}>{field.name}</th>
                ))}
              <th>Contract end</th>
              <th>Status</th>
              <th>Monthly salary</th>
              <th>Violations</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((employee, index) => (
              <tr key={employee.id}>
                <td className="mono">{index + 1}</td>
                <td>
                  <Link
                    className="person-cell"
                    href={`/employees/${employee.id}`}
                  >
                    <span className="avatar">{employee.initials}</span>
                    <span>
                      <strong>{employee.name}</strong>
                    </span>
                  </Link>
                </td>
                <td>
                  <strong>{employee.position}</strong>
                </td>
                <td>{employee.station}</td>
                <td className="mono">{employee.dateHired}</td>
                <td className="mono">{employee.yearsInService}</td>
                {customFields
                  .filter((field) => field.active)
                  .map((field) => (
                    <td
                      key={field.id}
                      className={field.type === "NUMBER" ? "mono" : undefined}
                    >
                      {employee.customFields[field.id] || "—"}
                    </td>
                  ))}
                <td className="mono">{employee.contractEnd}</td>
                <td>
                  <StatusBadge
                    tone={employee.status === "Active" ? "success" : "neutral"}
                  >
                    {employee.status}
                  </StatusBadge>
                </td>
                <td className="money">{formatMoney(employee.monthlySalary)}</td>
                <td>
                  {employee.violations ? (
                    <StatusBadge tone="warning">
                      {employee.violations} recorded
                    </StatusBadge>
                  ) : (
                    <span style={{ color: "var(--ink-500)" }}>None</span>
                  )}
                </td>
                <td>
                  <EditEmployeeModal
                    employeeId={employee.id}
                    employeeName={employee.name}
                    employee={employee.edit}
                    options={options}
                    compact
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span>
          Showing {rows.length} of {employees.length} employees
        </span>
        <div className="pagination-actions">
          <button disabled aria-label="Previous page">
            ‹
          </button>
          <button aria-current="page">1</button>
          <button disabled aria-label="Next page">
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
