"use client";

import {
  MapPin,
  Plus,
  Save,
  SlidersHorizontal,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { StatusBadge } from "@/components/ui";
import {
  createListItem,
  deleteListItem,
  toggleListItem,
  updateListItem,
  type ListActionState,
  type ListKind,
} from "../lists/actions";

export type ReferenceItem = {
  id: string;
  name: string;
  active: boolean;
  code?: string;
  employeeCount: number;
};
const initialState: ListActionState = { message: "", tone: "success" };

export function ManageListsModal({
  positions,
  stations,
}: {
  positions: ReferenceItem[];
  stations: ReferenceItem[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        className="button button--secondary toolbar-action"
        type="button"
        onClick={() => dialog.current?.showModal()}
      >
        <SlidersHorizontal size={16} />
        Manage lists
      </button>
      <dialog
        className="list-modal"
        ref={dialog}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="list-modal-shell">
          <header className="list-modal-header">
            <div>
              <p className="eyebrow">Employee settings</p>
              <h2>Manage dropdown lists</h2>
              <p>
                Control the positions and stations available when adding or
                editing an employee.
              </p>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close manage lists"
            >
              <X size={18} />
            </button>
          </header>
          <div className="reference-grid list-modal-body">
            <ReferencePanel
              kind="position"
              title="Positions"
              items={positions}
            />
            <ReferencePanel kind="station" title="Stations" items={stations} />
          </div>
        </div>
      </dialog>
    </>
  );
}

function ReferencePanel({
  kind,
  title,
  items,
}: {
  kind: ListKind;
  title: string;
  items: ReferenceItem[];
}) {
  const [state, action, pending] = useActionState(
    createListItem.bind(null, kind),
    initialState,
  );
  return (
    <section className="panel reference-panel">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>
            {kind === "position"
              ? "Job titles shown in the Position dropdown."
              : "Locations shown in the Station dropdown."}
          </p>
        </div>
        {kind === "position" ? <Tags size={18} /> : <MapPin size={18} />}
      </div>
      <form action={action} className="reference-add-form">
        {kind === "station" && (
          <label className="field">
            <span>Code</span>
            <input name="code" required maxLength={20} placeholder="STN-NEW" />
          </label>
        )}
        <label className="field">
          <span>{kind === "position" ? "Position name" : "Station name"}</span>
          <input
            name="name"
            required
            maxLength={100}
            placeholder="Add a new item"
          />
        </label>
        <button
          className="button button--primary"
          type="submit"
          disabled={pending}
        >
          <Plus size={16} />
          {pending ? "Adding…" : "Add"}
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
      <div className="reference-list">
        {items.length ? (
          items.map((item) => (
            <ReferenceRow key={item.id} kind={kind} item={item} />
          ))
        ) : (
          <p className="empty-reference">
            No {title.toLowerCase()} yet. Add one above, or enter it manually
            when creating an employee.
          </p>
        )}
      </div>
    </section>
  );
}

function ReferenceRow({ kind, item }: { kind: ListKind; item: ReferenceItem }) {
  const [message, setMessage] = useState<ListActionState>(initialState);
  return (
    <div className="reference-row">
      <EditForm kind={kind} item={item} report={setMessage} />
      <div className="reference-meta">
        <StatusBadge tone={item.active ? "success" : "neutral"}>
          {item.active ? "Shown" : "Hidden"}
        </StatusBadge>
        <span>
          {item.employeeCount} employee{item.employeeCount === 1 ? "" : "s"}
        </span>
        <ToggleForm kind={kind} item={item} report={setMessage} />
        <DeleteForm kind={kind} item={item} report={setMessage} />
      </div>
      {message.message && (
        <p
          className={`row-feedback row-feedback--${message.tone}`}
          role="status"
        >
          {message.message}
        </p>
      )}
    </div>
  );
}

type RowProps = {
  kind: ListKind;
  item: ReferenceItem;
  report: (state: ListActionState) => void;
};
function EditForm({ kind, item, report }: RowProps) {
  const [state, action, pending] = useActionState(
    updateListItem.bind(null, kind, item.id),
    initialState,
  );
  useReport(state, report);
  return (
    <form action={action} className="reference-edit-form">
      {kind === "station" && (
        <input
          name="code"
          required
          maxLength={20}
          defaultValue={item.code}
          aria-label={`${item.name} code`}
        />
      )}
      <input
        name="name"
        required
        maxLength={100}
        defaultValue={item.name}
        aria-label={`${kind} name`}
      />
      <button
        className="icon-button"
        type="submit"
        disabled={pending}
        aria-label={`Save ${item.name}`}
      >
        <Save size={15} />
      </button>
    </form>
  );
}
function ToggleForm({ kind, item, report }: RowProps) {
  const [state, action, pending] = useActionState(
    toggleListItem.bind(null, kind, item.id),
    initialState,
  );
  useReport(state, report);
  return (
    <form action={action}>
      <button className="text-button" type="submit" disabled={pending}>
        {item.active ? "Hide" : "Show"}
      </button>
    </form>
  );
}
function DeleteForm({ kind, item, report }: RowProps) {
  const [state, action, pending] = useActionState(
    deleteListItem.bind(null, kind, item.id),
    initialState,
  );
  useReport(state, report);
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Remove “${item.name}” permanently? This cannot be undone.`,
          )
        )
          event.preventDefault();
      }}
    >
      <button
        className="icon-button icon-button--danger"
        type="submit"
        disabled={pending}
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={15} />
      </button>
    </form>
  );
}
function useReport(state: ListActionState, report: RowProps["report"]) {
  useEffect(() => {
    if (state.message) report(state);
  }, [state, report]);
}
