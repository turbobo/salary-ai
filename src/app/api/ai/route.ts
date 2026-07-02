import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const AI_MODEL = 'qwen-plus';
const MAX_PROMPT_LENGTH = 10000;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { systemPrompt, userPrompt, apiKey } = body;

  if (typeof systemPrompt !== 'string' || typeof userPrompt !== 'string') {
    return NextResponse.json({ error: 'systemPrompt and userPrompt must be strings' }, { status: 400 });
  }

  if (systemPrompt.length > MAX_PROMPT_LENGTH || userPrompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json({ error: 'Prompt too long' }, { status: 400 });
  }

  const key = (typeof apiKey === 'string' ? apiKey : '') || process.env.DASHSCOPE_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 400 });
  }

  const response = await fetch(DASHSCOPE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    return NextResponse.json(
      { error: `DashScope API error: ${response.status} ${errText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'Unexpected response format from DashScope' }, { status: 502 });
  }
  return NextResponse.json({ content });
}
