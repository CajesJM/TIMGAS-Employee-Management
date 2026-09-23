import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { EmployeeDirectory } from "./_components/employee-directory";
import { AddEmployeeModal } from "./_components/add-employee-modal";
import {
  getEmployeeCustomFields,
  getEmployeeFormOptions,
  getEmployeeReferenceLists,
  getEmployees,
} from "@/server/workforce";

export const metadata: Metadata = { title: "Employees" };

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ station?: string | string[] }>;
}) {
  const requestedStation = (await searchParams).station;
  const [employees, options, lists, customFields] = await Promise.all([
    getEmployees(),
    getEmployeeFormOptions(),
    getEmployeeReferenceLists(),
    getEmployeeCustomFields(),
  ]);
  return (
    <>
      <PageHeader
        eyebrow="People records"
        title="Employees"
        description="Maintain employment details, status, station assignment, contracts, violations, and payroll information."
        action={<AddEmployeeModal options={options} />}
      />
      <EmployeeDirectory
        employees={employees}
        stations={options.stations.map((station) => station.name)}
        lists={lists}
        customFields={customFields}
        options={options}
        initialStation={
          typeof requestedStation === "string" ? requestedStation : undefined
        }
      />
    </>
  );
}
