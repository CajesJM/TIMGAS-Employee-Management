"use server";

import { revalidatePath } from "next/cache";
import { EmploymentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type ContractActionState = {
  message: string;
  tone?: "success" | "error";
  errors?: Record<string, string>;
};
const text = (data: FormData, key: string) =>
  String(data.get(key) ?? "").trim();
const refresh = () => {
  revalidatePath("/contracts");
  revalidatePath("/employees");
  revalidatePath("/");
};

function values(data: FormData) {
  const value = {
    employeeId: text(data, "employeeId"),
    endDate: text(data, "endDate"),
    employmentStatus: text(data, "employmentStatus"),
    notes: text(data, "notes"),
  };
  const errors: Record<string, string> = {};
  if (!value.employeeId) errors.employeeId = "Select an employee.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.endDate))
    errors.endDate = "Enter a valid end date.";
  if (
    !Object.values(EmploymentStatus).includes(
      value.employmentStatus as EmploymentStatus,
    )
  )
    errors.employmentStatus = "Select a valid employment status.";
  if (value.notes.length > 500)
    errors.notes = "Notes must be 500 characters or fewer.";
  return { value, errors };
}

async function employeeDateHired(employeeId: string) {
  return prisma.employee.findUnique({
    where: { id: employeeId },
    select: { dateHired: true, separationDate: true },
  });
}

const employeeStatusData = (
  status: EmploymentStatus,
  separationDate: Date | null,
) => ({
  status,
  active: status === EmploymentStatus.ACTIVE,
  separationDate:
    status === EmploymentStatus.ACTIVE ? null : (separationDate ?? new Date()),
});

export async function createContract(
  _state: ContractActionState,
  data: FormData,
): Promise<ContractActionState> {
  const { value, errors } = values(data);
  if (Object.keys(errors).length)
    return { message: "Review the highlighted fields.", tone: "error", errors };
  const employee = await employeeDateHired(value.employeeId);
  if (!employee) return { message: "Employee was not found.", tone: "error" };
  const endDate = new Date(`${value.endDate}T00:00:00.000Z`);
  if (endDate < employee.dateHired)
    return {
      message: "Contract end date must be after the employee's date hired.",
      tone: "error",
      errors: { endDate: "Choose a date after the date hired." },
    };
  await prisma.$transaction([
    prisma.employeeContract.create({
      data: {
        employeeId: value.employeeId,
        startDate: employee.dateHired,
        endDate,
        notes: value.notes || null,
      },
    }),
    prisma.employee.update({
      where: { id: value.employeeId },
      data: employeeStatusData(
        value.employmentStatus as EmploymentStatus,
        employee.separationDate,
      ),
    }),
  ]);
  refresh();
  return { message: "Contract added.", tone: "success" };
}

export async function updateContract(
  id: string,
  _state: ContractActionState,
  data: FormData,
): Promise<ContractActionState> {
  const { value, errors } = values(data);
  if (Object.keys(errors).length)
    return { message: "Review the highlighted fields.", tone: "error", errors };
  const employee = await employeeDateHired(value.employeeId);
  if (!employee) return { message: "Employee was not found.", tone: "error" };
  const endDate = new Date(`${value.endDate}T00:00:00.000Z`);
  if (endDate < employee.dateHired)
    return {
      message: "Contract end date must be after the employee's date hired.",
      tone: "error",
      errors: { endDate: "Choose a date after the date hired." },
    };
  await prisma.$transaction([
    prisma.employeeContract.update({
      where: { id },
      data: {
        employeeId: value.employeeId,
        startDate: employee.dateHired,
        endDate,
        notes: value.notes || null,
      },
    }),
    prisma.employee.update({
      where: { id: value.employeeId },
      data: employeeStatusData(
        value.employmentStatus as EmploymentStatus,
        employee.separationDate,
      ),
    }),
  ]);
  refresh();
  return { message: "Contract updated.", tone: "success" };
}

export async function renewContract(
  id: string,
  _state: ContractActionState,
  data: FormData,
): Promise<ContractActionState> {
  const { value, errors } = values(data);
  if (Object.keys(errors).length)
    return { message: "Review the highlighted fields.", tone: "error", errors };
  const employee = await employeeDateHired(value.employeeId);
  if (!employee) return { message: "Employee was not found.", tone: "error" };
  const endDate = new Date(`${value.endDate}T00:00:00.000Z`);
  if (endDate < employee.dateHired)
    return {
      message: "Contract end date must be after the employee's date hired.",
      tone: "error",
      errors: { endDate: "Choose a date after the date hired." },
    };
  await prisma.$transaction(async (tx) => {
    await tx.employeeContract.create({
      data: {
        employeeId: value.employeeId,
        startDate: employee.dateHired,
        endDate,
        notes: value.notes || null,
      },
    });
    await tx.employee.update({
      where: { id: value.employeeId },
      data: employeeStatusData(
        value.employmentStatus as EmploymentStatus,
        employee.separationDate,
      ),
    });
  });
  refresh();
  return {
    message: "Contract renewed and history preserved.",
    tone: "success",
  };
}

export async function closeContract(
  id: string,
  outcome: "expired" | "terminated",
  _state: ContractActionState,
): Promise<ContractActionState> {
  void _state;
  const contract = await prisma.employeeContract.findUnique({ where: { id } });
  if (!contract) return { message: "Contract was not found.", tone: "error" };
  await prisma.employee.update({
    where: { id: contract.employeeId },
    data: {
      status:
        outcome === "expired"
          ? EmploymentStatus.END_OF_CONTRACT
          : EmploymentStatus.TERMINATED,
      active: false,
      separationDate: new Date(),
    },
  });
  refresh();
  return {
    message:
      outcome === "expired"
        ? "Contract ended and employee status updated."
        : "Contract terminated and employee status updated.",
    tone: "success",
  };
}
