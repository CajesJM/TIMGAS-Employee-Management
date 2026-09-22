"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { employees } from "@/data/mock-data";
import { StatusBadge } from "@/components/ui";

export function EmployeeDirectory() {
  const [query, setQuery] = useState("");
  const [station, setStation] = useState("All stations");
  const [status, setStatus] = useState("All statuses");

  const rows = useMemo(
    () =>
      employees.filter((employee) => {
        const text =
          `${employee.name} ${employee.employeeNo} ${employee.position} ${employee.department}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (station === "All stations" || employee.station === station) &&
          (status === "All statuses" || employee.status === status)
        );
      }),
    [query, station, status],
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
            placeholder="Search name, ID, position…"
          />
        </label>
        <select
          className="select-control"
          aria-label="Filter by station"
          value={station}
          onChange={(event) => setStation(event.target.value)}
        >
          <option>All stations</option>
          <option>Panab-an</option>
          <option>Poblacion Trinidad</option>
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
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Position</th>
              <th>Station</th>
              <th>Date hired</th>
              <th>Contract end</th>
              <th>Status</th>
              <th>Violations</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <Link
                    className="person-cell"
                    href={`/employees/${employee.id}`}
                  >
                    <span className="avatar">{employee.initials}</span>
                    <span>
                      <strong>{employee.name}</strong>
                      <small>{employee.employeeNo}</small>
                    </span>
                  </Link>
                </td>
                <td>
                  <strong>{employee.position}</strong>
                  <br />
                  <span style={{ color: "var(--ink-500)", fontSize: 10 }}>
                    {employee.department}
                  </span>
                </td>
                <td>{employee.station}</td>
                <td className="mono">{employee.dateHired}</td>
                <td className="mono">{employee.contractEnd}</td>
                <td>
                  <StatusBadge
                    tone={employee.status === "Active" ? "success" : "neutral"}
                  >
                    {employee.status}
                  </StatusBadge>
                </td>
                <td>
                  {employee.violations ? (
                    <StatusBadge tone="warning">
                      {employee.violations} recorded
                    </StatusBadge>
                  ) : (
                    <span style={{ color: "var(--ink-500)" }}>None</span>
                  )}
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
