// Application-level enums as lowercase strings (shared with backend)

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export const UserRole = {
  USER: "user",
  ADMIN: "admin",
} as const;

export const OpportunityType = {
  FULLTIME: "fulltime",
  PARTTIME: "parttime",
  FREELANCE: "freelance",
  CONTRACT: "contract",
  REMOTE: "remote",
  INTERNSHIP: "internship",
  ENTREPRENEURSHIP: "entrepreneurship",
  VOLUNTEER: "volunteer",
  SCHOLARSHIP: "scholarship",
  FELLOWSHIP: "fellowship",
  GRANT: "grant",
} as const;

export const OpportunityStatus = {
  PUBLISHED: "published",
  DRAFT: "draft",
  REVIEWED: "reviewed",
  ARCHIVED: "archived",
} as const;

export const DraftStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const DraftPriority = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export const MessageSender = {
  USER: "user",
  BOT: "bot",
} as const;

export const TokenType = {
  EMAIL_VERIFICATION: "email_verification",
  PASSWORD_RESET: "password_reset",
} as const;

export const ApplicationStatus = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  REVIEWED: "reviewed",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export const CrawlSourceStatus = {
  ACTIVE: "active",
  PAUSED: "paused",
  DISABLED: "disabled",
} as const;

export const CrawlFrequency = {
  HOURLY: "hourly",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

export const CrawlStatus = {
  PENDING: "pending",
  RUNNING: "running",
  SUCCESS: "success",
  FAILED: "failed",
} as const;

// Type exports for TypeScript
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type OpportunityTypeType =
  (typeof OpportunityType)[keyof typeof OpportunityType];
export type OpportunityStatusType =
  (typeof OpportunityStatus)[keyof typeof OpportunityStatus];
export type DraftStatusType = (typeof DraftStatus)[keyof typeof DraftStatus];
export type DraftPriorityType =
  (typeof DraftPriority)[keyof typeof DraftPriority];
export type MessageSenderType =
  (typeof MessageSender)[keyof typeof MessageSender];
export type TokenTypeType = (typeof TokenType)[keyof typeof TokenType];
export type ApplicationStatusType =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
export type CrawlSourceStatusType =
  (typeof CrawlSourceStatus)[keyof typeof CrawlSourceStatus];
export type CrawlFrequencyType =
  (typeof CrawlFrequency)[keyof typeof CrawlFrequency];
export type CrawlStatusType = (typeof CrawlStatus)[keyof typeof CrawlStatus];

// Helper functions to validate enum values
export function isValidUserStatus(value: string): value is UserStatusType {
  return Object.values(UserStatus).includes(value as UserStatusType);
}

export function isValidOpportunityType(
  value: string
): value is OpportunityTypeType {
  return Object.values(OpportunityType).includes(value as OpportunityTypeType);
}

export function isValidDraftStatus(value: string): value is DraftStatusType {
  return Object.values(DraftStatus).includes(value as DraftStatusType);
}

export function isValidApplicationStatus(
  value: string
): value is ApplicationStatusType {
  return Object.values(ApplicationStatus).includes(
    value as ApplicationStatusType
  );
}

export function isValidCrawlStatus(value: string): value is CrawlStatusType {
  return Object.values(CrawlStatus).includes(value as CrawlStatusType);
}

// Categories
export const DEFAULT_CATEGORIES = [
  "Technology",
  "Healthcare",
  "Business",
  "Education",
  "Research",
  "Arts",
  "Social",
  "General",
];

export const UI_CATEGORIES = DEFAULT_CATEGORIES.map((cat) => ({
  value: cat.toLowerCase(),
  label: cat,
}));

// UI-specific constants
export const UI_OPPORTUNITY_TYPES = [
  { value: OpportunityType.FULLTIME, label: "Full Time" },
  { value: OpportunityType.PARTTIME, label: "Part Time" },
  { value: OpportunityType.FREELANCE, label: "Freelance" },
  { value: OpportunityType.CONTRACT, label: "Contract" },
  { value: OpportunityType.REMOTE, label: "Remote" },
  { value: OpportunityType.INTERNSHIP, label: "Internship" },
  { value: OpportunityType.ENTREPRENEURSHIP, label: "Entrepreneurship" },
  { value: OpportunityType.VOLUNTEER, label: "Volunteer" },
  { value: OpportunityType.SCHOLARSHIP, label: "Scholarship" },
  { value: OpportunityType.FELLOWSHIP, label: "Fellowship" },
  { value: OpportunityType.GRANT, label: "Grant" },
];

export const UI_DRAFT_PRIORITIES = [
  { value: DraftPriority.HIGH, label: "High" },
  { value: DraftPriority.MEDIUM, label: "Medium" },
  { value: DraftPriority.LOW, label: "Low" },
];

export const UI_USER_STATUSES = [
  { value: UserStatus.ACTIVE, label: "Active" },
  { value: UserStatus.INACTIVE, label: "Inactive" },
  { value: UserStatus.SUSPENDED, label: "Suspended" },
];

export const UI_CRAWL_FREQUENCIES = [
  { value: CrawlFrequency.HOURLY, label: "Hourly" },
  { value: CrawlFrequency.DAILY, label: "Daily" },
  { value: CrawlFrequency.WEEKLY, label: "Weekly" },
  { value: CrawlFrequency.MONTHLY, label: "Monthly" },
];
