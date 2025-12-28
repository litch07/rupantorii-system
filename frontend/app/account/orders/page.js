import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "My Orders | Rupantorii",
  description: "Review your Rupantorii order history and details."
};

export default function OrdersPage() {
  return <OrdersClient />;
}
