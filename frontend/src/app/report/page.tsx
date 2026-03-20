'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Loader } from '@/components/ui/loader';
import { Card } from '@/components/ui/card';
import { ReportViewer } from '@/widgets/report-viewer';
import { api } from '@/lib/api';
import type { Report, ReportType } from '@/entities/report/model';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

export default function ReportPage() {
  useAuthGuard();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const type = (searchParams.get('type') || 'client') as ReportType;
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    api.getReports(sessionId, type)
      .then((items) => setReport(items[0] || null))
      .catch((e) => setError(e.message));
  }, [sessionId, type]);

  return (
    <AppShell>
      <PageHeader title="HTML-отчет" subtitle={`Тип отчета: ${type === 'client' ? 'для клиента' : 'для психолога'}`} />
      {error ? <Card>{error}</Card> : null}
      {!report && !error ? <Loader text="Загружаем отчет..." /> : null}
      {report ? <ReportViewer html={report.html} /> : null}
    </AppShell>
  );
}
