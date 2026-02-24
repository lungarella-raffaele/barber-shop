export type Data = AnonymousData | UsualData | StaffData;

export type AnonymousData = {
  who: "anonymous";
  name: string;
  email: string;
  date: string;
  hour: string;
  kinds: string[];
  staff: string;
  phone?: string;
};

export type UsualData = {
  who: "usual";
  date: string;
  hour: string;
  kinds: string[];
  staff: string;
};

export type StaffData = {
  who: "staff";
  name?: string;
  phone?: string;
  date: string;
  hour: string;
  kinds: string[];
  staff: string;
};

export type Tab = "date" | "kind" | "info";
