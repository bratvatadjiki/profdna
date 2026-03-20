export function ReportViewer({ html }: { html: string }) {
  return (
    <div className="report-html" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
