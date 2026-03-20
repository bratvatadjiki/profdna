'use client';

import { useCallback, useState } from 'react';

export function useAsync<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => Promise<TResult>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: TArgs) => {
    setLoading(true);
    setError(null);
    try {
      return await fn(...args);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { execute, loading, error, setError };
}
