"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../lib/api";
import { useCart } from "../../contexts/CartContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(6, "Phone is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  notes: z.string().optional()
});

export default function CheckoutClient() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(checkoutSchema)
  });

  const onSubmit = async (data) => {
    if (!items.length) {
      return;
    }

    const payload = {
      ...data,
      paymentMethod: "cod",
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity
      }))
    };

    const response = await api.post("/api/orders", payload);
    clearCart();
    router.push(`/order-confirmation?order=${response.data.orderNumber}`);
  };

  return (
    <section className="section-pad grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <h1 className="text-3xl text-ink">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" error={errors.customerName?.message} {...register("customerName")} />
          <Input label="Phone" error={errors.customerPhone?.message} {...register("customerPhone")} />
          <Input label="Address" error={errors.address?.message} {...register("address")} />
          <Input label="City" error={errors.city?.message} {...register("city")} />
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Order Notes</span>
            <textarea
              className="min-h-[120px] rounded-2xl border border-mist bg-white/80 px-4 py-3 text-ink outline-none focus:border-rose"
              {...register("notes")}
            />
          </label>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Placing order..." : "Place Order"}
          </Button>
        </form>
      </div>
      <div className="glass-card h-fit rounded-3xl p-6">
        <h3 className="text-xl text-ink">Order Summary</h3>
        <p className="mt-3 text-sm text-pine">{items.length} items in cart</p>
        <p className="mt-1 text-xs text-pine">Cash on delivery · Delivery in 2-4 days</p>
      </div>
    </section>
  );
}
