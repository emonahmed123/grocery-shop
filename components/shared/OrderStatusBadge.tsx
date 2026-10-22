import { Badge } from "@/components/ui/badge";

// Capitalise whatever status the backend sends, e.g. "pending" -> "Pending".
const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

const OrderStatusBadge = ({ status }: { status: string }) => (
  <Badge variant={status === "delivered" ? "success" : "warning"}>{formatStatus(status)}</Badge>
);

export default OrderStatusBadge;
