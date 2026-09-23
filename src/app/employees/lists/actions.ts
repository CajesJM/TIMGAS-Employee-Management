"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ListKind = "position" | "station";
export type ListActionState = { message: string; tone: "success" | "error" };
const value = (data: FormData, key: string) =>
  String(data.get(key) ?? "").trim();
const result = (
  message: string,
  tone: ListActionState["tone"] = "success",
): ListActionState => ({ message, tone });
const refresh = () => {
  revalidatePath("/employees");
  revalidatePath("/employees/new");
  revalidatePath("/employees/lists");
};

export async function createListItem(
  kind: ListKind,
  _state: ListActionState,
  data: FormData,
): Promise<ListActionState> {
  const name = value(data, "name");
  if (!name) return result("Name is required.", "error");
  if (kind === "position") {
    if (
      await prisma.position.findFirst({
        where: { name: { equals: name, mode: "insensitive" } },
      })
    )
      return result("That position already exists.", "error");
    await prisma.position.create({ data: { name } });
  } else {
    const code = value(data, "code").toUpperCase();
    if (!code) return result("Station code is required.", "error");
    if (
      await prisma.station.findFirst({
        where: {
          OR: [
            { name: { equals: name, mode: "insensitive" } },
            { code: { equals: code, mode: "insensitive" } },
          ],
        },
      })
    )
      return result("That station name or code already exists.", "error");
    await prisma.station.create({ data: { name, code } });
  }
  refresh();
  return result(`${kind === "position" ? "Position" : "Station"} added.`);
}

export async function updateListItem(
  kind: ListKind,
  id: string,
  _state: ListActionState,
  data: FormData,
): Promise<ListActionState> {
  const name = value(data, "name");
  if (!name) return result("Name is required.", "error");
  if (kind === "position") {
    if (
      await prisma.position.findFirst({
        where: { name: { equals: name, mode: "insensitive" }, NOT: { id } },
      })
    )
      return result("That position already exists.", "error");
    await prisma.position.update({ where: { id }, data: { name } });
  } else {
    const code = value(data, "code").toUpperCase();
    if (!code) return result("Station code is required.", "error");
    if (
      await prisma.station.findFirst({
        where: {
          OR: [
            { name: { equals: name, mode: "insensitive" } },
            { code: { equals: code, mode: "insensitive" } },
          ],
          NOT: { id },
        },
      })
    )
      return result("That station name or code already exists.", "error");
    await prisma.station.update({ where: { id }, data: { name, code } });
  }
  refresh();
  return result(`${kind === "position" ? "Position" : "Station"} updated.`);
}

export async function toggleListItem(
  kind: ListKind,
  id: string,
  _state: ListActionState,
): Promise<ListActionState> {
  void _state;
  const item =
    kind === "position"
      ? await prisma.position.findUnique({
          where: { id },
          include: { _count: { select: { employees: true } } },
        })
      : await prisma.station.findUnique({
          where: { id },
          include: { _count: { select: { employees: true } } },
        });
  if (!item) return result("List item was not found.", "error");
  if (item.active && item._count.employees > 0)
    return result(
      `This ${kind} is assigned to ${item._count.employees} employee${item._count.employees === 1 ? "" : "s"}. Reassign them before hiding it.`,
      "error",
    );
  const active = !item.active;
  if (kind === "position")
    await prisma.position.update({ where: { id }, data: { active } });
  else await prisma.station.update({ where: { id }, data: { active } });
  refresh();
  return result(
    `${kind === "position" ? "Position" : "Station"} ${active ? "shown" : "hidden"} in dropdowns.`,
  );
}

export async function deleteListItem(
  kind: ListKind,
  id: string,
  _state: ListActionState,
): Promise<ListActionState> {
  void _state;
  if (kind === "position") {
    const item = await prisma.position.findUnique({
      where: { id },
      include: { _count: { select: { employees: true } } },
    });
    if (!item) return result("Position was not found.", "error");
    if (item._count.employees > 0)
      return result(
        `This position is assigned to ${item._count.employees} employee${item._count.employees === 1 ? "" : "s"} and cannot be removed.`,
        "error",
      );
    await prisma.position.delete({ where: { id } });
  } else {
    const item = await prisma.station.findUnique({
      where: { id },
      include: { _count: { select: { employees: true, assignments: true } } },
    });
    if (!item) return result("Station was not found.", "error");
    if (item._count.employees + item._count.assignments > 0)
      return result(
        "This station has employee records or assignment history and cannot be removed.",
        "error",
      );
    await prisma.station.delete({ where: { id } });
  }
  refresh();
  return result(`${kind === "position" ? "Position" : "Station"} removed.`);
}
