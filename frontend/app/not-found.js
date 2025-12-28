export const metadata = {
  title: "Page Not Found | Rupantorii",
  description: "The page you are looking for could not be found."
};

export default function NotFound() {
  return (
    <section className="section-pad flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-pine">404</p>
      <h1 className="text-3xl text-ink">We could not find that page.</h1>
      <p className="max-w-xl text-sm text-pine">Try exploring our collections or go back to the homepage.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href="/" className="btn-primary">Go Home</a>
        <a href="/products" className="btn-outline">Browse Collections</a>
      </div>
    </section>
  );
}
