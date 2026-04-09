/**
 * Format a Date as YYYY-MM-DD (local time).
 * @param {Date} date
 * @returns {string}
 */
export function formatDateYmd(date) {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


