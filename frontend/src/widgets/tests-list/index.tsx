'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TableWrap } from '@/components/tables/simple-table';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/shared/helpers/date';
import { copyText } from '@/shared/helpers/clipboard';
import type { TestSummary } from '@/entities/test/model';

export function TestsList() {
  const [items, setItems] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    api.getTests()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const copyLink = async (item: TestSummary) => {
    if (!item.public_token) return;
    const base = window.location.origin;
    await copyText(`${base}/run/${item.public_token}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) return <Loader text="Загружаем список опросников..." />;
  if (error) return <EmptyState title="Не удалось загрузить опросники" description={error} />;
  if (!items.length) return <EmptyState title="Пока нет опросников" description="Создайте первый тест и отправьте ссылку клиенту." />;

  return (
    <TableWrap>
      <table className="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Заполнили</th>
            <th>Последнее заполнение</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.title}</strong>
                <div className="helper-text">{item.description || 'Без описания'}</div>
              </td>
              <td>{item.sessions_count}</td>
              <td>{formatDate(item.last_session_at)}</td>
              <td>
                <div className="actions">
                  <Link href={`/tests/${item.id}`}><Button variant="secondary">Открыть</Button></Link>
                  <Link href={`/tests/${item.id}/builder`}><Button variant="ghost">Builder</Button></Link>
                  <Link href={`/tests/${item.id}/results`}><Button variant="ghost">Результаты</Button></Link>
                  <Button variant="primary" onClick={() => copyLink(item)} disabled={!item.public_token}>
                    {copiedId === item.id ? 'Скопировано' : 'Копировать ссылку'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}
