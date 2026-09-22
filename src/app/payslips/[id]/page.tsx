import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney, payrollRows } from "@/data/mock-data";
import { PrintButton } from "./_components/print-button";

export const metadata: Metadata = { title: "Payslip preview" };

const deductionLines = [
  ["Pag-IBIG", 200],
  ["CBU", 500],
  ["Savings", 750],
  ["Late deductions", 180],
];

export default async function PayslipPage({ params }: { params: Promise<{ id: string }> }) {
  const index = Number((await params).id) - 1;
  const payroll = payrollRows[index];
  if (!payroll) notFound();
  const listedDeductions = deductionLines.slice(0, 3);
  const listedTotal = listedDeductions.reduce((sum, item) => sum + Number(item[1]), 0);
  const other = Math.max(0, payroll.deductions - listedTotal);

  return (
    <>
      <div className="payslip-toolbar no-print"><Link className="text-link" href="/payslips"><ArrowLeft size={15} /> Back to payslips</Link><PrintButton /></div>
      <article className="payslip-sheet">
        <header className="payslip-header"><div><p className="eyebrow">TIMGAS</p><h1>Payroll receipt</h1><p>Trinidad, Bohol</p></div><div className="payslip-id"><span>Payslip number</span><strong>PS-202609-{String(index + 1).padStart(3, "0")}</strong><span>Payroll period</span><strong>September 16–30, 2026</strong></div></header>
        <section className="payslip-employee"><div><span>Employee</span><strong>{payroll.employee}</strong></div><div><span>Station</span><strong>{payroll.station}</strong></div><div><span>Payment date</span><strong>September 30, 2026</strong></div></section>
        <div className="payslip-columns">
          <section><h2>Earnings and adjustments</h2><div className="payslip-line"><span>Period salary</span><strong>{formatMoney(payroll.gross - payroll.adjustments)}</strong></div>{payroll.adjustments > 0 && <div className="payslip-line"><span>OT / adjustments</span><strong>{formatMoney(payroll.adjustments)}</strong></div>}<div className="payslip-line payslip-line--total"><span>Gross pay</span><strong>{formatMoney(payroll.gross)}</strong></div></section>
          <section><h2>Deductions</h2>{listedDeductions.map(([name, amount]) => <div className="payslip-line" key={name}><span>{name}</span><strong>{formatMoney(Number(amount))}</strong></div>)}{other > 0 && <div className="payslip-line"><span>Other deductions</span><strong>{formatMoney(other)}</strong></div>}<div className="payslip-line payslip-line--total"><span>Total deductions</span><strong>{formatMoney(payroll.deductions)}</strong></div></section>
        </div>
        <section className="payslip-net"><span>Net pay</span><strong>{formatMoney(payroll.net)}</strong></section>
        <footer className="payslip-footer"><div><span>Employee signature</span></div><div><span>Authorized by</span></div></footer>
      </article>
    </>
  );
}
