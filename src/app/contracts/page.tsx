import type { Metadata } from "next";
import { PageHeader, PrimaryAction, SectionHeading, StatusBadge } from "@/components/ui";
import { contracts } from "@/data/mock-data";

export const metadata: Metadata = { title: "Contracts" };

export default function ContractsPage() {
  return (
    <>
      <PageHeader eyebrow="Employment monitoring" title="Contracts" description="Monitor employee contract end dates and identify records that need renewal or separation action." action={<PrimaryAction>Add contract</PrimaryAction>} />
      <section className="metrics-grid">
        <article className="metric-card metric-card--red"><div className="metric-top"><span>Expires in 14 days</span></div><p className="metric-value">1</p><span className="metric-note">Immediate manager decision</span></article>
        <article className="metric-card metric-card--amber"><div className="metric-top"><span>Expires in 30 days</span></div><p className="metric-value">2</p><span className="metric-note">Includes urgent contract</span></article>
        <article className="metric-card"><div className="metric-top"><span>Expires in 90 days</span></div><p className="metric-value">4</p><span className="metric-note">Review during this quarter</span></article>
        <article className="metric-card metric-card--green"><div className="metric-top"><span>Renewed this year</span></div><p className="metric-value">6</p><span className="metric-note">Contract history retained</span></article>
      </section>
      <section className="panel"><SectionHeading title="Contract watchlist" meta="Ordered by nearest end date" /><div className="table-wrap"><table className="data-table"><thead><tr><th>Employee</th><th>Station</th><th>Contract type</th><th>End date</th><th>Days remaining</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {contracts.map((item) => <tr key={item.employee}><td><strong>{item.employee}</strong></td><td>{item.station}</td><td>{item.type}</td><td className="mono">{item.end}</td><td>{item.days} days</td><td><StatusBadge tone={item.status === "Urgent" ? "danger" : item.status === "Due soon" ? "warning" : "success"}>{item.status}</StatusBadge></td><td><button className="button button--secondary" type="button">Review contract</button></td></tr>)}
      </tbody></table></div></section>
    </>
  );
}
