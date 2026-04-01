export type StatusKey =
  | "unassigned"
  | "to_contact"
  | "contacted"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "not_delivered";

 export type StatusConfig = Record<
  StatusKey,
  { label: string; color: string }
>;