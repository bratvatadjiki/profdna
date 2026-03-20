import { getToken, clearToken } from '@/lib/auth';
import type { User } from '@/entities/user/model';
import type { CreateTestPayload, TestDetails, TestSummary } from '@/entities/test/model';
import type { Session } from '@/entities/session/model';
import type { Report, ReportType } from '@/entities/report/model';
import type { Question } from '@/entities/question/model';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type RequestOptions = RequestInit & {
  isPublic?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!options.isPublic && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store'
  });

  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok) {
    const maybeJson = await response.json().catch(() => null);
    throw new Error(maybeJson?.detail || maybeJson?.message || 'Ошибка запроса');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type LoginResponse = { access_token: string; token_type?: string };
export type PublicTest = {
  id: number;
  title: string;
  description?: string | null;
  questions: Question[];
};

export type SaveAnswerPayload = {
  client: {
    full_name: string;
    email: string;
    phone?: string;
  };
  answers: Array<{
    question_id: number;
    value: string | string[] | number;
  }>;
};

export const api = {
  login(email: string, password: string) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      isPublic: true
    });
  },

  getProfile() {
    return request<User>('/users/me');
  },

  getTests() {
    return request<TestSummary[]>('/tests');
  },

  getTest(id: string | number) {
    return request<TestDetails>(`/tests/${id}`);
  },

  createTest(payload: CreateTestPayload) {
    return request<TestSummary>('/tests', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateTest(id: string | number, payload: Partial<CreateTestPayload>) {
    return request<TestSummary>(`/tests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  addQuestion(testId: string | number, payload: Omit<Question, 'id'>) {
    return request<Question>(`/tests/${testId}/questions`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getPublicTest(token: string) {
    return request<PublicTest>(`/public/tests/${token}`, { isPublic: true });
  },

  saveAnswer(token: string, payload: SaveAnswerPayload) {
    return request<{ ok: boolean; session_id?: number }>(`/public/tests/${token}/answers`, {
      method: 'POST',
      body: JSON.stringify(payload),
      isPublic: true
    });
  },

  getSessions(testId: string | number) {
    return request<Session[]>(`/tests/${testId}/sessions`);
  },

  getReports(sessionId: string | number, type?: ReportType) {
    const suffix = type ? `?type=${type}` : '';
    return request<Report[]>(`/sessions/${sessionId}/reports${suffix}`);
  }
};
