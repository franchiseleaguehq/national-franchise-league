"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ApplicationReviewActions({ applicationId, status }: { applicationId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (status !== "pending_commissioner_review" && status !== "submitted") return null;

  async function act(action: "approve" | "deny") {
    setBusy(action);
    setError(null);
    try {
      const response = await fetch(`/api/commissioner/applications/${applicationId}/${action}`, { method: "POST" });
      const payload = (await response.json()) as { ok: boolean; message?: string };
      if (!payload.ok) {
        setError(payload.message ?? "Something went wrong.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <Button type="button" variant="electric" size="sm" disabled={busy !== null} onClick={() => act("approve")}>
        {busy === "approve" ? "Approving…" : "Approve & create profile"}
      </Button>
      <Button type="button" variant="chrome" size="sm" disabled={busy !== null} onClick={() => act("deny")}>
        {busy === "deny" ? "Denying…" : "Deny"}
      </Button>
      {error ? <p className="w-full text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
