'use client';

export function Progress({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="progress" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100} role="progressbar">
      <span style={{ width: `${safeValue}%` }} />
    </div>
  );
}
