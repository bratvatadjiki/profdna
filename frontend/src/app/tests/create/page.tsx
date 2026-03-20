'use client';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { CreateTestForm } from '@/features/create-test/create-test-form';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

export default function CreateTestPage() {
  useAuthGuard();

  return (
    <AppShell>
      <PageHeader title="Создать тест" subtitle="Минимальный шаг для первого рабочего flow." />
      <CreateTestForm />
    </AppShell>
  );
}
