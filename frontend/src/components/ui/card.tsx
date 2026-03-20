import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/shared/helpers/cn';

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  );
}
