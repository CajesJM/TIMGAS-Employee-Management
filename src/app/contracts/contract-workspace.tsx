"use client";

import { FilePlus2, Pencil, Search, X } from "lucide-react";
import { useActionState, useId, useMemo, useRef, useState } from "react";
import { StatusBadge } from "@/components/ui";
import type { EmployeeStatus } from "@/types";
import {
  createContract,
  updateContract,
  type ContractActionState,
} from "./actions";

type EmploymentStatusValue =
  | "ACTIVE"
  | "RESIGNED"
  | "TERMINATED"
  | "END_OF_CONTRACT";
type EmployeeOption = {
  id: string;
  name: string;
  position: string;
  station: string;
  status: EmploymentStatusValue;
};
type ContractRow = {
  id: string;
  employeeId: string;
  employee: string;
  position: string;
  station: string;
  status: EmployeeStatus;
  startDate: string;
  start: string;
  endDate: string;
  end: string;
  daysRemaining: number | null;
  isCurrent: boolean;
  hasContract: boolean;
  notes: string;
};
const initial: ContractActionState = { message: "" };

export function ContractWorkspace({
  contracts,
  employees,
}: {
  contracts: ContractRow[];
  employees: EmployeeOption[];
}) {
  const [query, setQuery] = useState("");
  const [station, setStation] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const rows = useMemo(
    () =>
      contracts.filter(
        (item) =>
          `${item.employee} ${item.position}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (station === "ALL" || item.station === station) &&
          (status === "ALL" || item.status === status),
      ),
    [contracts, query, station, status],
  );
  const current = contracts.filter(
    (item) => item.isCurrent && item.daysRemaining !== null,
  );
  const metric = (days: number) =>
    current.filter(
      (item) => item.daysRemaining! >= 0 && item.daysRemaining! <= days,
    ).length;
  const renewed = contracts.filter(
    (item) => item.hasContract && !item.isCurrent,
  ).length;
  const stations = [...new Set(contracts.map((item) => item.station))];
  return (
    <>
      <section className="metrics-grid">
        <Metric
          title="Expires in 14 days"
          value={metric(14)}
          tone="red"
          note="Immediate manager decision"
        />
        <Metric
          title="Expires in 30 days"
          value={metric(30)}
          tone="amber"
          note="Includes urgent contracts"
        />
        <Metric
          title="Expires in 90 days"
          value={metric(90)}
          note="Review during this quarter"
        />
        <Metric
          title="Previous contracts"
          value={renewed}
          tone="green"
          note="Contract history retained"
        />
      </section>
      <section className="panel">
        <div className="toolbar">
          <label className="search-box">
            <Search size={16} />
            <span className="sr-only">Search contracts</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search employee or position…"
            />
          </label>
          <select
            className="select-control"
            value={station}
            onChange={(event) => setStation(event.target.value)}
            aria-label="Filter contracts by station"
          >
            <option value="ALL">All stations</option>
            {stations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            className="select-control"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter contracts by employee status"
          >
            <option value="ALL">All statuses</option>
            <option>Active</option>
            <option>Resigned</option>
            <option>Terminated</option>
            <option>End of contract</option>
          </select>
          <ContractModal mode="add" employees={employees} />
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Employee</th>
                <th>Position</th>
                <th>Station</th>
                <th>Start</th>
                <th>End</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id}>
                  <td className="mono">{index + 1}</td>
                  <td>
                    <strong>{item.employee}</strong>
                  </td>
                  <td>{item.position}</td>
                  <td>{item.station}</td>
                  <td className="mono">{item.start}</td>
                  <td className="mono">{item.end}</td>
                  <td>
                    {item.daysRemaining === null
                      ? "No contract"
                      : item.daysRemaining < 0
                        ? `${Math.abs(item.daysRemaining)} days overdue`
                        : `${item.daysRemaining} days`}
                  </td>
                  <td>
                    <StatusBadge
                      tone={item.status === "Active" ? "success" : "neutral"}
                    >
                      {item.status}
                    </StatusBadge>
                  </td>
                  <td>
                    <div className="table-actions">
                      {item.hasContract ? (
                        <ContractModal
                          mode="edit"
                          employees={employees}
                          contract={item}
                        />
                      ) : (
                        <ContractModal
                          mode="add"
                          employees={employees}
                          defaultEmployeeId={item.employeeId}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>
            Showing {rows.length} of {contracts.length} contract records
          </span>
        </div>
      </section>
    </>
  );
}

function Metric({
  title,
  value,
  tone,
  note,
}: {
  title: string;
  value: number;
  tone?: string;
  note: string;
}) {
  return (
    <article className={`metric-card${tone ? ` metric-card--${tone}` : ""}`}>
      <div className="metric-top">
        <span>{title}</span>
      </div>
      <p className="metric-value">{value}</p>
      <span className="metric-note">{note}</span>
    </article>
  );
}

function ContractModal({
  mode,
  employees,
  contract,
  defaultEmployeeId,
}: {
  mode: "add" | "edit";
  employees: EmployeeOption[];
  contract?: ContractRow;
  defaultEmployeeId?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  const serverAction =
    mode === "add" ? createContract : updateContract.bind(null, contract!.id);
  const [state, action, pending] = useActionState(serverAction, initial);
  const title = mode === "add" ? "Add contract" : "Edit contract";
  const initialEmployeeId = contract?.employeeId ?? defaultEmployeeId ?? "";
  const initialStatus =
    employees.find((employee) => employee.id === initialEmployeeId)?.status ??
    "ACTIVE";
  const [employmentStatus, setEmploymentStatus] =
    useState<EmploymentStatusValue>(initialStatus);
  const selectEmployee = (employeeId: string) => {
    const employee = employees.find((item) => item.id === employeeId);
    if (employee) setEmploymentStatus(employee.status);
  };
  return (
    <>
      <button
        className={
          mode === "add"
            ? "button button--primary toolbar-action"
            : "icon-button"
        }
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={
          mode === "add" ? undefined : `${title} for ${contract?.employee}`
        }
      >
        {mode === "add" ? <FilePlus2 size={16} /> : <Pencil size={15} />}
        {mode === "add" && title}
      </button>
      <dialog
        className="contract-modal"
        ref={dialog}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="employee-modal-shell">
          <header className="list-modal-header">
            <div>
              <p className="eyebrow">Contract management</p>
              <h2>{title}</h2>
              <p>
                The start date uses the employee’s Date Hired. Enter the
                contract end date and employment status.
              </p>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={close}
              aria-label={`Close ${title}`}
            >
              <X size={18} />
            </button>
          </header>
          <form action={action}>
            <div className="panel-body form-grid">
              <SearchableEmployeeSelect
                employees={employees}
                defaultValue={initialEmployeeId}
                disabled={false}
                error={state.errors?.employeeId}
                onSelect={selectEmployee}
              />
              <ContractField
                label="End date"
                name="endDate"
                type="date"
                required
                defaultValue={contract?.endDate}
                error={state.errors?.endDate}
              />
              <label className="field">
                <span>Employment status *</span>
                <select
                  name="employmentStatus"
                  value={employmentStatus}
                  onChange={(event) =>
                    setEmploymentStatus(
                      event.target.value as EmploymentStatusValue,
                    )
                  }
                  aria-invalid={Boolean(state.errors?.employmentStatus)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="RESIGNED">Resigned</option>
                  <option value="TERMINATED">Terminated</option>
                  <option value="END_OF_CONTRACT">End of contract</option>
                </select>
                {state.errors?.employmentStatus && (
                  <small className="field-error">
                    {state.errors.employmentStatus}
                  </small>
                )}
              </label>
              <label className="field field--full">
                <span>Notes</span>
                <textarea
                  name="notes"
                  maxLength={500}
                  aria-invalid={Boolean(state.errors?.notes)}
                  defaultValue={contract?.notes}
                />
                <small
                  className={state.errors?.notes ? "field-error" : undefined}
                >
                  {state.errors?.notes ?? "Maximum 500 characters"}
                </small>
              </label>
            </div>
            {state.message && (
              <p
                className={`form-message${state.tone === "success" ? " form-message--success" : ""}`}
                role="status"
              >
                {state.message}
              </p>
            )}
            <div className="form-actions">
              <button
                className="button button--secondary"
                type="button"
                onClick={close}
              >
                Cancel
              </button>
              <button
                className="button button--primary"
                type="submit"
                disabled={pending}
              >
                {pending ? "Saving…" : title}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

function SearchableEmployeeSelect({
  employees,
  defaultValue,
  disabled,
  error,
  onSelect,
}: {
  employees: EmployeeOption[];
  defaultValue: string;
  disabled: boolean;
  error?: string;
  onSelect: (employeeId: string) => void;
}) {
  const initialEmployee = employees.find(
    (employee) => employee.id === defaultValue,
  );
  const [query, setQuery] = useState(
    initialEmployee
      ? `${initialEmployee.name} · ${initialEmployee.position}`
      : "",
  );
  const [selectedId, setSelectedId] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const listboxId = useId();
  const searchTerms = query
    .replaceAll("·", " ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const filteredEmployees = employees.filter((employee) => {
    const searchableText =
      `${employee.name} ${employee.position} ${employee.station}`.toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
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
        <input
          type="hidden"
          name="employeeId"
          value={selectedId}
          disabled={disabled}
        />
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
            disabled={disabled}
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedId("");
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder="Search employee by name, position, or station…"
          />
        </label>
        {open && !disabled && (
          <div className="employee-combobox-menu">
            <div
              className="employee-combobox-options"
              id={listboxId}
              role="listbox"
              aria-label="Employees"
            >
              {filteredEmployees.length ? (
                filteredEmployees.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={item.id === selectedId}
                    onClick={() => {
                      setSelectedId(item.id);
                      setQuery(`${item.name} · ${item.position}`);
                      onSelect(item.id);
                      setOpen(false);
                    }}
                  >
                    <strong>{item.name}</strong>
                    <span>
                      {item.position} · {item.station}
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

function ContractField({
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
