export type User = {
  id: number;
  full_name: string;
  email: string;
  photo_url?: string | null;
  about?: string | null;
  access_until?: string | null;
};
