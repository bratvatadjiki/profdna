'use client';

import { TableWrap } from '@/components/tables/simple-table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/shared/helpers/date';
import type { Session } from '@/entities/session/model';

export function SessionList({
  sessions,
  onClientReport,
  onPsychologistReport,
  onRefresh
}: {
  sessions: Session[];
  onClientReport: (sessionId: number) => void;
  onPsychologistReport: (sessionId: number) => void;
  onRefresh: () => void;
}) {
  return (
    <TableWrap>
      <table className="table">
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Email</th>
            <th>Дата заполнения</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.client_name}</td>
              <td>{session.client_email || '—'}</td>
              <td>{formatDate(session.created_at)}</td>
              <td>
                <div className="actions">
                  <Button variant="secondary" onClick={() => onClientReport(session.id)}>Отчет для клиента</Button>
                  <Button variant="ghost" onClick={() => onPsychologistReport(session.id)}>Отчет для психолога</Button>
                  <Button variant="ghost" onClick={onRefresh}>Обновить</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}
