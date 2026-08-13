import type { SessionAccountDTO, SessionStaffUserDTO, SessionUserDTO } from "$lib/dto";
import type { Staff, User } from "$lib/server/domain";

function toSessionAccountDTO(user: User): SessionAccountDTO {
  return {
    id: user.account.id,
    name: user.account.name,
    phoneNumber: user.account.phoneNumber,
    email: user.account.email,
    verifiedEmail: user.account.verifiedEmail,
  };
}

/** Maps a complete server-side user to the explicit subset safe to serialize to clients. */
export function toSessionUserDTO(user: Staff): SessionStaffUserDTO;
export function toSessionUserDTO(user: User): SessionUserDTO;
export function toSessionUserDTO(user: User): SessionUserDTO {
  const account = toSessionAccountDTO(user);

  if (user.role === "staff") {
    return {
      role: "staff",
      account,
      staff: {
        avatar: user.staff.avatar,
        isActive: user.staff.isActive,
      },
    };
  }

  return { role: "customer", account };
}
