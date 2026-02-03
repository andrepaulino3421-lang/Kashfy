
import type { PlanId } from "@/lib/types";

const ORDER: Record<PlanId, number> = {
  FREE: 0,
  ESSENCIAL: 1,
  PLUS: 2,
  ULTRA: 3,
  MAX: 4
};

export function planGte(current: PlanId, required: PlanId): boolean {
  return ORDER[current] >= ORDER[required];
}

export function canUseAI(plan: PlanId): boolean {
  return plan === "ULTRA" || plan === "MAX";
}

export function canCreateTransaction(plan: PlanId): boolean {
  // Free is demo-only
  return planGte(plan, "ESSENCIAL");
}

export function canExportCsv(plan: PlanId): boolean {
  return planGte(plan, "ESSENCIAL");
}

export function canImportCsv(plan: PlanId): boolean {
  return planGte(plan, "PLUS");
}

export function canUseAdvancedReports(plan: PlanId): boolean {
  return planGte(plan, "ULTRA");
}
