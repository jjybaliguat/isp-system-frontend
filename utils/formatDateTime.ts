export const formatDateTime = (utcString: string, is24Hour: boolean = false) => {
  if (!utcString) return "";

  const date = new Date(utcString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24Hour,
    timeZone: "UTC", // ⬅️ Ensures the output is in UTC, not local time
  };

  return date.toLocaleString("en-US", options);
};

export const formatLocalDateTime = (localString: string, is24Hour: boolean = false) => {
  if (!localString) return "";

  // Convert "YYYY-MM-DD HH:mm:ss" → "YYYY-MM-DDTHH:mm:ss" for Date parsing
  const isoLike = localString.replace(" ", "T");
  const date = new Date(isoLike);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24Hour,
  };

  // Display using system’s local time (don’t treat it as UTC)
  return date.toLocaleString("en-US", options);
};

