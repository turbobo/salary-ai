'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadApiKey, saveApiKey as persistApiKey } from '@/lib/storage';
import { callAI as callAIClient } from '@/lib/ai/client';

export function useAI() {
  const [apiKey, setApiKeyState] = useState('');

  useEffect(() => {
    setApiKeyState(loadApiKey());
  }, []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    persistApiKey(key);
  }, []);

  const callAI = useCallback(async (systemPrompt: string, userPrompt: string): Promise<string> => {
    return callAIClient(systemPrompt, userPrompt, apiKey || undefined);
  }, [apiKey]);

  return { apiKey, setApiKey, callAI };
}
