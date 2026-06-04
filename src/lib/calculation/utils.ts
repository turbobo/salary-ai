export function roundToFen(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatCurrency(n: number): string {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function parseNumericInput(value: string | null | undefined): number | null {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}
