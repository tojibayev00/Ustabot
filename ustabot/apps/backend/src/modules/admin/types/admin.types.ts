export interface AdminUserListItem {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  role: string;
  isBlocked: boolean;
  isWorker: boolean;
  createdAt: Date;
  lastSeenAt: Date;
}
