import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHeader, PrimaryAction, StatusBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Stations" };

const stations = [
  { name: "Poblacion Trinidad", code: "STN-PBT", employees: 3, contracts: 1, payroll: "₱41,270.00", manager: "Maria L. Santos" },
  { name: "Panab-an", code: "STN-PAN", employees: 3, contracts: 3, payroll: "₱36,855.00", manager: "Station manager unassigned" },
];

export default function StationsPage() {
  return (
    <>
      <PageHeader eyebrow="TIMGAS locations" title="Stations" description="See where employees work and compare current people, contract, and payroll activity by station." action={<PrimaryAction>Add station</PrimaryAction>} />
      <section className="station-grid">
        {stations.map((station) => <article className="station-card" key={station.code}><div className="station-card-top"><div><p className="station-code">{station.code}</p><h2>{station.name}</h2><p className="page-description"><MapPin size={13} style={{ verticalAlign: -2 }} /> Trinidad, Bohol</p></div><StatusBadge tone="success">Active</StatusBadge></div><div className="station-stats"><div><strong>{station.employees}</strong><span>Employees</span></div><div><strong>{station.contracts}</strong><span>Contracts tracked</span></div><div><strong style={{ fontSize: 13 }}>{station.payroll}</strong><span>Period net payroll</span></div></div><div className="settings-row" style={{ padding: "16px 0 0", marginTop: 16 }}><div><strong>Station lead</strong><p>{station.manager}</p></div><button className="button button--secondary" type="button">View employees</button></div></article>)}
      </section>
    </>
  );
}
