"use client";

import { Pencil, X } from "lucide-react";
import { useRef } from "react";
import type { EmployeeEditData } from "@/types";
import { updateEmployee } from "../actions";
import { EmployeeForm, type EmployeeFormOptions } from "./employee-form";

export function EditEmployeeModal({
  employeeId,
  employeeName,
  employee,
  options,
  compact = false,
}: {
  employeeId: string;
  employeeName: string;
  employee: EmployeeEditData;
  options: EmployeeFormOptions;
  compact?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  const action = updateEmployee.bind(null, employeeId);
  return (
    <>
      <button
        className={compact ? "icon-button" : "button button--secondary"}
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={compact ? `Edit ${employeeName}` : undefined}
      >
        <Pencil size={compact ? 15 : 16} />
        {!compact && "Edit employee"}
      </button>
      <dialog
        className="employee-modal"
        ref={dialog}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="employee-modal-shell">
          <header className="list-modal-header">
            <div>
              <p className="eyebrow">People records</p>
              <h2>Edit employee</h2>
              <p>Update {employeeName}’s employee information.</p>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={close}
              aria-label="Close edit employee"
            >
              <X size={18} />
            </button>
          </header>
          <div className="employee-modal-body">
            <EmployeeForm
              action={action}
              options={options}
              employee={employee}
              onCancel={close}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
