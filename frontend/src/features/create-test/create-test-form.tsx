'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Field } from '@/components/forms/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export function CreateTestForm() {
  const router = useRouter();
  const [title, setTitle] = useState('Демо-опросник профориентации');
  const [description, setDescription] = useState('Короткий тест для демонстрации пути клиента и отчета.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const test = await api.createTest({ title, description });
      router.push(`/tests/${test.id}/builder`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось создать тест');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form className="stack" onSubmit={onSubmit}>
        <Field label="Название" error={!title ? 'Название обязательно' : undefined}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название теста" />
        </Field>
        <Field label="Описание" error={error || undefined}>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Краткое описание" />
        </Field>
        <div className="actions">
          <Button type="submit" disabled={loading || !title}>{loading ? 'Создаем...' : 'Создать тест'}</Button>
        </div>
      </form>
    </Card>
  );
}
