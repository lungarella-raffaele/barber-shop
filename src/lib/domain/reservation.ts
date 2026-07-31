import type { DateValue, Time } from "@internationalized/date";

export type Reservation = {
  id: string;
  date: string;
  hour: string;
  name: string;
  email: string;
  pending: boolean;
  expiresAt: Date;
  staff: {
    id: string;
    name: string;
  };
  kinds: {
    id: string;
    duration: number;
    name: string;
    price: number;
  }[];
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type BookingResult = {
  id: string;
  pending: boolean;
  accessToken?: string;
};

export type ReservationTableRow = {
  id: string;
  date: string;
  hour: string;
  name: string;
  email: string;
  kindNames: string[];
  duration: number;
  price: number;
};

export type ReservedSlot = {
  date: DateValue;
  start: Time;
  duration: Time;
};

export type Slot = {
  start: Time;
  available: boolean;
  invalid: boolean;
  past: boolean;
};

export type ShutdownPeriod = {
  id: string;
  staffID: string;
  start: string;
  end: string;
};
