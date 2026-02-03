export type PlanId = "FREE" | "PRO" | "ULTRA" | "MAX";

export type Session = {
  userId: string;
};

export type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "PAST_DUE" | "CANCELED";
