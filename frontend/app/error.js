"use client";

export default function Error({ error, reset }) {
  return (
    <div className="section-pad flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl text-ink">Something went wrong.</h2>
      <p className="max-w-xl text-sm text-pine">{error?.message || "Please refresh or try again later."}</p>
      <button className="btn-primary" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
