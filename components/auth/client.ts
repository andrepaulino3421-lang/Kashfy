
export type MeResponse = {
  userId: string;
  email: string;
  planId: "FREE" | "ESSENCIAL" | "PLUS" | "ULTRA" | "MAX";
  planName: string;
  status: string;
} | null;

export async function getMeClient(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
  if (!res.ok) return null;
  return (await res.json()) as MeResponse;
}
