export type Kind = {
  id: string;
  staffID: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Shutdown = {
  id: string;
  staffID: string;
  start: string;
  end: string;
  createdAt: Date;
  updatedAt: Date;
};
