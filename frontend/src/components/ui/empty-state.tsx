import { Card } from '@/components/ui/card';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <div className="stack">
        <strong>{title}</strong>
        <span className="helper-text">{description}</span>
      </div>
    </Card>
  );
}
