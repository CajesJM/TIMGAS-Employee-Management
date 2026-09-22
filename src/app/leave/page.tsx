import type { Metadata } from "next";
import { CalendarCheck2 } from "lucide-react";
import {
  PageHeader,
  PrimaryAction,
  SectionHeading,
  StatusBadge,
} from "@/components/ui";
import { leaveRows } from "@/data/mock-data";

export const metadata: Metadata = { title: "Leave credits" };

const leaveTypes = [
  {
    name: "Sick leave",
    allocation: 15,
    used: 2,
    available: 13,
    width: "87%",
    rule: "Unused credits carry over to the next year.",
  },
  {
    name: "Vacation leave",
    allocation: 10,
    used: 3,
    available: 7,
    width: "70%",
    rule: "Unused credits may be converted to cash at year-end.",
  },
  {
    name: "Force leave",
    allocation: 5,
    used: 2,
    available: 3,
    width: "60%",
    rule: "Unused credits expire and are not convertible.",
  },
];

export default function LeavePage() {
  return (
    <>
      <PageHeader
        eyebrow="Annual leave ledger · 2026"
        title="Leave credits"
        description="Track the 30-day annual allocation, employee usage, carryover, conversion, and expiry rules."
        action={<PrimaryAction>Record leave</PrimaryAction>}
      />
      <section className="leave-summary" aria-label="Leave allocation summary">
        {leaveTypes.map((item) => (
          <article className="leave-card" key={item.name}>
            <div className="leave-card-top">
              <div>
                <h2>{item.name}</h2>
                <span className="metric-note">
                  {item.allocation} days allocated annually
                </span>
              </div>
              <CalendarCheck2 size={19} color="var(--blue)" />
            </div>
            <p className="days">
              {item.available}
              <small
                style={{
                  font: "500 11px Manrope Variable",
                  color: "var(--ink-500)",
                }}
              >
                {" "}
                days available
              </small>
            </p>
            <div
              className="progress"
              aria-label={`${item.available} of ${item.allocation} days available`}
            >
              <span style={{ width: item.width }} />
            </div>
            <p className="leave-rule">{item.rule}</p>
          </article>
        ))}
      </section>
      <section className="panel">
        <SectionHeading
          title="Leave activity"
          meta="Pending requests and recent approved leave"
        />
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave type</th>
                <th>Date covered</th>
                <th>Days</th>
                <th>Balance after</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {leaveRows.map((row) => (
                <tr key={`${row.employee}-${row.dates}`}>
                  <td>
                    <strong>{row.employee}</strong>
                  </td>
                  <td>{row.type}</td>
                  <td className="mono">{row.dates}</td>
                  <td>{row.days}</td>
                  <td>{row.balance} days</td>
                  <td>
                    <StatusBadge
                      tone={row.status === "Approved" ? "success" : "warning"}
                    >
                      {row.status}
                    </StatusBadge>
                  </td>
                  <td>
                    {row.status === "Pending" ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="button button--secondary"
                          type="button"
                        >
                          Decline
                        </button>
                        <button
                          className="button button--primary"
                          type="button"
                        >
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "var(--ink-500)" }}>Recorded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
