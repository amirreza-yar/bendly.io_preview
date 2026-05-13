import { ColorBadge } from "../ui/color-badge";

type OrderStatus =
  | "Pending"
  | "In Production"
  | "Ready for pickup"
  | "On the way"
  | "Cancelled"
  | "Requested"
  | "Completed"
  | "Rejected"
  | "Approved"
  | "Shipped";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "Pending":
    case "In Production":
      return (
        <ColorBadge variant="orange" className="capitalize">
          {status}
        </ColorBadge>
      );
    case "Approved":
      return (
        <ColorBadge variant="green" className="capitalize">
          {status}
        </ColorBadge>
      );
    case "Shipped":
      return (
        <ColorBadge variant="orange" className="capitalize">
          {status}
        </ColorBadge>
      );
    case "Ready for pickup":
    case "On the way":
      return (
        <ColorBadge variant="blue" className="capitalize">
          {status}
        </ColorBadge>
      );
    case "Cancelled":
    case "Requested":
      return (
        <ColorBadge variant="gray" className="capitalize">
          {status}
        </ColorBadge>
      );
    case "Completed":
      return (
        <ColorBadge variant="green" className="capitalize">
          {status}
        </ColorBadge>
      );
    case "Rejected":
      return (
        <ColorBadge variant="red" className="capitalize">
          {status}
        </ColorBadge>
      );
  }
}
