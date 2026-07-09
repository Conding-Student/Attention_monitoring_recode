export function toSqlDateTime(datetimeLocal: string): string {
  if (!datetimeLocal) return "";
  // Replace the "T" separator and append seconds if missing
  const withSpace = datetimeLocal.replace("T", " ");
  // datetime-local may omit seconds ("2025-06-01 14:30"), so pad them
  return withSpace.length === 16 ? `${withSpace}:00` : withSpace;
}
