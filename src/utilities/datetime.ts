export function getDayAbbrString(
  dateString: string | number | undefined
): string | undefined {
  if (!dateString) return;
  const d = new Date(dateString);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return days[d.getDay()];
}

export function getDayMonthNumber(
  dateString: string | number | undefined
): string | undefined {
  if (!dateString) return;
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

export function getDayString(
  dateString: string | number | undefined
): string | undefined {
  if (!dateString) return;
  const d = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[d.getDay()];
}

export function formatPrettyDate(dateString: string) {
  const date = new Date(dateString);
  if (!date) return null; // because the universe loves invalid input

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getUTCDay()];
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${dayName} ${day} ${month}, ${year}`;
}

export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const amount = Math.floor(seconds / value);
    if (amount >= 1) {
      return `${amount} ${unit}${amount > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
