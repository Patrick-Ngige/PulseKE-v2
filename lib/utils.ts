import { clsx, type ClassValue } from 'clsx';
export function cn(...inputs: ClassValue[]) { return clsx(inputs); }

export function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function extractJSON(text: string): any {
  try { return JSON.parse(text.trim()); } catch {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch {} }
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s !== -1 && e > s) { try { return JSON.parse(text.slice(s, e + 1)); } catch {} }
  return null;
}

export function fmtMs(ms: number | null | undefined): string {
  if (ms == null) return 'N/A';
  return ms >= 1000 ? (ms / 1000).toFixed(1) + 's' : Math.round(ms) + 'ms';
}

export function scoreColor(n: number): { bg: string; text: string; bar: string } {
  if (n >= 75) return { bg: 'bg-[var(--good-bg)]',  text: 'text-[var(--good)]',  bar: 'bg-[var(--good)]'  };
  if (n >= 50) return { bg: 'bg-[var(--warn-bg)]',  text: 'text-[var(--warn)]',  bar: 'bg-[var(--warn)]'  };
  return          { bg: 'bg-[var(--poor-bg)]',  text: 'text-[var(--poor)]',  bar: 'bg-[var(--poor)]'  };
}
