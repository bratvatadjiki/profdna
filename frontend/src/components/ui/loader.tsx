export function Loader({ text = 'Загрузка...' }: { text?: string }) {
  return <div className="helper-text">{text}</div>;
}
