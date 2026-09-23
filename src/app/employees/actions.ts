"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EmploymentStatus } from "@/generated/prisma/client";

export type EmployeeFormState = {
  message: string;
  errors?: Record<string, string>;
};

const initialState: EmployeeFormState = { message: "" };

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

function validate(formData: FormData, allowManualLists = false) {
  const values = {
    firstName: text(formData, "firstName"),
    middleName: text(formData, "middleName").toUpperCase() || null,
    lastName: text(formData, "lastName"),
    positionId: text(formData, "positionId"),
    positionName: text(formData, "positionName"),
    stationId: text(formData, "stationId"),
    stationName: text(formData, "stationName"),
    dateHired: text(formData, "dateHired"),
    monthlySalary: text(formData, "monthlySalary"),
    status: text(formData, "status"),
    contractEnd: text(formData, "contractEnd"),
  };
  const errors: Record<string, string> = {};
  if (!values.firstName) errors.firstName = "First name is required.";
  if (values.middleName && !/^[A-Z]$/.test(values.middleName))
    errors.middleName = "Enter one letter only.";
  if (!values.lastName) errors.lastName = "Last name is required.";
  if (!values.positionId && (!allowManualLists || !values.positionName))
    errors.positionId = "Select or enter a position.";
  if (!values.stationId && (!allowManualLists || !values.stationName))
    errors.stationId = "Select or enter a station.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.dateHired))
    errors.dateHired = "Enter a valid hire date.";
  if (
    !Number.isFinite(Number(values.monthlySalary)) ||
    Number(values.monthlySalary) <= 0
  )
    errors.monthlySalary = "Enter a salary greater than zero.";
  if (
    !Object.values(EmploymentStatus).includes(values.status as EmploymentStatus)
  )
    errors.status = "Select a valid employment status.";
  if (values.contractEnd && !/^\d{4}-\d{2}-\d{2}$/.test(values.contractEnd))
    errors.contractEnd = "Enter a valid contract end date.";
  if (
    values.contractEnd &&
    /^\d{4}-\d{2}-\d{2}$/.test(values.dateHired) &&
    values.contractEnd < values.dateHired
  )
    errors.contractEnd = "Contract end must be after the hire date.";
  return { values, errors };
}

const automaticSeparationDate = (
  status: EmploymentStatus,
  existing?: Date | null,
) => (status === EmploymentStatus.ACTIVE ? null : (existing ?? new Date()));

async function customFieldValues(formData: FormData) {
  const fields = await prisma.employeeCustomField.findMany({
    where: { active: true },
  });
  const errors: Record<string, string> = {};
  const values = fields.map((field) => {
    const fieldName = `custom_${field.id}`;
    const value = text(formData, fieldName);
    if (field.required && !value)
      errors[fieldName] = `${field.name} is required.`;
    if (value && field.type === "NUMBER" && !Number.isFinite(Number(value)))
      errors[fieldName] = `${field.name} must be a number.`;
    if (value && field.type === "DATE" && !/^\d{4}-\d{2}-\d{2}$/.test(value))
      errors[fieldName] = `${field.name} must be a valid date.`;
    return { fieldId: field.id, value };
  });
  return { values, errors };
}

