'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { copyText } from '@/shared/helpers/clipboard';

export function PublishLinkCard({ token }: { token?: string | null }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window === 'undefined' || !token ? '' : `${window.location.origin}/run/${token}`;

  const onCopy = async () => {
    if (!url) return;
    await copyText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card>
      <div className="stack">
        <strong>Ссылка для клиента</strong>
        <div className="helper-text">Отправьте клиенту прямую ссылку на прохождение теста.</div>
        <input className="input" readOnly value={url || 'Публичная ссылка пока не готова'} />
        <div className="actions">
          <Button onClick={onCopy} disabled={!token}>{copied ? 'Скопировано' : 'Копировать ссылку'}</Button>
          {url ? <a href={url} target="_blank"><Button variant="ghost">Открыть</Button></a> : null}
        </div>
      </div>
    </Card>
  );
}
