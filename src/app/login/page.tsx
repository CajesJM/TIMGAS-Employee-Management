import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Manager sign in" };

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand" style={{ color: "var(--ink-950)" }}><span className="brand-mark">TG</span><span><strong>TIMGAS</strong><small style={{ color: "var(--ink-500)" }}>Workforce desk</small></span></div>
        <div className="login-heading"><p className="eyebrow">Manager access</p><h1>Sign in to continue</h1><p className="page-description">Employee, payroll, leave, contract, and violation records are restricted to authorized managers.</p></div>
        <form className="form-grid"><div className="field field--full"><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="manager@timgas.local" autoComplete="email" /></div><div className="field field--full"><label htmlFor="password">Password</label><input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" /></div><div className="field field--full"><Link className="button button--primary" href="/">Sign in</Link></div></form>
        <p className="login-note">Frontend demonstration only. Authentication will be implemented with the selected backend.</p>
      </section>
    </main>
  );
}
