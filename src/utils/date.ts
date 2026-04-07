const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDate(dateStr: string): boolean {
    if (!DATE_PATTERN.test(dateStr)) return false;
    const date = new Date(dateStr + "T00:00:00Z");
    if (isNaN(date.getTime())) return false;
    const [year, month, day] = dateStr.split("-").map(Number);
    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
}

export function parseDate(dateStr: string): Date {
    return new Date(dateStr + "T00:00:00Z");
}