export async function createEmployee(
  _state: EmployeeFormState = initialState,
  formData: FormData,
): Promise<EmployeeFormState> {
  void _state;
  const { values, errors } = validate(formData, true);
  const custom = await customFieldValues(formData);
  Object.assign(errors, custom.errors);
  if (Object.keys(errors).length)
    return { message: "Review the highlighted fields.", errors };
  const employee = await prisma.$transaction(async (transaction) => {
    let positionId = values.positionId;
    if (!positionId) {
      const existing = await transaction.position.findFirst({
        where: { name: { equals: values.positionName, mode: "insensitive" } },
      });
      positionId = existing
        ? (
            await transaction.position.update({
              where: { id: existing.id },
              data: { active: true },
            })
          ).id
        : (
            await transaction.position.create({
              data: { name: values.positionName },
            })
          ).id;
    }

    let stationId = values.stationId;
    if (!stationId) {
      const existing = await transaction.station.findFirst({
        where: { name: { equals: values.stationName, mode: "insensitive" } },
      });
      stationId = existing
        ? (
            await transaction.station.update({
              where: { id: existing.id },
              data: { active: true },
            })
          ).id
        : (
            await transaction.station.create({
              data: {
                name: values.stationName,
                code: `STN-${Date.now().toString(36).toUpperCase()}`,
              },
            })
          ).id;
    }

    return transaction.employee.create({
      data: {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        positionId,
        stationId,
        dateHired: new Date(`${values.dateHired}T00:00:00.000Z`),
        monthlySalary: values.monthlySalary,
        status: values.status as EmploymentStatus,
        active: values.status === EmploymentStatus.ACTIVE,
        separationDate: automaticSeparationDate(
          values.status as EmploymentStatus,
        ),
        customFieldValues: {
          create: custom.values.filter((item) => item.value),
        },
        contracts: values.contractEnd
          ? {
              create: {
                startDate: new Date(`${values.dateHired}T00:00:00.000Z`),
                endDate: new Date(`${values.contractEnd}T00:00:00.000Z`),
              },
            }
          : undefined,
      },
    });
  });
  revalidatePath("/employees");
  redirect(`/employees/${employee.id}`);
}

export async function updateEmployee(
  id: string,
  _state: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  const { values, errors } = validate(formData);
  const custom = await customFieldValues(formData);
  Object.assign(errors, custom.errors);
  if (Object.keys(errors).length)
    return { message: "Review the highlighted fields.", errors };
  const existing = await prisma.employee.findUnique({
    where: { id },
    select: {
      id: true,
      separationDate: true,
      contracts: {
        orderBy: { endDate: "desc" },
        take: 1,
        select: { id: true },
      },
    },
  });
  if (!existing) return { message: "This employee no longer exists." };

  await prisma.$transaction(async (transaction) => {
    await transaction.employee.update({
      where: { id },
      data: {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        positionId: values.positionId,
        stationId: values.stationId,
        dateHired: new Date(`${values.dateHired}T00:00:00.000Z`),
        monthlySalary: values.monthlySalary,
        status: values.status as EmploymentStatus,
        separationDate: automaticSeparationDate(
          values.status as EmploymentStatus,
          existing.separationDate,
        ),
        active: values.status === EmploymentStatus.ACTIVE,
      },
    });
    if (values.contractEnd) {
      const contractData = {
        startDate: new Date(`${values.dateHired}T00:00:00.000Z`),
        endDate: new Date(`${values.contractEnd}T00:00:00.000Z`),
      };
      if (existing.contracts[0])
        await transaction.employeeContract.update({
          where: { id: existing.contracts[0].id },
          data: contractData,
        });
      else
        await transaction.employeeContract.create({
          data: { employeeId: id, ...contractData },
        });
    }
    for (const item of custom.values) {
      if (item.value)
        await transaction.employeeCustomFieldValue.upsert({
          where: {
            employeeId_fieldId: { employeeId: id, fieldId: item.fieldId },
          },
          update: { value: item.value },
          create: { employeeId: id, fieldId: item.fieldId, value: item.value },
        });
      else
        await transaction.employeeCustomFieldValue.deleteMany({
          where: { employeeId: id, fieldId: item.fieldId },
        });
    }
  });
  revalidatePath("/employees");
  revalidatePath(`/employees/${id}`);
  redirect("/employees");
}

export async function archiveEmployee(id: string) {
  const existing = await prisma.employee.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return;
  await prisma.employee.update({
    where: { id },
    data: {
      active: false,
      status: EmploymentStatus.TERMINATED,
      separationDate: new Date(),
    },
  });
  revalidatePath("/employees");
  redirect("/employees");
}
