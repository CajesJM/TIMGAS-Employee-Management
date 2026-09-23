import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { getEmployeeForEdit, getEmployeeFormOptions } from "@/server/workforce";
import { updateEmployee } from "../../actions";
import { EmployeeForm } from "../../_components/employee-form";

export const metadata: Metadata = { title: "Edit employee" };

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [employee, options] = await Promise.all([
    getEmployeeForEdit(id),
    getEmployeeFormOptions(),
  ]);
  if (!employee) notFound();
  const action = updateEmployee.bind(null, id);
  return (
    <>
      <Link className="text-link back-link" href={`/employees/${id}`}>
        <ArrowLeft size={15} />
        Back to employee
      </Link>
      <PageHeader
        eyebrow="People records"
        title="Edit employee"
        description="Update the employee’s personal and employment information."
      />
      <EmployeeForm
        action={action}
        options={options}
        employee={employee}
        cancelHref={`/employees/${id}`}
      />
    </>
  );
}
