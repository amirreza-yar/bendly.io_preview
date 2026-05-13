import { Flashing } from "@/types/api";

export function formatDate(dateStr: string | number): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getTotalQuantity(flashing: Flashing): number {
  const specQty = flashing?.specifications.reduce(
    (sum: number, spec: any) => sum + spec.quantity,
    0,
  );
  return specQty;
}

export function formatDateTime(dateStr: string | number): string {
  const date = new Date(dateStr);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate}   |  ${formattedTime}`;
}

export function formatDateWithDay(input: string | number): string {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    return "Invalid date format. Use YYYY-MM-DD.";
  }

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthsShort = [
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

  const day = String(date.getDate()).padStart(2, "0");
  const month = monthsShort[date.getMonth()];

  const weekday = weekdays[date.getDay()];

  return `${weekday}, ${day} ${month}`;
}

export function groupByFlashing(requestPieces: any): Flashing[] {
  const grouped: Record<string, Flashing> = {};

  for (const piece of requestPieces) {
    const {
      flashingId,
      material,
      color,
      thickness,
      totalGirth,
      pieceId,
      quantity,
      length,
      cost,
    } = piece;

    if (!grouped[flashingId]) {
      grouped[flashingId] = {
        // @ts-expect-error Its ok
        flashingId,
        material,
        color,
        thickness,
        totalGirth,
        code: "FL-A1", // default or fetched value
        position: "A1",
        crushfold: false,
        tapered: false,
        sepcifications: [],
      };
    }

    // grouped[flashingId].sepcifications.push({
    //   id,
    //   quantity,
    //   length,
    //   cost,
    // })
  }

  return Object.values(grouped);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatStatus(status: any, type: any) {
  const map: any = {
    pending: "Pending",
    in_progress: "In Production",
    ready: type === "delivery" ? "In Transit" : "Ready for pickup",
    cancelled: "Cancelled",
    completed: "Completed",
    rejected: "Rejected",
    approved: "Approved",
    shipped: "Shipped",
  };

  return map[status] || status;
}
