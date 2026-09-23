"use client";

import { Archive } from "lucide-react";
import { useFormStatus } from "react-dom";

export function ArchiveEmployee({
  action,
  employeeName,
}: {
  action: () => Promise<void>;
  employeeName: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Archive ${employeeName}? Their payroll and employment history will be preserved.`,
          )
        )
          event.preventDefault();
      }}
    >
      <ArchiveButton />
    </form>
  );
}

function ArchiveButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button button--danger" type="submit" disabled={pending}>
      <Archive size={16} />
      {pending ? "Archiving…" : "Archive employee"}
    </button>
  );
}
