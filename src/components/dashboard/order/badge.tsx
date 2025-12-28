import { Badge, BadgeColor } from "@/components/uikit/badge";
import { OrderStatus } from "@/types/orders/orderType";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  let color: BadgeColor;

  switch (status) {
    case "Pending":
    case "In Production":
      color = "orange";
      break;
    case "Ready for pickup":
    case "On the way":
      color = "blue";
      break;
    case "Cancelled":
    case "Requested":
      color = "gray";
      break;
    case "Completed":
      color = "green";
      break;
    case "Rejected":
      color = "red";
      break;
  }

  return <Badge text={status} variant={color} />;
}
