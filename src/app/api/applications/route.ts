import { NextResponse } from "next/server";

import { saveOwnerApplication } from "@/lib/db/applications";
import { getApplicationTeams, getLeague } from "@/lib/db/repositories";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const requiredFields = ["fullName", "gamertag", "email", "timezone", "preferredTeamId", "backupTeamChoices", "maddenLeagueExperience", "availability", "whyJoin"];
  const missingFields = requiredFields.filter((field) => !readString(formData, field));
  const readRules = formData.get("readRules") === "on";
  const teams = getApplicationTeams();
  const preferredTeamId = readString(formData, "preferredTeamId");

  if (missingFields.length > 0 || !readRules) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please complete every required field and confirm you read the Rookie Orientation and Official Rulebook.",
        missingFields,
      },
      { status: 400 },
    );
  }

  if (!teams.some((team) => team.id === preferredTeamId)) {
    return NextResponse.json({ ok: false, message: "Select a valid preferred team." }, { status: 400 });
  }

  const league = getLeague();
  const application = saveOwnerApplication({
    id: `application_${Date.now()}`,
    leagueId: league.id,
    fullName: readString(formData, "fullName"),
    gamertag: readString(formData, "gamertag"),
    email: readString(formData, "email"),
    phone: readString(formData, "phone") || undefined,
    timezone: readString(formData, "timezone"),
    preferredTeamId,
    backupTeamChoices: readString(formData, "backupTeamChoices"),
    maddenLeagueExperience: readString(formData, "maddenLeagueExperience"),
    availability: readString(formData, "availability"),
    youtubeUrl: readString(formData, "youtubeUrl") || undefined,
    twitchChannel: readString(formData, "twitchChannel") || undefined,
    kickUrl: readString(formData, "kickUrl") || undefined,
    whyJoin: readString(formData, "whyJoin"),
    readRules,
    status: "new",
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    applicationId: application.id,
    message: "Application received. The commissioner team can review it in the owner portal workflow.",
  });
}
