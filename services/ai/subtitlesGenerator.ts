import { SubtitleWord } from '@/types';

const VIRAL_KEYWORDS = new Set([
  '99%', 'error', 'fracasan', 'truco', 'secreto', 'hack', 'viral', 'dinero', 'gratis',
  'nunca', 'siempre', 'revelación', 'algoritmo', '400%', '100%', '3', '2', '1', 'guarda',
  'ahora', 'impacto', 'peligro', 'atención', 'increíble', 'fácil', 'rápido', 'prohibido'
]);

export function generateWordTimings(scriptText: string, durationSec: number): SubtitleWord[] {
  const rawWords = scriptText.trim().split(/\s+/).filter(Boolean);
  if (rawWords.length === 0) return [];

  const startOffset = 0.2; // slight delay at start
  const availableDuration = Math.max(durationSec - 0.5, 2.0);
  const timePerWord = availableDuration / rawWords.length;

  return rawWords.map((word, index) => {
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').toLowerCase();
    const isHighlighted = VIRAL_KEYWORDS.has(cleanWord) || /^\d+%?$/.test(cleanWord);

    const start = parseFloat((startOffset + index * timePerWord).toFixed(2));
    const end = parseFloat((startOffset + (index + 1) * timePerWord).toFixed(2));

    return {
      text: word,
      start,
      end,
      highlight: isHighlighted,
    };
  });
}
