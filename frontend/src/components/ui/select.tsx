import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/helpers/cn';

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('select', props.className)} {...props} />;
}
