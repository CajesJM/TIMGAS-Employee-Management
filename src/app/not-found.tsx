import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel panel-body" style={{ maxWidth: 620 }}>
      <p className="eyebrow">Record not found</p>
      <h1>This page is not available</h1>
      <p className="page-description">The record may have moved or the address is incomplete. Return to the command center to continue.</p>
      <Link className="button button--primary" href="/" style={{ marginTop: 20 }}>Return to command center</Link>
    </div>
  );
}
