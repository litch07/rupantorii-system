import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Admin Orders | Rupantorii",
  description: "Track and update Rupantorii orders and fulfillment status."
};

export default function AdminOrdersPage() {
  return <OrdersClient />;
}
