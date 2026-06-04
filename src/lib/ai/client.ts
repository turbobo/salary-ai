export async function callAI(systemPrompt: string, userPrompt: string, apiKey?: string): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userPrompt, apiKey }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AI request failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.content;
}
