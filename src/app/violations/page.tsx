import type { Metadata } from "next";
import {
  PageHeader,
  PrimaryAction,
  SectionHeading,
  StatusBadge,
} from "@/components/ui";
import { violations } from "@/data/mock-data";

export const metadata: Metadata = { title: "Violations" };

export default function ViolationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Employee records"
        title="Violation records"
        description="Record incidents, actions taken, and resolution status while preserving each employee’s history."
        action={<PrimaryAction>Record violation</PrimaryAction>}
      />
      <section className="panel">
        <SectionHeading
          title="Recorded violations"
          meta="3 records · 1 item remains open"
        />
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Employee</th>
                <th>Category</th>
                <th>Incident date</th>
                <th>Action taken</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((item) => (
                <tr key={item.id}>
                  <td className="mono">{item.id}</td>
                  <td>
                    <strong>{item.employee}</strong>
                  </td>
                  <td>{item.category}</td>
                  <td className="mono">{item.date}</td>
                  <td>{item.action}</td>
                  <td>
                    <StatusBadge
                      tone={item.status === "Open" ? "warning" : "success"}
                    >
                      {item.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="split-grid" style={{ marginTop: 18 }}>
        <section className="panel">
          <SectionHeading
            title="Record a violation"
            meta="Frontend form preview"
          />
          <form className="panel-body form-grid">
            <div className="field field--full">
              <label htmlFor="employee">Employee</label>
              <select id="employee">
                <option>Select an employee</option>
                <option>Arnel Dela Cruz</option>
                <option>Joel Ramirez</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <input id="category" placeholder="e.g. Safety procedure" />
            </div>
            <div className="field">
              <label htmlFor="incident-date">Incident date</label>
              <input id="incident-date" type="date" />
            </div>
            <div className="field field--full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Describe what occurred and the relevant facts."
              />
            </div>
            <div className="field field--full">
              <label htmlFor="action">Action taken</label>
              <input id="action" placeholder="e.g. Written reminder" />
            </div>
            <div className="field field--full">
              <button className="button button--primary" type="button">
                Save violation record
              </button>
            </div>
          </form>
        </section>
        <aside className="panel">
          <SectionHeading title="Recording guidance" />
          <div className="panel-body">
            <p className="notice">
              Use factual descriptions and record the action taken. Backend
              audit history and document attachments will be connected in the
              next implementation stage.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
