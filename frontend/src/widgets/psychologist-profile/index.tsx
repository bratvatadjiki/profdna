'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { buildQrUrl } from '@/lib/qr';
import { formatDate } from '@/shared/helpers/date';
import type { User } from '@/entities/user/model';

export function PsychologistProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch((e) => setError(e.message));
  }, []);

  if (error) return <Card>{error}</Card>;
  if (!profile) return <Loader text="Загружаем профиль..." />;

  const cardUrl = typeof window === 'undefined' ? '' : `${window.location.origin}/tests`;

  return (
    <div className="grid grid-2">
      <Card>
        <div className="stack">
          <div className="row" style={{ alignItems: 'center' }}>
            <img
              src={profile.photo_url || 'https://placehold.co/96x96'}
              alt={profile.full_name}
              width={96}
              height={96}
              style={{ borderRadius: 999 }}
            />
            <div>
              <h2 style={{ margin: 0 }}>{profile.full_name}</h2>
              <div className="helper-text">{profile.email}</div>
            </div>
          </div>
          <div>{profile.about || 'Краткое описание пока не заполнено.'}</div>
          <div className="helper-text">Доступ до: {formatDate(profile.access_until)}</div>
        </div>
      </Card>

      <Card>
        <div className="stack">
          <strong>Визитка / QR</strong>
          <div className="helper-text">Быстрый переход к кабинету и демонстрации продукта.</div>
          <img src={buildQrUrl(cardUrl)} alt="QR" width={160} height={160} />
        </div>
      </Card>
    </div>
  );
}
