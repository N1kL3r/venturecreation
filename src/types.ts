export type Unit = "stamps" | "visits" | "referrals" | "purchases" | "kr" | "classes";

export interface Partner {
  id: string;
  name: string;
  category: string;
  icon: string;
  blurb: string;
  address: string;
  walkTime: string;
  hours: string;
}

export interface ChainLink {
  id: string;
  loopId: string;
  order: number;
  fromId: string;
  toId: string;
  earnLabel: string;
  goal: number;
  unit: Unit;
  rewardText: string;
}

export interface Loop {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  linkIds: string[];
  isCustom?: boolean;
}

export type LinkStatus = "progress" | "ready" | "redeemed";

export interface LinkState {
  current: number;
  status: LinkStatus;
  code?: string;
  redeemedAt?: number;
}
