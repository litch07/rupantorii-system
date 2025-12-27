"use client";

export default function VariantSelector({ variants, selectedId, onChange }) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.3em] text-pine">Select Variant</p>
      <div className="grid gap-2">
        {variants.map((variant) => (
          <button
            type="button"
            key={variant.id}
            onClick={() => onChange(variant)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
              selectedId === variant.id
                ? "border-rose bg-rose/10"
                : "border-mist bg-white/70 hover:border-rose"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-ink">{variant.sku}</span>
              <span className="text-xs text-pine">Stock: {variant.stock}</span>
            </div>
            <div className="mt-2 text-xs text-pine">
              {[variant.size, variant.color, variant.material].filter(Boolean).join(" · ")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
