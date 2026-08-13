import type { StaffRow, UserRow } from "$lib/server/db/schema";
import type { Account, StaffProfile, User } from "$lib/server/domain";

function toAccount(row: UserRow): Account {
  return {
    id: row.id,
    name: row.name,
    phoneNumber: row.phoneNumber,
    email: row.email,
    passwordHash: row.passwordHash,
    verifiedEmail: row.verifiedEmail,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toStaffProfile(row: StaffRow): StaffProfile {
  return {
    avatar: row.avatar,
    avatarOriginal: row.avatarOriginal,
    avatarOffsetX: row.avatarOffsetX,
    avatarOffsetY: row.avatarOffsetY,
    avatarDisplayScale: row.avatarDisplayScale,
    isActive: row.isActive,
  };
}

export function toUserDomain(accountRow: UserRow, staffRow: StaffRow | null): User {
  const account = toAccount(accountRow);
  if (!staffRow) return { role: "customer", account };

  return {
    role: "staff",
    account,
    staff: toStaffProfile(staffRow),
  };
}
