"use client";

import { Pencil, Plus, Search, X } from "lucide-react";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import {
  createViolation,
  updateViolation,
  type ViolationActionState,
} from "./actions";

type EmployeeOption = {
  id: string;
  name: string;
  position: string;
  station: string;
};
export type ViolationEditData = {
  id: string;
  employeeId: string;
  category: string;
  incidentDate: string;
  description: string;
  status: "OPEN" | "RESOLVED";
  resolutionDate: string;
};
const initialState: ViolationActionState = { message: "" };

export function RecordViolationModal({
  employees,
}: {
  employees: EmployeeOption[];
}) {
  return <ViolationModal mode="create" employees={employees} />;
}

export function EditViolationModal({
  employees,
  violation,
}: {
  employees: EmployeeOption[];
  violation: ViolationEditData;
}) {
  return (
    <ViolationModal mode="edit" employees={employees} violation={violation} />
  );
}

function ViolationModal({
  mode,
  employees,
  violation,
}: {
  mode: "create" | "edit";
  employees: EmployeeOption[];
  violation?: ViolationEditData;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const serverAction =
    mode === "create"
      ? createViolation
      : updateViolation.bind(null, violation!.id);
  const [state, action, pending] = useActionState(serverAction, initialState);
  const [status, setStatus] = useState<"OPEN" | "RESOLVED">(
    violation?.status ?? "OPEN",
  );
  const title = mode === "create" ? "Record violation" : "Edit violation";
  useEffect(() => {
    if (state.tone === "success") dialog.current?.close();
  }, [state]);

  return (
    <>
      <button
        className={mode === "create" ? "button button--primary" : "icon-button"}
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={
          mode === "edit"
            ? `Edit violation for ${employees.find((employee) => employee.id === violation?.employeeId)?.name ?? "employee"}`
            : undefined
        }
      >
        {mode === "create" ? (
          <>
            <Plus size={17} />
            Record violation
          </>
        ) : (
          <Pencil size={15} />
        )}
      </button>
      <dialog
        className="contract-modal"
        ref={dialog}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="employee-modal-shell">
          <header className="list-modal-header">
            <div>
              <p className="eyebrow">Employee records</p>
              <h2>{title}</h2>
              <p>
                Document the incident description and current resolution status.
              </p>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label={`Close ${title.toLowerCase()}`}
            >
              <X size={18} />
            </button>
          </header>
          <form action={action}>
            <div className="panel-body form-grid">
              <EmployeeSearch
                employees={employees}
                defaultValue={violation?.employeeId ?? ""}
                error={state.errors?.employeeId}
              />
              <Field
                label="Category"
                name="category"
                required
                maxLength={100}
                defaultValue={violation?.category}
                error={state.errors?.category}
              />
              <Field
                label="Incident date"
                name="incidentDate"
                type="date"
                required
                defaultValue={violation?.incidentDate}
                error={state.errors?.incidentDate}
              />
              <label className="field field--full">
                <span>Description *</span>
                <textarea
                  name="description"
                  required
                  maxLength={250}
                  aria-invalid={Boolean(state.errors?.description)}
                  defaultValue={violation?.description}
                />
                <small
                  className={
                    state.errors?.description ? "field-error" : undefined
                  }
                >
                  {state.errors?.description ?? "Maximum 250 characters"}
                </small>
              </label>
              <label className="field">
                <span>Status *</span>
                <select
                  name="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as "OPEN" | "RESOLVED")
                  }
                >
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </label>
              {status === "RESOLVED" && (
                <Field
                  label="Resolution date"
                  name="resolutionDate"
                  type="date"
                  required
                  defaultValue={violation?.resolutionDate}
                  error={state.errors?.resolutionDate}
                />
              )}
            </div>
            {state.message && state.tone !== "success" && (
              <p className="form-message" role="alert">
                {state.message}
              </p>
            )}
            <div className="form-actions">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => dialog.current?.close()}
              >
                Cancel
              </button>
              <button
                className="button button--primary"
                type="submit"
                disabled={pending}
              >
                {pending
                  ? "Saving…"
                  : mode === "create"
                    ? "Save violation"
                    : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

function EmployeeSearch({
  employees,
  defaultValue,
  error,
}: {
  employees: EmployeeOption[];
  defaultValue: string;
  error?: string;
}) {
  const initialEmployee = employees.find(
    (employee) => employee.id === defaultValue,
  );
  const [query, setQuery] = useState(
    initialEmployee
      ? `${initialEmployee.name} · ${initialEmployee.position}`
      : "",
  );
  const [employeeId, setEmployeeId] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const listboxId = useId();
  const terms = query
    .replaceAll("·", " ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const results = employees.filter((employee) => {
    const value =
      `${employee.name} ${employee.position} ${employee.station}`.toLowerCase();
    return terms.every((term) => value.includes(term));
  });
  return (
    <div className="field field--full">
      <span>Employee *</span>
      <div
        className="employee-combobox"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
      >
        <input type="hidden" name="employeeId" value={employeeId} />
        <label className="employee-combobox-input">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search and select employee</span>
          <input
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-invalid={Boolean(error)}
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setEmployeeId("");
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder="Search employee by name, position, or station…"
          />
        </label>
        {open && (
          <div className="employee-combobox-menu">
            <div
              className="employee-combobox-options"
              id={listboxId}
              role="listbox"
              aria-label="Employees"
            >
              {results.length ? (
                results.map((employee) => (
                  <button
                    key={employee.id}
                    type="button"
                    role="option"
                    aria-selected={employee.id === employeeId}
                    onClick={() => {
                      setEmployeeId(employee.id);
                      setQuery(`${employee.name} · ${employee.position}`);
                      setOpen(false);
                    }}
                  >
                    <strong>{employee.name}</strong>
                    <span>
                      {employee.position} · {employee.station}
                    </span>
                  </button>
                ))
              ) : (
                <p>No employees found</p>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}

function Field({
  label,
  name,
  error,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      <span>
        {label}
        {props.required ? " *" : ""}
      </span>
      <input name={name} aria-invalid={Boolean(error)} {...props} />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
