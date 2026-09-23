"use server";

import { revalidatePath } from "next/cache";
import { CustomFieldType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type FieldActionState = { message: string; tone: "success" | "error" };
const result = (
  message: string,
  tone: FieldActionState["tone"] = "success",
): FieldActionState => ({ message, tone });
const refresh = () => {
  revalidatePath("/employees");
  revalidatePath("/employees/new");
};

export async function createCustomField(
  _state: FieldActionState,
  data: FormData,
): Promise<FieldActionState> {
  const name = String(data.get("name") ?? "").trim();
  const type = String(data.get("type") ?? "TEXT") as CustomFieldType;
  if (!name) return result("Field name is required.", "error");
  if (!Object.values(CustomFieldType).includes(type))
    return result("Select a valid field type.", "error");
  if (
    await prisma.employeeCustomField.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    })
  )
    return result("That field already exists.", "error");
  const order = await prisma.employeeCustomField.count();
  await prisma.employeeCustomField.create({
    data: {
      name,
      type,
      required: data.get("required") === "on",
      displayOrder: order,
    },
  });
  refresh();
  return result("Custom employee field added.");
}

export async function updateCustomField(
  id: string,
  _state: FieldActionState,
  data: FormData,
): Promise<FieldActionState> {
  const name = String(data.get("name") ?? "").trim();
  if (!name) return result("Field name is required.", "error");
  if (
    await prisma.employeeCustomField.findFirst({
      where: { name: { equals: name, mode: "insensitive" }, NOT: { id } },
    })
  )
    return result("That field already exists.", "error");
  await prisma.employeeCustomField.update({
    where: { id },
    data: { name, required: data.get("required") === "on" },
  });
  refresh();
  return result("Custom field updated.");
}

export async function toggleCustomField(
  id: string,
  _state: FieldActionState,
): Promise<FieldActionState> {
  void _state;
  const field = await prisma.employeeCustomField.findUnique({ where: { id } });
  if (!field) return result("Custom field was not found.", "error");
  await prisma.employeeCustomField.update({
    where: { id },
    data: { active: !field.active },
  });
  refresh();
  return result(`Custom field ${field.active ? "hidden" : "shown"}.`);
}

export async function deleteCustomField(
  id: string,
  _state: FieldActionState,
): Promise<FieldActionState> {
  void _state;
  const field = await prisma.employeeCustomField.findUnique({
    where: { id },
    include: { _count: { select: { values: true } } },
  });
  if (!field) return result("Custom field was not found.", "error");
  if (field._count.values > 0)
    return result(
      `This field has values for ${field._count.values} employee${field._count.values === 1 ? "" : "s"}. Hide it instead to preserve those records.`,
      "error",
    );
  await prisma.employeeCustomField.delete({ where: { id } });
  refresh();
  return result("Custom field removed.");
}
