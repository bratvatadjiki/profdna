'use client';

import { useMemo, useState } from 'react';
import type { PublicTest, SaveAnswerPayload } from '@/lib/api';
import type { Question } from '@/entities/question/model';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Field } from '@/components/forms/field';

function QuestionField({
  question,
  value,
  onChange
}: {
  question: Question;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
}) {
  if (question.type === 'text') {
    return <Input value={String(value || '')} placeholder={question.placeholder || ''} onChange={(e) => onChange(e.target.value)} />;
  }

  if (question.type === 'textarea') {
    return <Textarea value={String(value || '')} placeholder={question.placeholder || ''} onChange={(e) => onChange(e.target.value)} />;
  }

  if (question.type === 'scale') {
    const min = question.min_value || 1;
    const max = question.max_value || 5;
    return (
      <div className="row">
        {Array.from({ length: max - min + 1 }, (_, index) => min + index).map((num) => (
          <label key={num} className="question-card" style={{ minWidth: 48, textAlign: 'center' }}>
            <input type="radio" name={`q_${question.id}`} checked={Number(value) === num} onChange={() => onChange(num)} />
            <div>{num}</div>
          </label>
        ))}
      </div>
    );
  }

  if (question.type === 'single_choice') {
    return (
      <div className="stack">
        {question.options?.map((option) => (
          <label key={option.value} className="question-card">
            <input
              type="radio"
              name={`q_${question.id}`}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />{' '}
            {option.label}
          </label>
        ))}
      </div>
    );
  }

  const selected = Array.isArray(value) ? value : [];
  return (
    <div className="stack">
      {question.options?.map((option) => (
        <label key={option.value} className="question-card">
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={(e) => {
              if (e.target.checked) onChange([...selected, option.value]);
              else onChange(selected.filter((v) => v !== option.value));
            }}
          />{' '}
          {option.label}
        </label>
      ))}
    </div>
  );
}

export function RunTestForm({ test, token, onSubmit }: { test: PublicTest; token: string; onSubmit: (payload: SaveAnswerPayload) => Promise<void> }) {
  const [client, setClient] = useState({ full_name: '', email: '', phone: '' });
  const [answers, setAnswers] = useState<Record<number, string | string[] | number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const totalQuestions = test.questions.length;
  const answeredQuestions = useMemo(() => {
    return test.questions.filter((question) => {
      const value = answers[question.id];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== '';
    }).length;
  }, [answers, test.questions]);

  const progress = totalQuestions ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: SaveAnswerPayload = {
        client,
        answers: Object.entries(answers).map(([questionId, value]) => ({ question_id: Number(questionId), value }))
      };
      await onSubmit(payload);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось отправить ответы');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Card>
        <div className="stack">
          <strong>Спасибо!</strong>
          <div className="helper-text">Тест завершен. Специалист увидит ваши результаты в кабинете.</div>
        </div>
      </Card>
    );
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <Card>
        <div className="stack">
          <h1 style={{ margin: 0 }}>{test.title}</h1>
          <div className="helper-text">{test.description || 'Ответьте на несколько вопросов.'}</div>
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>Прогресс</strong>
              <span className="helper-text">Вопросов: {answeredQuestions} из {totalQuestions}</span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="stack">
          <strong>Данные клиента</strong>
          <Field label="ФИО" error={!client.full_name && error ? 'Укажите ФИО' : undefined}>
            <Input value={client.full_name} onChange={(e) => setClient((prev) => ({ ...prev, full_name: e.target.value }))} />
          </Field>
          <Field label="Email" error={!client.email && error ? 'Укажите email' : error || undefined}>
            <Input type="email" value={client.email} onChange={(e) => setClient((prev) => ({ ...prev, email: e.target.value }))} />
          </Field>
          <Field label="Телефон">
            <Input value={client.phone} onChange={(e) => setClient((prev) => ({ ...prev, phone: e.target.value }))} />
          </Field>
        </div>
      </Card>

      {test.questions.map((question, index) => (
        <Card key={question.id}>
          <div className="stack">
            <strong>{index + 1}. {question.text}</strong>
            <QuestionField question={question} value={answers[question.id]} onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))} />
          </div>
        </Card>
      ))}

      <Button type="submit" disabled={loading || !client.full_name || !client.email}>
        {loading ? 'Отправляем...' : 'Завершить тест'}
      </Button>
    </form>
  );
}
