const UNIT_TO_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24
};

/**
 * "15m", "30d", "1h" kabi JWT expiresIn formatidagi satrlarni soniyaga o'giradi.
 * Redis TTL va boshqa joylarda soniya kerak bo'lgan hollarda ishlatiladi.
 */
export function parseDurationToSeconds(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration.trim());

  if (!match) {
    throw new Error(`Noto'g'ri muddat formati: ${duration}`);
  }

  const [, value, unit] = match;
  const multiplier = UNIT_TO_SECONDS[unit as string];

  return Number.parseInt(value as string, 10) * (multiplier ?? 1);
}
