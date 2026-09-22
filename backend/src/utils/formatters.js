/**
 * fmtWait(minutes) -> "45 min" / "2 h 5 min" / "1 d 3 h"
 * Turns a number of minutes into a short, readable waiting-time string.
 */
function fmtWait(minutes) {
  const min = Math.round(minutes);
  if (min < 60) return `${min} min`;

  const hours = Math.floor(min / 60);
  const remainingMin = min % 60;
  if (hours < 24) {
    return remainingMin ? `${hours} h ${remainingMin} min` : `${hours} h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours ? `${days} d ${remainingHours} h` : `${days} d`;
}

/**
 * fmtTime(ms) -> "21 Sep 2026, 14:35"
 * Turns a timestamp into a readable date and time string.
 */
function fmtTime(ms) {
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

module.exports = { fmtWait, fmtTime };