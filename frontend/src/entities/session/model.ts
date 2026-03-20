export type Session = {
  id: number;
  client_name: string;
  client_email?: string | null;
  created_at: string;
  status?: string;
};
