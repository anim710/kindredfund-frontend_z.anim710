export type Role = "Supporter" | "Creator" | "Admin";

export type CampaignCategory =
  | "Technology"
  | "Art"
  | "Community"
  | "Health"
  | "Education"
  | "Environment"
  | "Other";

export type CampaignStatus = "pending" | "approved" | "rejected" | "suspended";
export type ContributionStatus = "pending" | "approved" | "rejected" | "refunded";
export type WithdrawalStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "pending" | "success" | "failed";

export const CAMPAIGN_CATEGORIES: CampaignCategory[] = [
  "Technology",
  "Art",
  "Community",
  "Health",
  "Education",
  "Environment",
  "Other",
];

export const CREDIT_PACKAGES = ["100", "300", "800", "1500"] as const;
export type CreditPackageId = (typeof CREDIT_PACKAGES)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  credits: number;
  profilePicture: string;
  totalRaised: number;
  isActive?: boolean;
}

export interface Campaign {
  _id: string;
  title: string;
  story: string;
  category: CampaignCategory;
  fundingGoal: number;
  minimumContribution: number;
  deadline: string;
  rewardInfo: string;
  imageUrl: string;
  amountRaised: number;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  status: CampaignStatus;
  supporterCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contribution {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  supporterId: string;
  supporterEmail: string;
  supporterName: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  status: ContributionStatus;
  message?: string;
  date: string;
}

export interface Withdrawal {
  _id: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  credits: number;
  amount: number;
  paymentSystem: string;
  accountNumber: string;
  status: WithdrawalStatus;
  transactionId?: string;
  date: string;
}

export interface Notification {
  _id: string;
  message: string;
  toEmail: string;
  toUserId: string;
  actionRoute: string;
  isRead: boolean;
  type: string;
  date: string;
}

export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  credits: number;
  package: string;
  paymentMethod: string;
  transactionId: string;
  status: PaymentStatus;
  date: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiErrorBody {
  success: false;
  message: string;
}

export interface AuthPayload {
  token: string;
  refreshToken: string;
  user: User;
}
