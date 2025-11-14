export const formatDate = (utcString: Date | string, is24Hour: boolean = false) => {
  const date = new Date(utcString);
  
  // Format options
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short", // e.g., February
    day: "numeric",
    hour12: !is24Hour, // Switch between 12-hour and 24-hour formats
    timeZone: "Asia/Manila",
  };

  return date.toLocaleString("en-US", options);
};