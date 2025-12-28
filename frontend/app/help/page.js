export const metadata = {
  title: "Help Center | Rupantorii",
  description: "Guides, FAQs, and support information for Rupantorii customers."
};

export default function HelpPage() {
  return (
    <section className="section-pad space-y-10 py-12">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-pine">Help Center</p>
        <h1 className="text-4xl text-ink">Your Rupantorii shopping guide</h1>
        <p className="text-sm text-pine">
          Everything you need to browse, order, and receive your jewelry with confidence.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <h2 className="text-xl text-ink">How to Browse Products</h2>
          <ul className="space-y-2 text-sm text-pine">
            <li>Use the collection filters to narrow by category or price.</li>
            <li>Check product pages for sizes, materials, and stock alerts.</li>
            <li>View variants to compare finishes and pricing.</li>
          </ul>
        </div>
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <h2 className="text-xl text-ink">How to Order</h2>
          <ul className="space-y-2 text-sm text-pine">
            <li>Add items to your cart and proceed to checkout.</li>
            <li>Fill in delivery details or select a saved address.</li>
            <li>Cash on Delivery is currently supported.</li>
          </ul>
        </div>
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <h2 className="text-xl text-ink">Shipping & Delivery</h2>
          <ul className="space-y-2 text-sm text-pine">
            <li>Delivery areas: Mymensingh and major districts.</li>
            <li>Estimated delivery time: 2-4 business days.</li>
            <li>Shipping fees are confirmed at checkout.</li>
          </ul>
        </div>
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <h2 className="text-xl text-ink">Returns & Refunds</h2>
          <ul className="space-y-2 text-sm text-pine">
            <li>Returns accepted within 7 days of delivery.</li>
            <li>Items must be unused and in original packaging.</li>
            <li>Refunds are processed within 7-10 business days.</li>
          </ul>
        </div>
      </div>

      <div id="faq" className="space-y-4">
        <h2 className="text-2xl text-ink">FAQs</h2>
        <div className="space-y-3">
          {[
            {
              q: "Do I need an account to order?",
              a: "No, guest checkout is available. Create an account to save addresses and track orders."
            },
            {
              q: "How do I track my order?",
              a: "Use the Track Order page with your order number and phone."
            },
            {
              q: "Can I change my delivery address?",
              a: "Contact support within 24 hours to update delivery details."
            },
            {
              q: "Do you accept custom orders?",
              a: "Yes. Contact us via Facebook, Instagram, or WhatsApp for custom design requests."
            }
          ].map((item) => (
            <div key={item.q} className="rounded-3xl border border-mist bg-white/70 p-5">
              <p className="text-sm text-ink">{item.q}</p>
              <p className="mt-2 text-sm text-pine">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-mist bg-white/70 p-6 text-sm text-pine">
        <p className="text-xs uppercase tracking-[0.3em] text-ink">Need more help?</p>
        <p className="mt-2">
          Email us at rupantorii01@gmail.com or WhatsApp +880 1601 514337 during business hours.
        </p>
      </div>
    </section>
  );
}
