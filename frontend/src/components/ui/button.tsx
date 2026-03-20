import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/shared/helpers/cn';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

export function Button({ children, className, variant = 'primary', ...props }: Props) {
  return (
    <button className={cn('btn', `btn-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}
