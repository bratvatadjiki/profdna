import type { PropsWithChildren } from 'react';

export function Field({ label, hint, error, children }: PropsWithChildren<{ label: string; hint?: string; error?: string }>) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint ? <span className="helper-text">{hint}</span> : null}
      {error ? <span className="error-text">{error}</span> : null}
    </div>
  );
}
