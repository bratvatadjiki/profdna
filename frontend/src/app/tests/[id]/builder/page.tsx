'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { api } from '@/lib/api';
import { QuestionEditor } from '@/widgets/question-editor';
import type { TestDetails } from '@/entities/test/model';
import type { Question } from '@/entities/question/model';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

export default function TestBuilderPage() {
  useAuthGuard();
  const params = useParams<{ id: string }>();
  const [test, setTest] = useState<TestDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => api.getTest(params.id).then(setTest).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, [params.id]);

  const handleCreate = async (payload: Omit<Question, 'id'>) => {
    await api.addQuestion(params.id, payload);
    await load();
  };

  return (
    <AppShell>
      <PageHeader title="Конструктор теста" subtitle="Сначала простой и понятный builder, потом polish." />
      {error ? <Card>{error}</Card> : null}
      {!test && !error ? <Loader text="Загружаем builder..." /> : null}
      {test ? <QuestionEditor questions={test.questions} onCreate={handleCreate} /> : null}
    </AppShell>
  );
}
