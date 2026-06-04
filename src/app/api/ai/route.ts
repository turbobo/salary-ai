import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const AI_MODEL = 'qwen-plus';

export async function POST(request: NextRequest) {
  const { systemPrompt, userPrompt, apiKey } = await request.json();

  const key = apiKey || process.env.DASHSCOPE_API_KEY;
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
  return NextResponse.json({ content: data.choices[0].message.content });
}
