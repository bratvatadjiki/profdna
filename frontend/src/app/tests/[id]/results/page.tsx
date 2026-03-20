'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Loader } from '@/components/ui/loader';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SessionList } from '@/widgets/session-list';
import { api } from '@/lib/api';
import type { Session } from '@/entities/session/model';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

export default function TestResultsPage() {
  useAuthGuard();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.getSessions(params.id)
      .then(setSessions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [params.id]);

  return (
    <AppShell>
      <PageHeader title="Результаты" subtitle="Список клиентов и быстрый доступ к двум типам отчета." />
      {loading ? <Loader text="Загружаем результаты..." /> : null}
      {error ? <Card>{error}</Card> : null}
      {!loading && !error && !sessions.length ? (
        <EmptyState title="Пока нет прохождений" description="Отправьте ссылку клиенту и обновите страницу позже." />
      ) : null}
      {!loading && !!sessions.length ? (
        <SessionList
          sessions={sessions}
          onRefresh={load}
          onClientReport={(id) => router.push(`/report?sessionId=${id}&type=client`)}
          onPsychologistReport={(id) => router.push(`/report?sessionId=${id}&type=psychologist`)}
        />
      ) : null}
    </AppShell>
  );
}
