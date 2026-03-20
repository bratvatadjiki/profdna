export type ReportType = 'client' | 'psychologist';

export type Report = {
  id: number;
  session_id: number;
  type: ReportType;
  html: string;
  created_at: string;
};
