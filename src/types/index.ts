export type EmployeeStatus = "Active" | "Resigned" | "Terminated" | "End of contract";

export interface Employee {
  id: string;
  employeeNo: string;
  name: string;
  initials: string;
  position: string;
  department: string;
  station: string;
  dateHired: string;
  dateRegularized: string;
  contractEnd: string;
  status: EmployeeStatus;
  separationDate?: string;
  monthlySalary: number;
  violations: number;
  leave: { sick: number; vacation: number; force: number };
}

export type Tone = "neutral" | "success" | "warning" | "danger" | "info";
