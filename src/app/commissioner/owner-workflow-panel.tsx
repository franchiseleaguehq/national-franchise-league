"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, ClipboardCheck, Dice5, RotateCcw, UserMinus } from "lucide-react";

import { Button } from "@/components/ui/button";

type WorkflowApplication = {
  id: string;
  preferredDisplayName: string;
  gamertag: string;
  email: string;
  teamPreferenceNotes: string;
  status: string;
};

type WorkflowOwner = {
  id: string;
  name: string;
  slug: string;
  status: string;
  teamId?: string;
  pastTeamIds: string[];
};

type Step = "pending" | "approved" | "lottery" | "released" | "reinstated";

const stepCopy: Record<Step, string> = {
  pending: "Pending Commissioner Review",
  approved: "Approved - Awaiting Lottery",
  lottery: "Added to Lottery Pool",
  released: "Former Owner",
  reinstated: "Active Owner Reinstated",
};

export function OwnerWorkflowPanel({ applications, formerOwner }: { applications: WorkflowApplication[]; formerOwner?: WorkflowOwner }) {
  const [step, setStep] = useState<Step>("pending");
  const selectedApplication = applications.find((application) => application.status === "pending_commissioner_review") ?? applications[0];
  const permanentOwnerId = formerOwner?.id ?? "owner_former_demo";
  const historyLabel = useMemo(() => {
    if (!formerOwner) return "No duplicate owner profile is created. Stable owner ID will be reused.";
    return `No duplicate owner profile is created. ${formerOwner.name} keeps stable ID ${permanentOwnerId} with ${formerOwner.pastTeamIds.length} past team record${formerOwner.pastTeamIds.length === 1 ? "" : "s"}.`;
  }, [formerOwner, permanentOwnerId]);

  return (
    <div className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <ClipboardCheck className="size-4" />
            Commissioner Approval Workflow
          </p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Owner Access Control</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-chrome-300">
            Preview the required workflow: applicants stay pending until review, approval does not assign or reserve a team, lottery order controls team selection, and released owner history remains permanent.
          </p>
        </div>
        <div className="rounded-md border border-electric/30 bg-electric/10 px-4 py-3 text-sm font-bold text-electric">{stepCopy[step]}</div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.38fr_0.62fr]">
        <aside className="rounded-md border border-white/10 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Selected Application</p>
          <p className="mt-2 font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{selectedApplication?.preferredDisplayName ?? "No Pending Applicant"}</p>
            <p className="mt-1 text-sm text-chrome-300">{selectedApplication?.gamertag ?? "Submit an application to populate this panel."}</p>
            <p className="mt-1 text-sm text-chrome-300">{selectedApplication?.email ?? "Private email only visible inside Commissioner Hub."}</p>
            <p className="mt-2 text-sm leading-6 text-chrome-300">Reference preferences: {selectedApplication?.teamPreferenceNotes ?? "None submitted."}</p>
            <div className="mt-4 rounded-md border border-white/10 bg-black/35 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Current Rule</p>
              <p className="mt-2 text-sm leading-6 text-chrome-300">Applicants cannot approve themselves, select teams early, reserve teams, or edit official league records.</p>
          </div>
        </aside>

        <div className="grid gap-3">
          <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Application Decision</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Button type="button" variant="electric" onClick={() => setStep("approved")}>
                <CheckCircle2 className="size-4" />
                Approve
              </Button>
              <Button type="button" variant="chrome" onClick={() => setStep("pending")}>
                <CircleAlert className="size-4" />
                Request More Info
              </Button>
              <Button type="button" variant="chrome" onClick={() => setStep("pending")}>
                Reject
              </Button>
            </div>
            <p className="mt-3 text-sm leading-6 text-chrome-300">Approval moves the applicant to approved-awaiting-lottery. It does not activate a team assignment or reserve any team.</p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Lottery Pool</p>
            <Button type="button" variant="electric" disabled={step !== "approved"} onClick={() => setStep("lottery")} className="mt-3 w-full">
              <Dice5 className="size-4" />
              Add to Lottery Pool
            </Button>
            <p className="mt-3 text-sm leading-6 text-chrome-300">
              Approved owners remain unassigned until their locked lottery turn. Team choices happen only in the Team Lottery section.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Release Owner</p>
              <p className="mt-2 text-sm leading-6 text-chrome-300">Release removes active access and opens the team without deleting history.</p>
              <Button type="button" variant="chrome" className="mt-3 w-full" disabled={step !== "lottery" && step !== "reinstated"} onClick={() => setStep("released")}>
                <UserMinus className="size-4" />
                Release Owner
              </Button>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Reinstate Owner</p>
              <p className="mt-2 text-sm leading-6 text-chrome-300">{historyLabel}</p>
              <Button type="button" variant="electric" className="mt-3 w-full" disabled={step !== "released"} onClick={() => setStep("reinstated")}>
                <RotateCcw className="size-4" />
                Reinstate Same Owner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
