"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { EmployeeFormState } from "../actions";
import type { EmployeeCustomField, EmployeeEditData } from "@/types";

type Option = { id: string; name: string };
export type EmployeeFormOptions = {
  positions: Option[];
  stations: Option[];
  customFields: EmployeeCustomField[];
};
export type EmployeeFormValues = EmployeeEditData;

export function EmployeeForm({
  action,
  options,
  employee,
  cancelHref,
  onCancel,
}: {
  action: (
    state: EmployeeFormState,
    formData: FormData,
  ) => Promise<EmployeeFormState>;
  options: EmployeeFormOptions;
  employee?: EmployeeFormValues;
  cancelHref?: string;
  onCancel?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, { message: "" });
  const [middleInitial, setMiddleInitial] = useState(
    employee?.middleName?.charAt(0).toUpperCase() ?? "",
  );
  const error = (field: string) => state.errors?.[field];

  return (
    <form action={formAction} className="panel employee-form">
      <div className="section-heading">
        <div>
          <h2>{employee ? "Edit employee record" : "Employee information"}</h2>
          <p>Fields marked with an asterisk are required.</p>
        </div>
      </div>
      <div className="panel-body form-grid">
        <Field
          label="First name"
          name="firstName"
          required
          defaultValue={employee?.firstName}
          error={error("firstName")}
        />
        <div className="field">
          <label htmlFor="middleName">Middle initial</label>
          <input
            id="middleName"
            name="middleName"
            value={middleInitial}
            maxLength={1}
            autoCapitalize="characters"
            inputMode="text"
            pattern="[A-Za-z]"
            aria-invalid={Boolean(error("middleName"))}
            onChange={(event) =>
              setMiddleInitial(
                event.target.value
                  .replace(/[^A-Za-z]/g, "")
                  .slice(0, 1)
                  .toUpperCase(),
              )
            }
          />
          {error("middleName") && (
            <small className="field-error">{error("middleName")}</small>
          )}
        </div>
        <Field
          label="Last name"
          name="lastName"
          required
          defaultValue={employee?.lastName}
          error={error("lastName")}
        />
        {options.positions.length > 0 ? (
          <Select
            label="Position"
            name="positionId"
            options={options.positions}
            required
            defaultValue={employee?.positionId}
            error={error("positionId")}
          />
        ) : (
          <Field
            label="Position"
            name="positionName"
            required
            placeholder="Enter a new position"
            error={error("positionId")}
          />
        )}
        {options.stations.length > 0 ? (
          <Select
            label="Station"
            name="stationId"
            options={options.stations}
            required
            defaultValue={employee?.stationId}
            error={error("stationId")}
          />
        ) : (
          <Field
            label="Station"
            name="stationName"
            required
            placeholder="Enter a new station"
            error={error("stationId")}
          />
        )}
        <Field
          label="Monthly salary"
          name="monthlySalary"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={employee?.monthlySalary}
          error={error("monthlySalary")}
        />
        <Field
          label="Date hired"
          name="dateHired"
          type="date"
          required
          defaultValue={employee?.dateHired}
          error={error("dateHired")}
        />
        <Field
          label="Contract end"
          name="contractEnd"
          type="date"
          defaultValue={employee?.contractEnd}
          error={error("contractEnd")}
        />
        <div className="field">
          <label htmlFor="status">Employment status *</label>
          <select
            id="status"
            name="status"
            required
            defaultValue={employee?.status ?? "ACTIVE"}
            aria-invalid={Boolean(error("status"))}
          >
            <option value="ACTIVE">Active</option>
            <option value="RESIGNED">Resigned</option>
            <option value="TERMINATED">Terminated</option>
            <option value="END_OF_CONTRACT">End of contract</option>
          </select>
          {error("status") && (
            <small className="field-error">{error("status")}</small>
          )}
        </div>
        {options.customFields.map((field) => (
          <Field
            key={field.id}
            label={field.name}
            name={`custom_${field.id}`}
            type={
              field.type === "NUMBER"
                ? "number"
                : field.type === "DATE"
                  ? "date"
                  : "text"
            }
            step={field.type === "NUMBER" ? "any" : undefined}
            required={field.required}
            defaultValue={employee?.customFields[field.id]}
            error={error(`custom_${field.id}`)}
          />
        ))}
      </div>
      {state.message && (
        <p className="form-message" role="alert" aria-live="polite">
          {state.message}
        </p>
      )}
      <div className="form-actions">
        {onCancel ? (
          <button
            className="button button--secondary"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : (
          <Link
            className="button button--secondary"
            href={cancelHref ?? "/employees"}
          >
            Cancel
          </Link>
        )}
        <button
          className="button button--primary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Saving…" : employee ? "Save changes" : "Create employee"}
        </button>
      </div>
    </form>
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
    <div className="field">
      <label htmlFor={name}>
        {label}
        {props.required ? " *" : ""}
      </label>
      <input id={name} name={name} aria-invalid={Boolean(error)} {...props} />
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  error,
  ...props
}: {
  label: string;
  name: string;
  options: Option[];
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {props.required ? " *" : ""}
      </label>
      <select id={name} name={name} aria-invalid={Boolean(error)} {...props}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
