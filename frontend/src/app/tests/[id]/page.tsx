'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { api } from '@/lib/api';
import { PublishLinkCard } from '@/features/publish-link/publish-link-card';
import { formatDate } from '@/shared/helpers/date';
import type { TestDetails } from '@/entities/test/model';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

export default function TestDetailsPage() {
  useAuthGuard();
  const params = useParams<{ id: string }>();
  const [test, setTest] = useState<TestDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getTest(params.id).then(setTest).catch((e) => setError(e.message));
  }, [params.id]);

  return (
    <AppShell>
      <PageHeader
        title={test?.title || 'Тест'}
        subtitle="Основная информация по опроснику, ссылке и наполнению."
        actions={
          <>
            <Link href={`/tests/${params.id}/builder`}><Button variant="secondary">Builder</Button></Link>
            <Link href={`/tests/${params.id}/results`}><Button>Результаты</Button></Link>
          </>
        }
      />

      {error ? <Card>{error}</Card> : null}
      {!test && !error ? <Loader text="Загружаем тест..." /> : null}

      {test ? (
        <div className="grid">
          <div className="grid grid-3">
            <Card><div className="kpi"><strong>{test.sessions_count}</strong><span>Заполнений</span></div></Card>
            <Card><div className="kpi"><strong>{test.questions.length}</strong><span>Вопросов</span></div></Card>
            <Card><div className="kpi"><strong>{formatDate(test.created_at)}</strong><span>Создан</span></div></Card>
          </div>

          <Card>
            <div className="stack">
              <strong>Описание</strong>
              <div>{test.description || 'Описание пока не добавлено.'}</div>
            </div>
          </Card>

          <PublishLinkCard token={test.public_token} />
        </div>
      ) : null}
    </AppShell>
  );
}
