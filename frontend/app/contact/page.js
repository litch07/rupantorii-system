export const metadata = {
  title: "Contact Rupantorii",
  description: "Get in touch with Rupantorii support."
};

export default function ContactPage() {
  return (
    <section className="section-pad grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-pine">Contact</p>
          <h1 className="text-4xl text-ink">We are here to help.</h1>
          <p className="mt-3 text-sm text-pine">
            Share your questions or custom order requests. Our team responds within 1-2 business days.
          </p>
        </div>
        <form className="space-y-4 rounded-3xl border border-mist bg-white/70 p-6">
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Name</span>
            <input className="rounded-2xl border border-mist bg-white/80 px-4 py-3" placeholder="Your name" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Email</span>
            <input className="rounded-2xl border border-mist bg-white/80 px-4 py-3" placeholder="you@example.com" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Subject</span>
            <input className="rounded-2xl border border-mist bg-white/80 px-4 py-3" placeholder="Order question" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Message</span>
            <textarea
              className="min-h-[140px] rounded-2xl border border-mist bg-white/80 px-4 py-3"
              placeholder="How can we help?"
            />
          </label>
          <button type="button" className="btn-primary w-full">Send Message</button>
          <p className="text-xs text-pine">This form is informational for now. Email rupantorii01@gmail.com for help.</p>
        </form>
      </div>
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Customer Care</p>
          <p className="text-sm text-ink">rupantorii01@gmail.com</p>
          <p className="text-sm text-ink">WhatsApp: +880 1601 514337</p>
          <p className="text-sm text-pine">Sun-Thu, 10:00 - 18:00</p>
          <p className="text-xs text-pine">Custom orders: contact us on Facebook, Instagram, or WhatsApp.</p>
        </div>
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Social</p>
          <a className="text-sm text-ink hover:text-rose" href="https://www.facebook.com/efti.tasnuva">
            Facebook
          </a>
          <a className="text-sm text-ink hover:text-rose" href="https://www.instagram.com/ig_eftiiii_">
            Instagram
          </a>
          <a className="text-sm text-ink hover:text-rose" href="https://wa.me/8801601514337">
            WhatsApp
          </a>
        </div>
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Studio</p>
          <p className="text-sm text-ink">Ishwarganj</p>
          <p className="text-sm text-ink">Mymensingh</p>
          <p className="text-sm text-pine">Bangladesh</p>
        </div>
      </div>
    </section>
  );
}
