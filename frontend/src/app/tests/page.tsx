'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { TestsList } from '@/widgets/tests-list';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

export default function TestsPage() {
  useAuthGuard();

  return (
    <AppShell>
      <PageHeader
        title="Мои опросники"
        subtitle="Список тестов, ссылки на прохождение и быстрые действия."
        actions={<Link href="/tests/create"><Button>Создать тест</Button></Link>}
      />
      <TestsList />
    </AppShell>
  );
}
