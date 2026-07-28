export function isValidUzbekPhone(input: string): boolean {
  const digitsOnly = input.replace(/\D/g, "");
  const normalized = digitsOnly.startsWith("998") ? digitsOnly : `998${digitsOnly}`;
  return /^998\d{9}$/.test(normalized);
}

export function normalizePhone(input: string): string {
  const digitsOnly = input.replace(/\D/g, "");
  return digitsOnly.startsWith("998") ? `+${digitsOnly}` : `+998${digitsOnly}`;
}
