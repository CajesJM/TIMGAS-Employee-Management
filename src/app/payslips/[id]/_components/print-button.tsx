"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return <button className="button button--primary no-print" type="button" onClick={() => window.print()}><Printer size={16} /> Print payslip</button>;
}
