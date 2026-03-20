import type { PropsWithChildren } from 'react';

export function TableWrap({ children }: PropsWithChildren) {
  return <div className="table-wrap">{children}</div>;
}
