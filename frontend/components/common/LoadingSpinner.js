export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-pine">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose border-t-transparent" />
      {label}
    </div>
  );
}
