'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, type PublicTest, type SaveAnswerPayload } from '@/lib/api';
import { Loader } from '@/components/ui/loader';
import { Card } from '@/components/ui/card';
import { RunTestForm } from '@/features/run-test/run-test-form';

export default function PublicRunPage() {
  const params = useParams<{ token: string }>();
  const [test, setTest] = useState<PublicTest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getPublicTest(params.token).then(setTest).catch((e) => setError(e.message));
  }, [params.token]);

  const handleSubmit = async (payload: SaveAnswerPayload) => {
    await api.saveAnswer(params.token, payload);
  };

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: 24 }}>
      {error ? <Card>{error}</Card> : null}
      {!test && !error ? <Loader text="Загружаем тест..." /> : null}
      {test ? <RunTestForm test={test} token={params.token} onSubmit={handleSubmit} /> : null}
    </div>
  );
}
