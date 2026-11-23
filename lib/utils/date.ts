/**
 * Format tanggal dalam zona waktu Asia/Jakarta (WIB)
 */
export function getJakartaDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Mendapatkan tanggal X hari yang lalu dalam zona waktu Asia/Jakarta (WIB)
 */
export function getJakartaDateDaysAgo(days: number): string {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return getJakartaDate(past);
}
