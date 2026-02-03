
import { NextResponse } from "next/server";
import { getSession, getUserWithSubscription } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null, { status: 401 });

  const user = await getUserWithSubscription(session.userId);
  if (!user) return NextResponse.json(null, { status: 401 });

  const sub = user.subscription;
  return NextResponse.json({
    userId: user.id,
    email: user.email,
    planId: sub?.planId || "FREE",
    planName: sub?.planName || "FREE",
    status: sub?.status || "INACTIVE"
  });
}
