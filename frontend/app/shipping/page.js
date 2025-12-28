export const metadata = {
  title: "Shipping Information | Rupantorii",
  description: "Learn about Rupantorii shipping and delivery details."
};

export default function ShippingPage() {
  return (
    <section className="section-pad space-y-8 py-12">
      <h1 className="text-4xl text-ink">Shipping Information</h1>
      <div className="space-y-4 text-sm text-pine">
        <p>We currently deliver across Mymensingh and select major districts in Bangladesh.</p>
        <p>Estimated delivery time is 2-4 business days after confirmation.</p>
        <p>Shipping fees are calculated at checkout based on location and order value.</p>
        <p>For special deliveries or gift packaging, contact rupantorii01@gmail.com.</p>
      </div>
    </section>
  );
}
