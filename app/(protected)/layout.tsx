
import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MobileBottomNav } from "@/components/app/MobileBottomNav";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  let session;
  try {
    session = await requireSession();
  } catch {
    redirect("/login");
  }

  const user = await getUserWithSubscription(session.userId);
  if (!user) redirect("/login");

  return (
    <>
      {children}
      <MobileBottomNav />
      <div style={{ height: 84 }} aria-hidden="true" />{/* space for bottom nav on mobile */}
    </>
  );
}
