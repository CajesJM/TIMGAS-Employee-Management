"use client";

import { Plus, X } from "lucide-react";
import { useRef } from "react";
import { createEmployee } from "../actions";
import { EmployeeForm, type EmployeeFormOptions } from "./employee-form";

export function AddEmployeeModal({
  options,
}: {
  options: EmployeeFormOptions;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        className="button button--primary"
        type="button"
        onClick={() => dialog.current?.showModal()}
      >
        <Plus size={17} />
        Add employee
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
              <h2>Add employee</h2>
              <p>
                Create a new employee record. Required fields are marked with an
                asterisk.
              </p>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={close}
              aria-label="Close add employee"
            >
              <X size={18} />
            </button>
          </header>
          <div className="employee-modal-body">
            <EmployeeForm
              action={createEmployee}
              options={options}
              onCancel={close}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
