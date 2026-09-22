import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  EmploymentStatus,
  LeaveTypeCode,
  PayrollItemKind,
  PrismaClient,
} from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const stations = [
  { id: "station-poblacion", code: "STN-PBT", name: "Poblacion Trinidad" },
  { id: "station-panaban", code: "STN-PAN", name: "Panab-an" },
];

const departments = ["Operations", "Logistics", "Finance", "Technical", "Administration", "Inventory"];
const positions = ["Station Supervisor", "Delivery Driver", "Cashier", "LPG Technician", "Administrative Assistant", "Warehouse Aide"];

const employees = [
  ["emp-001", "TGS-0018", "Maria Lourdes", "Santos", "Station Supervisor", "Operations", "station-poblacion", "2019-05-12", "2019-11-12", "38400.00", EmploymentStatus.ACTIVE],
  ["emp-002", "TGS-0024", "Joel", "Ramirez", "Delivery Driver", "Logistics", "station-panaban", "2021-02-03", "2021-08-03", "26750.00", EmploymentStatus.ACTIVE],
  ["emp-003", "TGS-0031", "Christine", "Villamor", "Cashier", "Finance", "station-poblacion", "2022-07-18", "2023-01-18", "24500.00", EmploymentStatus.ACTIVE],
  ["emp-004", "TGS-0039", "Arnel", "Dela Cruz", "LPG Technician", "Technical", "station-panaban", "2024-01-08", "2024-07-08", "29800.00", EmploymentStatus.ACTIVE],
  ["emp-005", "TGS-0012", "Leah", "Gonzales", "Administrative Assistant", "Administration", "station-poblacion", "2018-03-21", "2018-09-21", "28300.00", EmploymentStatus.RESIGNED],
  ["emp-006", "TGS-0044", "Nico", "Flores", "Warehouse Aide", "Inventory", "station-panaban", "2025-04-11", "2025-10-11", "22100.00", EmploymentStatus.ACTIVE],
] as const;

const payItems = [
  ["OT", "Overtime", PayrollItemKind.EARNING],
  ["CBU", "CBU", PayrollItemKind.DEDUCTION],
  ["RETIREMENT", "Retirement", PayrollItemKind.DEDUCTION],
  ["TIMGAS_LOAN", "TIMGAS Loan", PayrollItemKind.DEDUCTION],
  ["EXPRESS", "Express", PayrollItemKind.DEDUCTION],
  ["PAGIBIG", "Pag-IBIG", PayrollItemKind.DEDUCTION],
  ["PAGIBIG_LOAN", "Pag-IBIG Loan", PayrollItemKind.DEDUCTION],
  ["SAVINGS", "Savings", PayrollItemKind.DEDUCTION],
  ["MOTOR_LOAN", "Motor Loan", PayrollItemKind.DEDUCTION],
  ["HOUSING_LOAN", "Housing Loan", PayrollItemKind.DEDUCTION],
  ["ABSENCES", "Absences", PayrollItemKind.DEDUCTION],
  ["GASOLINE", "Gasoline", PayrollItemKind.DEDUCTION],
  ["LATE", "Late deductions", PayrollItemKind.DEDUCTION],
  ["OTHER", "Other manual deduction", PayrollItemKind.DEDUCTION],
] as const;

async function main() {
  for (const station of stations) {
    await prisma.station.upsert({ where: { code: station.code }, update: station, create: station });
  }

  for (const name of departments) {
    await prisma.department.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const name of positions) {
    await prisma.position.upsert({ where: { name }, update: {}, create: { name } });
  }

  await prisma.leaveType.upsert({ where: { code: LeaveTypeCode.SICK }, update: {}, create: { code: LeaveTypeCode.SICK, name: "Sick leave", annualAllocation: "15", carriesOver: true } });
  await prisma.leaveType.upsert({ where: { code: LeaveTypeCode.VACATION }, update: {}, create: { code: LeaveTypeCode.VACATION, name: "Vacation leave", annualAllocation: "10", cashConvertible: true } });
  await prisma.leaveType.upsert({ where: { code: LeaveTypeCode.FORCE }, update: {}, create: { code: LeaveTypeCode.FORCE, name: "Force leave", annualAllocation: "5", expiresAtYearEnd: true } });

  for (const [code, name, kind] of payItems) {
    await prisma.payItemType.upsert({ where: { code }, update: { name, kind }, create: { code, name, kind } });
  }

  for (const [id, employeeNo, firstName, lastName, positionName, departmentName, stationId, hired, regularized, salary, status] of employees) {
    const [department, position] = await Promise.all([
      prisma.department.findUniqueOrThrow({ where: { name: departmentName } }),
      prisma.position.findUniqueOrThrow({ where: { name: positionName } }),
    ]);

    await prisma.employee.upsert({
      where: { employeeNo },
      update: {},
      create: {
        id,
        employeeNo,
        firstName,
        lastName,
        departmentId: department.id,
        positionId: position.id,
        stationId,
        dateHired: new Date(`${hired}T00:00:00.000Z`),
        dateRegularized: new Date(`${regularized}T00:00:00.000Z`),
        monthlySalary: salary,
        status,
      },
    });
  }

  await prisma.systemSetting.upsert({
    where: { key: "payroll.schedule" },
    update: {},
    create: { key: "payroll.schedule", value: { first: "15TH", second: "END_OF_MONTH" } },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
