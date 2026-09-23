import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { getEmployeeFormOptions } from "@/server/workforce";
import { createEmployee } from "../actions";
import { EmployeeForm } from "../_components/employee-form";

export const metadata: Metadata = { title: "Add employee" };

export default async function NewEmployeePage() {
  const options = await getEmployeeFormOptions();
  return (
    <>
      <Link className="text-link back-link" href="/employees">
        <ArrowLeft size={15} />
        Back to employees
      </Link>
      <PageHeader
        eyebrow="People records"
        title="Add employee"
        description="Create a new employee record using the current positions and stations in PostgreSQL."
      />
      <EmployeeForm action={createEmployee} options={options} />
    </>
  );
}
