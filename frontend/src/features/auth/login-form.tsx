'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { Field } from '@/components/forms/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('psychologist@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await api.login(email, password);
      setToken(result.access_token);
      router.push('/tests');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-card">
      <form className="stack" onSubmit={onSubmit}>
        <img src="/logo.svg" alt="ProfDNA" width={120} height={32} />
        <div>
          <h1 className="page-title" style={{ fontSize: 28 }}>Вход</h1>
          <p className="page-subtitle">Кабинет психолога и профориентолога.</p>
        </div>

        <Field label="Email" error={undefined}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </Field>

        <Field label="Пароль" error={error || undefined}>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" />
        </Field>

        <Button type="submit" disabled={loading}>{loading ? 'Входим...' : 'Войти'}</Button>
      </form>
    </Card>
  );
}
