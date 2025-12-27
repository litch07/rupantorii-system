export const metadata = {
  title: "Order Confirmation | Rupantorii",
  description: "Your Rupantorii order has been placed successfully."
};

export default function OrderConfirmationPage({ searchParams }) {
  const orderNumber = searchParams?.order;

  return (
    <section className="section-pad flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-pine">Thank you</p>
      <h1 className="text-3xl text-ink">Your order is confirmed.</h1>
      <p className="max-w-xl text-sm text-pine">
        {orderNumber
          ? `Order number ${orderNumber}. We will contact you shortly to confirm delivery.`
          : "We will contact you shortly to confirm delivery."}
      </p>
    </section>
  );
}
