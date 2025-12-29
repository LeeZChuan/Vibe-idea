export function toNumberOrZero(input: unknown): number {
  if (input === null || input === undefined) return 0
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0
  const n = Number(input)
  return Number.isFinite(n) ? n : 0
}


