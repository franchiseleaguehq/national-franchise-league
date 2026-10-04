import { NextResponse } from "next/server";

import { getCommissionerSession } from "@/lib/auth/session";
import { listRuntimeApplications, listStoredApplications, recordApplicationDecision } from "@/lib/db/applications";
import { saveOwnerRecord } from "@/lib/db/owners-store";
import { getLeague, getOwnerDirectoryAsync } from "@/lib/db/repositories";
import type { OwnerRecord } from "@/lib/db/schema";

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "owner"
  );
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCommissionerSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Commissioner sign-in required." }, { status: 401 });
  }

  const { id } = await params;
  const applications = [...listRuntimeApplications(), ...(await listStoredApplications())];
  const application = applications.find((item) => item.id === id);

  if (!application) {
    return NextResponse.json({ ok: false, message: "Application not found." }, { status: 404 });
  }

  if (application.status !== "pending_commissioner_review" && application.status !== "submitted") {
    return NextResponse.json({ ok: false, message: `Application is already ${application.status}.` }, { status: 409 });
  }

  if (!application.preferredTeamId) {
    return NextResponse.json({ ok: false, message: "Application has no team selected." }, { status: 400 });
  }

  const directory = await getOwnerDirectoryAsync();
  const claimed = directory.find((entry) => entry.team.id === application.preferredTeamId && entry.owner);
  if (claimed) {
    return NextResponse.json(
      { ok: false, message: `${claimed.team.fullName} is already claimed by ${claimed.owner?.name}.` },
      { status: 409 },
    );
  }

  const league = getLeague();
  const now = new Date().toISOString();
  const ownerId = `owner_${application.id.replace(/^application_/, "")}`;
  const alreadyExists = directory.some((entry) => entry.owner?.id === ownerId);
  if (alreadyExists) {
    await recordApplicationDecision(application.id, "approved", session.ownerId);
    return NextResponse.json({ ok: true, ownerId, alreadyExisted: true });
  }

  const owner: OwnerRecord = {
    id: ownerId,
    slug: `${slugify(application.preferredDisplayName)}-${ownerId.slice(-6)}`,
    leagueId: league.id,
    name: application.fullName,
    gamertag: application.gamertag,
    role: "owner",
    status: "active",
    teamId: application.preferredTeamId,
    teamSelectionStatus: "team_selected",
    pastTeamIds: [],
    discordHandle: "",
    bio: application.bio ?? "",
    timezone: application.timezone,
    gamingPlatform: application.gamingPlatform,
    preferredPlatform: application.preferredPlatform,
    twitchChannel: application.twitchChannel,
    youtubeUrl: application.youtubeUrl,
    seasonsPlayed: 0,
    careerRecord: "0-0",
    playoffRecord: "0-0",
    divisionTitles: 0,
    conferenceChampionships: 0,
    superBowlChampionships: 0,
    currentWinStreak: 0,
    gamesStreamed: 0,
    ownerSince: String(league.season),
    awards: [],
    achievementIds: [],
    hallOfFame: false,
    accessSuspended: false,
    joinedAt: now,
  };

  await saveOwnerRecord(owner);
  await recordApplicationDecision(application.id, "approved", session.ownerId);

  return NextResponse.json({ ok: true, ownerId: owner.id, teamId: owner.teamId });
}
