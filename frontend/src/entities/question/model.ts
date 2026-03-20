export type QuestionType = 'text' | 'textarea' | 'single_choice' | 'multiple_choice' | 'scale';

export type QuestionOption = {
  id?: number;
  label: string;
  value: string;
};

export type Question = {
  id: number;
  text: string;
  type: QuestionType;
  required: boolean;
  order: number;
  section_title?: string | null;
  options?: QuestionOption[];
  min_value?: number | null;
  max_value?: number | null;
  placeholder?: string | null;
};
