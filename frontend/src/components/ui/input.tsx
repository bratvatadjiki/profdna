import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/helpers/cn';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('input', props.className)} {...props} />;
}
