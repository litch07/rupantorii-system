export const metadata = {
  title: "About Rupantorii",
  description: "Learn about Rupantorii's mission and story."
};

export default function AboutPage() {
  return (
    <section className="section-pad space-y-10 py-12">
      <div className="glass-card relative overflow-hidden rounded-[48px] px-8 py-14 md:px-16">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-pine">Our Story</p>
          <h1 className="text-4xl text-ink">Rupantorii is a modern Bengali jewelry house.</h1>
          <p className="text-sm text-pine">
            We bring heritage-inspired pieces online with a focus on craftsmanship, ethical sourcing,
            and thoughtful design. Every collection celebrates rituals, reunions, and the everyday
            moments that deserve a little glow.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl text-ink">Mission</h2>
          <p className="text-sm text-pine">
            To make traditional Bengali jewelry accessible with a refined digital shopping
            experience, backed by transparent pricing and attentive customer care.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl text-ink">Vision</h2>
          <p className="text-sm text-pine">
            To become the trusted destination for handcrafted heirlooms, blending artistry with
            modern convenience for customers worldwide.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Design Studio", text: "Curated collections shaped by heritage, refined by detail." },
          { title: "Quality Promise", text: "Every piece is inspected for finish, comfort, and longevity." },
          { title: "Customer Care", text: "A local-first team with personalized guidance and support." }
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-pine">{item.title}</p>
            <p className="mt-3 text-sm text-ink">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl text-ink">Leadership</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Creative Director", role: "Design & Curation" },
            { name: "Operations Lead", role: "Fulfillment & Quality" },
            { name: "Customer Experience", role: "Support & Community" }
          ].map((member) => (
            <div key={member.name} className="rounded-3xl border border-mist bg-white/70 p-5">
              <p className="text-sm text-ink">{member.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-pine">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
