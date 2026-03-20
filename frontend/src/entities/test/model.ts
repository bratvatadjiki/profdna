import type { Question } from '@/entities/question/model';

export type TestSummary = {
  id: number;
  title: string;
  description?: string | null;
  sessions_count: number;
  last_session_at?: string | null;
  public_token?: string | null;
  created_at?: string | null;
};

export type TestDetails = TestSummary & {
  questions: Question[];
};

export type CreateTestPayload = {
  title: string;
  description?: string;
};
