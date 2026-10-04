import { NextResponse } from "next/server";

import { getCommissionerSession } from "@/lib/auth/session";
import { listRuntimeApplications, listStoredApplications, recordApplicationDecision } from "@/lib/db/applications";

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

  await recordApplicationDecision(application.id, "rejected", session.ownerId);

  return NextResponse.json({ ok: true, applicationId: application.id });
}
