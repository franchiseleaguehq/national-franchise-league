import { NextResponse } from "next/server";

import { saveOwnerApplication } from "@/lib/db/applications";
import { getLeague } from "@/lib/db/repositories";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const requiredFields = ["fullName", "preferredDisplayName", "gamertag", "email", "timezone", "preferredTeamId", "maddenLeagueExperience", "availability", "bio", "whyJoin"];
  const missingFields = requiredFields.filter((field) => !readString(formData, field));
  const readOrientation = formData.get("readOrientation") === "on";
  const agreeRulebook = formData.get("agreeRulebook") === "on";

  if (missingFields.length > 0 || !readOrientation || !agreeRulebook) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please complete every required field, confirm you read the Rookie Orientation, and agree to the Official Rulebook.",
        missingFields,
      },
      { status: 400 },
    );
  }

  const league = getLeague();
  const application = await saveOwnerApplication({
    id: `application_${Date.now()}`,
    leagueId: league.id,
    fullName: readString(formData, "fullName"),
    preferredDisplayName: readString(formData, "preferredDisplayName"),
    gamertag: readString(formData, "gamertag"),
    email: readString(formData, "email"),
    phone: readString(formData, "phone") || undefined,
    timezone: readString(formData, "timezone"),
    preferredTeamId: readString(formData, "preferredTeamId") || undefined,
    teamPreferenceNotes: readString(formData, "teamPreferenceNotes"),
    backupTeamChoices: readString(formData, "backupTeamChoices"),
    maddenLeagueExperience: readString(formData, "maddenLeagueExperience"),
    availability: readString(formData, "availability"),
    youtubeUrl: readString(formData, "youtubeUrl") || undefined,
    twitchChannel: readString(formData, "twitchChannel") || undefined,
    instagramHandle: readString(formData, "instagramHandle") || undefined,
    preferredPlatform: (readString(formData, "preferredPlatform") || "None") as "YouTube" | "Twitch" | "None",
    whyJoin: readString(formData, "whyJoin"),
    bio: readString(formData, "bio") || undefined,
    readOrientation,
    agreeRulebook,
    status: "pending_commissioner_review",
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    applicationId: application.id,
    status: "Pending Commissioner Review",
    message: "Your application has been submitted and is awaiting commissioner approval.",
  });
}
