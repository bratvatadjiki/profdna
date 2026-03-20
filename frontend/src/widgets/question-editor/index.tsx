'use client';

import { useMemo, useState } from 'react';
import type { Question, QuestionOption, QuestionType } from '@/entities/question/model';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const defaultOptions: QuestionOption[] = [
  { label: 'Вариант 1', value: 'option_1' },
  { label: 'Вариант 2', value: 'option_2' }
];

type Props = {
  questions: Question[];
  onCreate: (payload: Omit<Question, 'id'>) => Promise<void>;
};

export function QuestionEditor({ questions, onCreate }: Props) {
  const [text, setText] = useState('');
  const [type, setType] = useState<QuestionType>('single_choice');
  const [required, setRequired] = useState(true);
  const [placeholder, setPlaceholder] = useState('');
  const [optionsText, setOptionsText] = useState('Да\nНет');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextOrder = useMemo(() => questions.length + 1, [questions.length]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const options = ['single_choice', 'multiple_choice'].includes(type)
        ? optionsText
            .split('\n')
            .map((line, index) => line.trim())
            .filter(Boolean)
            .map((line, index) => ({ label: line, value: `option_${index + 1}` }))
        : type === 'scale'
          ? undefined
          : undefined;

      await onCreate({
        text,
        type,
        required,
        order: nextOrder,
        placeholder,
        section_title: 'Основная секция',
        options: options?.length ? options : type.includes('choice') ? defaultOptions : undefined,
        min_value: type === 'scale' ? 1 : null,
        max_value: type === 'scale' ? 5 : null
      });

      setText('');
      setPlaceholder('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось добавить вопрос');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-2">
      <Card>
        <div className="stack">
          <strong>Вопросы</strong>
          {questions.length ? questions.map((question) => (
            <div className="question-card" key={question.id}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{question.order}. {question.text}</strong>
                <span className="badge">{question.type}</span>
              </div>
              <div className="helper-text">{question.required ? 'Обязательный' : 'Необязательный'}</div>
            </div>
          )) : <div className="helper-text">Пока нет вопросов.</div>}
        </div>
      </Card>

      <Card>
        <form className="stack" onSubmit={handleCreate}>
          <strong>Добавить вопрос</strong>
          <Field label="Текст вопроса" error={!text && error ? 'Введите текст вопроса' : error || undefined}>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Например: Что вам нравится делать больше всего?" />
          </Field>
          <Field label="Тип вопроса">
            <Select value={type} onChange={(e) => setType(e.target.value as QuestionType)}>
              <option value="text">Короткий текст</option>
              <option value="textarea">Развернутый ответ</option>
              <option value="single_choice">Один вариант</option>
              <option value="multiple_choice">Несколько вариантов</option>
              <option value="scale">Шкала</option>
            </Select>
          </Field>
          <Field label="Подсказка">
            <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder="Текст внутри поля" />
          </Field>
          {(type === 'single_choice' || type === 'multiple_choice') ? (
            <Field label="Варианты ответа" hint="Каждый вариант с новой строки.">
              <Textarea value={optionsText} onChange={(e) => setOptionsText(e.target.value)} />
            </Field>
          ) : null}
          <label className="row" style={{ alignItems: 'center' }}>
            <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
            <span>Обязательный вопрос</span>
          </label>
          <Button type="submit" disabled={loading || !text}>{loading ? 'Сохраняем...' : 'Добавить вопрос'}</Button>
        </form>
      </Card>
    </div>
  );
}
