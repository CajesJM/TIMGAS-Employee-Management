import "@fontsource-variable/manrope";
import "@fontsource-variable/roboto-mono";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TIMGAS Workforce", template: "%s | TIMGAS Workforce" },
  description: "Employee, payroll, leave, violation, and contract operations for TIMGAS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
