export type SessionAccountDTO = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  verifiedEmail: boolean;
};

export type SessionStaffDTO = {
  avatar: string | null;
  isActive: boolean;
};

export type SessionCustomerUserDTO = {
  role: "customer";
  account: SessionAccountDTO;
};

export type SessionStaffUserDTO = {
  role: "staff";
  account: SessionAccountDTO;
  staff: SessionStaffDTO;
};

/** Browser-safe representation of an authenticated user. */
export type SessionUserDTO = SessionCustomerUserDTO | SessionStaffUserDTO;
