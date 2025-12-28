import Link from "next/link";

export const metadata = {
  title: "Order Confirmation | Rupantorii",
  description: "Your Rupantorii order has been placed successfully."
};

export default function OrderConfirmationPage({ searchParams }) {
  const orderNumber = searchParams?.order;

  return (
    <section className="section-pad flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-pine">Thank you</p>
      <h1 className="text-3xl text-ink">Your order has been placed.</h1>
      <p className="max-w-xl text-sm text-pine">
        {orderNumber
          ? `Order number ${orderNumber}. You can track delivery anytime from the Track Order page.`
          : "You can track delivery anytime from the Track Order page."}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/track-order" className="btn-primary">Track Order</Link>
        <Link href="/products" className="btn-outline">Continue Shopping</Link>
      </div>
    </section>
  );
}

