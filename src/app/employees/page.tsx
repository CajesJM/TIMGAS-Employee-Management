import type { Metadata } from "next";
import { PageHeader, PrimaryAction } from "@/components/ui";
import { EmployeeDirectory } from "./_components/employee-directory";

export const metadata: Metadata = { title: "Employees" };

export default function EmployeesPage() {
  return (
    <>
      <PageHeader eyebrow="People records" title="Employees" description="Maintain employment details, status, station assignment, contracts, violations, and payroll information." action={<PrimaryAction>Add employee</PrimaryAction>} />
      <EmployeeDirectory />
    </>
  );
}
