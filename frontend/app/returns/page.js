export const metadata = {
  title: "Return Policy | Rupantorii",
  description: "Return and refund guidelines for Rupantorii customers."
};

export default function ReturnsPage() {
  return (
    <section className="section-pad space-y-8 py-12">
      <h1 className="text-4xl text-ink">Return Policy</h1>
      <div className="space-y-4 text-sm text-pine">
        <p>Returns are accepted within 7 days of delivery for unused items in original packaging.</p>
      <p>To request a return, email rupantorii01@gmail.com with your order number.</p>
        <p>Refunds are processed within 7-10 business days after inspection.</p>
        <p>Custom or personalized items are non-returnable unless damaged.</p>
      </div>
    </section>
  );
}
