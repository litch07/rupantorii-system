"use client";

export default function Error({ error, reset }) {
  return (
    <section className="section-pad flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-pine">Something went wrong</p>
      <h1 className="text-3xl text-ink">We are working on it.</h1>
      <p className="max-w-xl text-sm text-pine">
        {error?.message || "Please refresh the page or try again in a moment."}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="btn-primary" onClick={() => reset()}>
          Try Again
        </button>
        <a href="/" className="btn-outline">Go Home</a>
      </div>
    </section>
  );
}
