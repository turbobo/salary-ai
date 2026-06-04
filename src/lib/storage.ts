const STORAGE_KEY = 'salary_calculator_data';
const AI_STORAGE_KEY = 'salary_ai_api_key';

export function loadFromStorage(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

export function saveToStorage(data: Record<string, unknown>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

export function clearStorage(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export function loadApiKey(): string {
  try { return localStorage.getItem(AI_STORAGE_KEY) || ''; } catch { return ''; }
}

export function saveApiKey(key: string): void {
  try { localStorage.setItem(AI_STORAGE_KEY, key); } catch { /* ignore */ }
}
