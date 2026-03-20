'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PsychologistProfile } from '@/widgets/psychologist-profile';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

export default function DashboardPage() {
  useAuthGuard();

  return (
    <AppShell>
      <PageHeader
        title="Кабинет"
        subtitle="Краткая информация о специалисте и быстрые действия."
        actions={<Link href="/tests"><Button>Открыть опросники</Button></Link>}
      />

      <div className="grid">
        <PsychologistProfile />
        <div className="grid grid-3">
          <Card><div className="kpi"><strong>1</strong><span>Демо тест готов</span></div></Card>
          <Card><div className="kpi"><strong>2</strong><span>Типа отчета</span></div></Card>
          <Card><div className="kpi"><strong>5 мин</strong><span>Путь до первого прохождения</span></div></Card>
        </div>
      </div>
    </AppShell>
  );
}
