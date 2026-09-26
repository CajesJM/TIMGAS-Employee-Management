import type { Metadata } from "next";
import { PageHeader, SectionHeading, StatusBadge } from "@/components/ui";
import { getViolationFormEmployees, getViolations } from "@/server/workforce";
import {
  EditViolationModal,
  RecordViolationModal,
} from "./record-violation-modal";

export const metadata: Metadata = { title: "Violations" };

export default async function ViolationsPage() {
  const [violations, employees] = await Promise.all([
    getViolations(),
    getViolationFormEmployees(),
  ]);
  const openCount = violations.filter((item) => item.status === "Open").length;
  return (
    <>
      <PageHeader
        eyebrow="Employee records"
        title="Violation records"
        description="Record incidents, descriptions, and resolution status while preserving each employee’s history."
        action={<RecordViolationModal employees={employees} />}
      />
      <section className="panel">
        <SectionHeading
          title="Recorded violations"
          meta={`${violations.length} records · ${openCount} ${openCount === 1 ? "item remains" : "items remain"} open`}
        />
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Employee</th>
                <th>Category</th>
                <th>Incident date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((item, index) => (
                <tr key={item.id}>
                  <td className="mono">{index + 1}</td>
                  <td>
                    <strong>{item.employee}</strong>
                  </td>
                  <td>{item.category}</td>
                  <td className="mono">{item.date}</td>
                  <td>{item.description}</td>
                  <td>
                    <StatusBadge
                      tone={item.status === "Open" ? "warning" : "success"}
                    >
                      {item.status}
                    </StatusBadge>
                  </td>
                  <td>
                    <EditViolationModal
                      employees={employees}
                      violation={{ id: item.id, ...item.edit }}
                    />
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
