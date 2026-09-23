"use client";

import { Columns3, Plus, Save, Trash2, X } from "lucide-react";
import { useActionState, useRef } from "react";
import type { EmployeeCustomField } from "@/types";
import {
  createCustomField,
  deleteCustomField,
  toggleCustomField,
  updateCustomField,
  type FieldActionState,
} from "../fields/actions";

const initial: FieldActionState = { message: "", tone: "success" };

export function ManageFieldsModal({
  fields,
}: {
  fields: EmployeeCustomField[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(createCustomField, initial);
  return (
    <>
      <button
        className="button button--secondary"
        type="button"
        onClick={() => dialog.current?.showModal()}
      >
        <Columns3 size={16} />
        Manage fields
      </button>
      <dialog
        className="list-modal field-modal"
        ref={dialog}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="list-modal-shell">
          <header className="list-modal-header">
            <div>
              <p className="eyebrow">Employee settings</p>
              <h2>Manage custom fields</h2>
              <p>
                Create additional fields that automatically appear in employee
                forms and the employee table.
              </p>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close manage fields"
            >
              <X size={18} />
            </button>
          </header>
          <div className="field-modal-body">
            <form action={action} className="custom-field-add">
              <label className="field">
                <span>Field name</span>
                <input
                  name="name"
                  required
                  maxLength={80}
                  placeholder="e.g. Contact number"
                />
              </label>
              <label className="field">
                <span>Data type</span>
                <select name="type">
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="DATE">Date</option>
                </select>
              </label>
              <label className="check-field">
                <input name="required" type="checkbox" />
                Required
              </label>
              <button
                className="button button--primary"
                type="submit"
                disabled={pending}
              >
                <Plus size={16} />
                Add field
              </button>
            </form>
            {state.message && (
              <p
                className={`list-feedback list-feedback--${state.tone}`}
                role="status"
              >
                {state.message}
              </p>
            )}
            <div className="custom-field-list">
              {fields.length ? (
                fields.map((field) => (
                  <CustomFieldRow key={field.id} field={field} />
                ))
              ) : (
                <p className="empty-reference">No custom fields yet.</p>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

function CustomFieldRow({ field }: { field: EmployeeCustomField }) {
  const [updateState, updateAction, updating] = useActionState(
    updateCustomField.bind(null, field.id),
    initial,
  );
  const [toggleState, toggleAction, toggling] = useActionState(
    toggleCustomField.bind(null, field.id),
    initial,
  );
  const [deleteState, deleteAction, deleting] = useActionState(
    deleteCustomField.bind(null, field.id),
    initial,
  );
  const feedback = [updateState, toggleState, deleteState].find(
    (item) => item.message,
  );
  return (
    <div className="custom-field-row">
      <form action={updateAction} className="custom-field-edit">
        <input
          name="name"
          required
          defaultValue={field.name}
          aria-label="Field name"
        />
        <span className="status">{field.type.toLowerCase()}</span>
        <label className="check-field">
          <input
            name="required"
            type="checkbox"
            defaultChecked={field.required}
          />
          Required
        </label>
        <button
          className="icon-button"
          type="submit"
          disabled={updating}
          aria-label={`Save ${field.name}`}
        >
          <Save size={15} />
        </button>
      </form>
      <div className="reference-meta">
        <span>{field.active ? "Shown in forms and table" : "Hidden"}</span>
        <form action={toggleAction}>
          <button className="text-button" type="submit" disabled={toggling}>
            {field.active ? "Hide" : "Show"}
          </button>
        </form>
        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (!window.confirm(`Remove “${field.name}” permanently?`))
              event.preventDefault();
          }}
        >
          <button
            className="icon-button icon-button--danger"
            type="submit"
            disabled={deleting}
            aria-label={`Remove ${field.name}`}
          >
            <Trash2 size={15} />
          </button>
        </form>
      </div>
      {feedback && (
        <p
          className={`row-feedback row-feedback--${feedback.tone}`}
          role="status"
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}
