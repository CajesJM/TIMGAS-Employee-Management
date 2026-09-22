import type { Metadata } from "next";
import { PageHeader, SectionHeading } from "@/components/ui";
import { SettingsControls } from "./_components/settings-controls";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader eyebrow="System configuration" title="Settings" description="Prepare company, payroll, leave, and notification defaults before the backend is connected." />
      <div className="split-grid">
        <div className="stack">
          <section className="panel"><SectionHeading title="Company information" /><form className="panel-body form-grid"><div className="field field--full"><label htmlFor="company-name">Company name</label><input id="company-name" defaultValue="TIMGAS" /></div><div className="field field--full"><label htmlFor="company-address">Business address</label><input id="company-address" defaultValue="Trinidad, Bohol" /></div><div className="field"><label htmlFor="payroll-first">First payroll</label><select id="payroll-first" defaultValue="15"><option value="15">15th day</option></select></div><div className="field"><label htmlFor="payroll-second">Second payroll</label><select id="payroll-second" defaultValue="eom"><option value="eom">End of month</option></select></div><div className="field field--full"><button type="button" className="button button--primary">Save company settings</button></div></form></section>
          <section className="panel"><SectionHeading title="Notifications" /><SettingsControls /></section>
        </div>
        <aside className="stack">
          <section className="panel"><SectionHeading title="Annual leave allocation" /><div className="settings-list"><div className="settings-row"><div><strong>Sick leave</strong><p>Unused credits carry over</p></div><span className="mono">15 days</span></div><div className="settings-row"><div><strong>Vacation leave</strong><p>May convert to cash at year-end</p></div><span className="mono">10 days</span></div><div className="settings-row"><div><strong>Force leave</strong><p>Expires at the end of the year</p></div><span className="mono">5 days</span></div></div></section>
          <section className="panel"><SectionHeading title="Backend connection" /><div className="panel-body"><p className="notice">No database or backend is connected. These screens currently use typed local demonstration data so the interface can be reviewed independently.</p></div></section>
        </aside>
      </div>
    </>
  );
}
