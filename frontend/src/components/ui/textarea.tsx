import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/helpers/cn';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('textarea', props.className)} {...props} />;
}
