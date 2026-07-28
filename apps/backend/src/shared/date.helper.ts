export function now(): Date {
  return new Date();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setUTCMinutes(result.getUTCMinutes() + minutes);
  return result;
}

export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setUTCHours(23, 59, 59, 999);
  return result;
}

export function daysAgo(days: number): Date {
  return addDays(now(), -days);
}

/** "HH:mm" formatidagi ish vaqtini Date obyektidagi soat/daqiqa bilan solishtirish uchun */
export function parseTimeString(time: string): { hours: number; minutes: number } {
  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number.parseInt(hoursRaw ?? "0", 10);
  const minutes = Number.parseInt(minutesRaw ?? "0", 10);
  return { hours, minutes };
}
