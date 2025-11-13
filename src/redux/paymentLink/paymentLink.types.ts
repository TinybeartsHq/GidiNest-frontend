// Payment Link Types

export enum LinkType {
  GOAL = 'goal',
  EVENT = 'event',
}

export enum LinkStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface BankDetails {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface Contributor {
  id: string;
  contributor_name?: string;
  amount: number;
  timestamp: string;
  is_anonymous?: boolean;
}

export interface PaymentLink {
  id: string;
  token: string;
  link_type: LinkType;
  title: string;
  description?: string;
  target_amount?: number;
  amount_raised: number;
  contributors_count: number;
  bank_details: BankDetails;
  is_active: boolean;
  allow_anonymous: boolean;
  show_contributors: boolean;
  custom_message?: string;
  event_date?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  public_url?: string;
  qr_code?: string;
}

export interface PaymentLinkAnalytics {
  total_contributions: number;
  total_amount: number;
  average_contribution: number;
  recent_contributions: Contributor[];
  daily_stats?: Array<{
    date: string;
    amount: number;
    count: number;
  }>;
  top_contributors?: Contributor[];
}

export interface CreateGoalLinkRequest {
  title: string;
  description?: string;
  target_amount: number;
  allow_anonymous?: boolean;
  show_contributors?: boolean;
  custom_message?: string;
  expires_at?: string;
}

export interface CreateEventLinkRequest {
  title: string;
  description?: string;
  event_date: string;
  target_amount?: number;
  allow_anonymous?: boolean;
  show_contributors?: boolean;
  custom_message?: string;
}

export interface UpdatePaymentLinkRequest {
  title?: string;
  description?: string;
  target_amount?: number;
  is_active?: boolean;
  allow_anonymous?: boolean;
  show_contributors?: boolean;
  custom_message?: string;
}

export interface PaymentLinkState {
  paymentLinks: PaymentLink[];
  currentLink: PaymentLink | null;
  analytics: PaymentLinkAnalytics | null;
  loading: boolean;
  error: string | null;
  createLinkSuccess: boolean;
  updateLinkSuccess: boolean;
}
