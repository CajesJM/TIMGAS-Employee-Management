import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { getContractsWorkspace } from "@/server/workforce";
import { ContractWorkspace } from "./contract-workspace";

export const metadata: Metadata = { title: "Contracts" };

export default async function ContractsPage() {
  const data = await getContractsWorkspace();
  return (
    <>
      <PageHeader
        eyebrow="Employment monitoring"
        title="Contracts"
        description="Create, review, renew, and close employee contracts while preserving their complete history."
      />
      <ContractWorkspace {...data} />
    </>
  );
}
