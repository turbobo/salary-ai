export function parseAIJson(rawResponse: string): Record<string, unknown> | null {
  try { return JSON.parse(rawResponse); } catch { /* ignore */ }
  const match = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    try { return JSON.parse(match[1].trim()); } catch { /* ignore */ }
  }
  const braceMatch = rawResponse.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]); } catch { /* ignore */ }
  }
  return null;
}

export function simpleMarkdown(text: string): string {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><(h[123]|ul|ol|blockquote)/g, '<$1');
  html = html.replace(/<\/(h[123]|ul|ol|blockquote)><\/p>/g, '</$1>');
  html = html.replace(/<p><\/p>/g, '');
  return html;
}
