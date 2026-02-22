export function generateToken(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString());
  } catch (error) {
    return null;
  }
}

export function generateId(): number {
  return Math.floor(Math.random() * 100000);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}
