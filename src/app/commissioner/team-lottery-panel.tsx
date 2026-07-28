"use client";

import { useMemo, useState } from "react";
import { Dice5, LockKeyhole, RotateCcw, ShieldCheck, Timer, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";

type LotteryOwner = {
  id: string;
  name: string;
  gamertag: string;
  status: string;
  teamSelectionStatus: string;
};

type LotteryTeam = {
  id: string;
  fullName: string;
  abbreviation: string;
  availableForLottery: boolean;
};

type LotteryEntryStatus = "waiting" | "on_the_clock" | "team_selected" | "passed" | "removed";

type LotteryEntry = {
  id: string;
  ownerId: string;
  pickNumber: number;
  status: LotteryEntryStatus;
  lockedAt?: string;
};

type LotterySelection = {
  id: string;
  ownerId: string;
  teamId: string;
  pickNumber: number;
  selectedAt: string;
};

function shuffle<T>(items: T[]) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function statusLabel(status: LotteryEntryStatus) {
  const labels: Record<LotteryEntryStatus, string> = {
    waiting: "Waiting",
    on_the_clock: "On the Clock",
    team_selected: "Team Selected",
    passed: "Passed",
    removed: "Removed",
  };
  return labels[status];
}

export function TeamLotteryPanel({ season, owners, teams }: { season: number; owners: LotteryOwner[]; teams: LotteryTeam[] }) {
  const [entries, setEntries] = useState<LotteryEntry[]>([]);
  const [selections, setSelections] = useState<LotterySelection[]>([]);
  const [lockedAt, setLockedAt] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const lotteryOwnerIds = new Set(entries.map((entry) => entry.ownerId));
  const selectedTeamIds = new Set(selections.map((selection) => selection.teamId));
  const activeEntry = entries.find((entry) => entry.status === "on_the_clock");
  const activeOwner = owners.find((owner) => owner.id === activeEntry?.ownerId);
  const availableTeams = teams.filter((team) => team.availableForLottery && !selectedTeamIds.has(team.id));

  const historyPreview = useMemo(
    () =>
      selections.map((selection) => {
        const owner = owners.find((item) => item.id === selection.ownerId);
        const team = teams.find((item) => item.id === selection.teamId);
        return `${selection.pickNumber}. ${owner?.name ?? "Owner"} selected ${team?.fullName ?? "Team"} at ${new Date(selection.selectedAt).toLocaleString()}`;
      }),
    [owners, selections, teams],
  );

  function addApprovedOwners() {
    const nextOwners = owners.filter((owner) => !lotteryOwnerIds.has(owner.id));
    setEntries((current) => [
      ...current,
      ...nextOwners.map((owner, index) => ({
        id: `lottery_${owner.id}`,
        ownerId: owner.id,
        pickNumber: current.length + index + 1,
        status: "waiting" as const,
      })),
    ]);
  }

  function randomizeOrder() {
    if (lockedAt) return;
    setEntries((current) =>
      shuffle(current).map((entry, index) => ({
        ...entry,
        pickNumber: index + 1,
        status: index === 0 ? "on_the_clock" : "waiting",
      })),
    );
  }

  function lockOrder() {
    if (entries.length === 0) return;
    const timestamp = new Date().toISOString();
    setLockedAt(timestamp);
    setEntries((current) =>
      [...current]
        .sort((a, b) => a.pickNumber - b.pickNumber)
        .map((entry, index): LotteryEntry => ({
          ...entry,
          pickNumber: index + 1,
          lockedAt: timestamp,
          status: index === 0 ? "on_the_clock" : entry.status === "removed" ? "removed" : "waiting",
        })),
    );
  }

  function moveClockForward(updatedEntries: LotteryEntry[]): LotteryEntry[] {
    if (!lockedAt) return updatedEntries;
    if (updatedEntries.some((entry) => entry.status === "on_the_clock")) return updatedEntries;
    const nextWaiting = updatedEntries.filter((entry) => entry.status === "waiting").sort((a, b) => a.pickNumber - b.pickNumber)[0];
    if (!nextWaiting) return updatedEntries;
    return updatedEntries.map((entry): LotteryEntry => (entry.id === nextWaiting.id ? { ...entry, status: "on_the_clock" } : entry));
  }

  function updateEntryStatus(entryId: string, status: LotteryEntryStatus) {
    setEntries((current) => moveClockForward(current.map((entry): LotteryEntry => (entry.id === entryId ? { ...entry, status } : entry))));
  }

  function recordSelection() {
    if (!activeEntry || !selectedTeamId || selectedTeamIds.has(selectedTeamId)) return;
    const selectedAt = new Date().toISOString();
    setSelections((current) => [
      ...current,
      {
        id: `selection_${activeEntry.ownerId}_${selectedTeamId}`,
        ownerId: activeEntry.ownerId,
        teamId: selectedTeamId,
        pickNumber: activeEntry.pickNumber,
        selectedAt,
      },
    ]);
    setSelectedTeamId("");
    setEntries((current) => moveClockForward(current.map((entry): LotteryEntry => (entry.id === activeEntry.id ? { ...entry, status: "team_selected" } : entry))));
  }

  return (
    <div className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Dice5 className="size-4" />
            Team Lottery
          </p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Season {season} Team Lottery</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-chrome-300">
            Every approved owner, including the Commissioner, starts unassigned. Preferences are notes only; teams are selected in locked lottery order.
          </p>
        </div>
        <div className="rounded-md border border-electric/30 bg-electric/10 px-4 py-3 text-sm font-bold text-electric">
          {lockedAt ? `Locked ${new Date(lockedAt).toLocaleString()}` : "Order Unlocked"}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Button type="button" variant="chrome" onClick={addApprovedOwners} disabled={owners.length === entries.length || Boolean(lockedAt)}>
          <ShieldCheck className="size-4" />
          Add Approved Owners
        </Button>
        <Button type="button" variant="electric" onClick={randomizeOrder} disabled={entries.length < 2 || Boolean(lockedAt)}>
          <RotateCcw className="size-4" />
          Randomize Order
        </Button>
        <Button type="button" variant="chrome" onClick={lockOrder} disabled={entries.length === 0 || Boolean(lockedAt)}>
          <LockKeyhole className="size-4" />
          Save and Lock Order
        </Button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.42fr_0.58fr]">
        <aside className="rounded-md border border-white/10 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">On the Clock</p>
          <p className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">{activeOwner?.name ?? "Lottery not locked"}</p>
          <p className="mt-1 text-sm text-chrome-300">{activeOwner ? `${activeOwner.gamertag} | Pick ${activeEntry?.pickNumber}` : "Add owners, randomize, and lock the order to begin."}</p>
          <div className="mt-4 grid gap-3">
            <select value={selectedTeamId} onChange={(event) => setSelectedTeamId(event.target.value)} disabled={!activeEntry} className="min-h-12 rounded-md border border-white/10 bg-black px-4 text-base font-bold text-white outline-none focus:border-electric disabled:opacity-50">
              <option value="">Select available team</option>
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>{team.fullName}</option>
              ))}
            </select>
            <Button type="button" variant="electric" onClick={recordSelection} disabled={!activeEntry || !selectedTeamId}>
              <Trophy className="size-4" />
              Record Selection
            </Button>
          </div>
          <p className="mt-3 text-xs leading-5 text-chrome-400">The panel prevents selection before a turn is active and removes already selected teams from the list.</p>
        </aside>

        <div className="grid gap-4">
          <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-electric">
              <Timer className="size-4" />
              Lottery Order
            </p>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {entries.length > 0 ? [...entries].sort((a, b) => a.pickNumber - b.pickNumber).map((entry) => {
                const owner = owners.find((item) => item.id === entry.ownerId);
                return (
                  <div key={entry.id} className="grid gap-2 rounded-md border border-white/10 bg-black/35 p-3 md:grid-cols-[auto_1fr_auto] md:items-center">
                    <span className="font-[var(--font-oswald)] text-2xl font-bold text-electric">#{entry.pickNumber}</span>
                    <div>
                      <p className="font-bold text-white">{owner?.name ?? "Owner"}</p>
                      <p className="text-sm text-chrome-400">{statusLabel(entry.status)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["waiting", "on_the_clock", "passed", "removed"] as LotteryEntryStatus[]).map((status) => (
                        <button key={status} type="button" disabled={!lockedAt && status === "on_the_clock"} onClick={() => updateEntryStatus(entry.id, status)} className="rounded border border-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-chrome-200 transition hover:border-electric/60 hover:text-white disabled:opacity-40">
                          {statusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }) : (
                <p className="rounded-md border border-white/10 bg-black/35 p-4 text-sm text-chrome-300">No owners have been added to the lottery pool yet.</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Teams Available for Lottery</p>
              <p className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase text-white">{availableTeams.length}</p>
              <p className="mt-2 text-sm leading-6 text-chrome-300">{teams.length} total teams. Selected teams are removed from availability.</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Season History Preview</p>
              <div className="mt-2 max-h-28 space-y-1 overflow-y-auto text-xs leading-5 text-chrome-300">
                {historyPreview.length ? historyPreview.map((item) => <p key={item}>{item}</p>) : <p>Selections will be preserved with owner, team, pick number, date, and time.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
