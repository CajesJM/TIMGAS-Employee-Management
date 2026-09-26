"use server";

import { revalidatePath } from "next/cache";
import { ViolationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type ViolationActionState = {
  message: string;
  tone?: "success" | "error";
  errors?: Record<string, string>;
};

const text = (data: FormData, key: string) =>
  String(data.get(key) ?? "").trim();

export async function createViolation(
  _state: ViolationActionState,
  data: FormData,
): Promise<ViolationActionState> {
  const values = {
    employeeId: text(data, "employeeId"),
    category: text(data, "category"),
    incidentDate: text(data, "incidentDate"),
    description: text(data, "description"),
    status: text(data, "status"),
    resolutionDate: text(data, "resolutionDate"),
  };
  const errors: Record<string, string> = {};
  if (!values.employeeId) errors.employeeId = "Select an employee.";
  if (!values.category) errors.category = "Category is required.";
  if (values.category.length > 100)
    errors.category = "Category must be 100 characters or fewer.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.incidentDate))
    errors.incidentDate = "Enter a valid incident date.";
  if (!values.description) errors.description = "Description is required.";
  if (values.description.length > 250)
    errors.description = "Description must be 250 characters or fewer.";
  if (
    !Object.values(ViolationStatus).includes(values.status as ViolationStatus)
  )
    errors.status = "Select a valid status.";
  if (
    values.status === ViolationStatus.RESOLVED &&
    !/^\d{4}-\d{2}-\d{2}$/.test(values.resolutionDate)
  )
    errors.resolutionDate = "Resolution date is required when resolved.";
  if (values.resolutionDate && values.resolutionDate < values.incidentDate)
    errors.resolutionDate =
      "Resolution date cannot be before the incident date.";
  if (Object.keys(errors).length)
    return { message: "Review the highlighted fields.", tone: "error", errors };

  const employee = await prisma.employee.findUnique({
    where: { id: values.employeeId },
    select: { dateHired: true },
  });
  if (!employee)
    return {
      message: "Employee was not found.",
      tone: "error",
      errors: { employeeId: "Select a valid employee." },
    };
  const incidentDate = new Date(`${values.incidentDate}T00:00:00.000Z`);
  if (incidentDate < employee.dateHired)
    return {
      message: "Incident date cannot be before the employee's date hired.",
      tone: "error",
      errors: { incidentDate: "Choose a date on or after the date hired." },
    };

  const recordNumbers = await prisma.employeeViolation.findMany({
    select: { recordNo: true },
  });
  const nextNumber =
    recordNumbers.reduce((highest, item) => {
      const match = /^V-(\d+)$/.exec(item.recordNo);
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0) + 1;

  await prisma.employeeViolation.create({
    data: {
      recordNo: `V-${String(nextNumber).padStart(3, "0")}`,
      employeeId: values.employeeId,
      category: values.category,
      incidentDate,
      description: values.description,
      status: values.status as ViolationStatus,
      resolutionDate:
        values.status === ViolationStatus.RESOLVED
          ? new Date(`${values.resolutionDate}T00:00:00.000Z`)
          : null,
    },
  });

  revalidatePath("/violations");
  revalidatePath("/employees");
  revalidatePath(`/employees/${values.employeeId}`);
  revalidatePath("/");
  return { message: "Violation recorded.", tone: "success" };
}

export async function updateViolation(
  id: string,
  _state: ViolationActionState,
  data: FormData,
): Promise<ViolationActionState> {
  const values = {
    employeeId: text(data, "employeeId"),
    category: text(data, "category"),
    incidentDate: text(data, "incidentDate"),
    description: text(data, "description"),
    status: text(data, "status"),
    resolutionDate: text(data, "resolutionDate"),
  };
  const errors: Record<string, string> = {};
  if (!values.employeeId) errors.employeeId = "Select an employee.";
  if (!values.category) errors.category = "Category is required.";
  if (values.category.length > 100)
    errors.category = "Category must be 100 characters or fewer.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.incidentDate))
    errors.incidentDate = "Enter a valid incident date.";
  if (!values.description) errors.description = "Description is required.";
  if (values.description.length > 250)
    errors.description = "Description must be 250 characters or fewer.";
  if (
    !Object.values(ViolationStatus).includes(values.status as ViolationStatus)
  )
    errors.status = "Select a valid status.";
  if (
    values.status === ViolationStatus.RESOLVED &&
    !/^\d{4}-\d{2}-\d{2}$/.test(values.resolutionDate)
  )
    errors.resolutionDate = "Resolution date is required when resolved.";
  if (values.resolutionDate && values.resolutionDate < values.incidentDate)
    errors.resolutionDate =
      "Resolution date cannot be before the incident date.";
  if (Object.keys(errors).length)
    return { message: "Review the highlighted fields.", tone: "error", errors };

  const [violation, employee] = await Promise.all([
    prisma.employeeViolation.findUnique({
      where: { id },
      select: { id: true },
    }),
    prisma.employee.findUnique({
      where: { id: values.employeeId },
      select: { dateHired: true },
    }),
  ]);
  if (!violation)
    return { message: "Violation record was not found.", tone: "error" };
  if (!employee)
    return {
      message: "Employee was not found.",
      tone: "error",
      errors: { employeeId: "Select a valid employee." },
    };
  const incidentDate = new Date(`${values.incidentDate}T00:00:00.000Z`);
  if (incidentDate < employee.dateHired)
    return {
      message: "Incident date cannot be before the employee's date hired.",
      tone: "error",
      errors: { incidentDate: "Choose a date on or after the date hired." },
    };

  await prisma.employeeViolation.update({
    where: { id },
    data: {
      employeeId: values.employeeId,
      category: values.category,
      incidentDate,
      description: values.description,
      status: values.status as ViolationStatus,
      resolutionDate:
        values.status === ViolationStatus.RESOLVED
          ? new Date(`${values.resolutionDate}T00:00:00.000Z`)
          : null,
    },
  });

  revalidatePath("/violations");
  revalidatePath("/employees");
  revalidatePath(`/employees/${values.employeeId}`);
  revalidatePath("/");
  return { message: "Violation updated.", tone: "success" };
}
