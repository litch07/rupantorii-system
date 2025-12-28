"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../lib/api";
import customerApi from "../../lib/customerApi";
import { useCart } from "../../contexts/CartContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { getErrorMessage } from "../../lib/helpers";

const checkoutSchema = z
  .object({
    customerName: z.string().min(2, "Name is required"),
    customerPhone: z.string().min(6, "Phone is required"),
    customerEmail: z.string().email("Email is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    notes: z.string().optional()
  })
  .refine((data) => data.customerEmail, { message: "Email is required", path: ["customerEmail"] });

export default function CheckoutClient() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { isAuthenticated, user } = useCustomerAuth();
  const [confirmation, setConfirmation] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(checkoutSchema)
  });

  useEffect(() => {
    const loadAddresses = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await customerApi.get("/api/account/addresses");
        const data = response.data.data || [];
        setAddresses(data);
        const defaultAddress = data.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
          setValue("customerName", defaultAddress.recipientName);
          setValue("customerPhone", defaultAddress.phone);
          setValue("address", defaultAddress.addressLine);
          setValue("city", defaultAddress.city);
        } else if (user) {
          if (user.name) {
            setValue("customerName", user.name);
          }
          if (user.phone) {
            setValue("customerPhone", user.phone);
          }
        }
        if (user?.email) {
          setValue("customerEmail", user.email);
        }
      } catch {
        setAddresses([]);
      }
    };
    loadAddresses();
  }, [isAuthenticated, setValue, user]);

  const handleAddressSelect = (event) => {
    const addressId = event.target.value;
    setSelectedAddress(addressId);
    const selected = addresses.find((addr) => addr.id === addressId);
    if (selected) {
      setValue("customerName", selected.recipientName);
      setValue("customerPhone", selected.phone);
      setValue("address", selected.addressLine);
      setValue("city", selected.city);
    }
  };

  const onSubmit = async (data) => {
    if (!items.length) {
      return;
    }

    const payload = {
      ...data,
      paymentMethod: "cod",
      addressId: selectedAddress || undefined,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity
      }))
    };

    try {
      setSubmitError("");
      const client = isAuthenticated ? customerApi : api;
      const response = await client.post("/api/orders", payload);
      clearCart();
      setConfirmation("Order placed. Redirecting to confirmation...");
      setTimeout(() => {
        router.push(`/order-confirmation?order=${response.data.orderNumber}`);
      }, 1000);
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Unable to place order."));
    }
  };

  return (
    <section className="section-pad grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <h1 className="text-3xl text-ink">Checkout</h1>
        {isAuthenticated ? (
          <div className="rounded-3xl border border-mist bg-white/70 p-4 text-sm text-pine">
            <p className="text-xs uppercase tracking-[0.3em] text-ink">Saved Address</p>
            <select
              value={selectedAddress}
              onChange={handleAddressSelect}
              className="mt-2 w-full rounded-2xl border border-mist bg-white/80 px-4 py-3"
            >
              <option value="">Select saved address</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.label || addr.addressLine}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="rounded-3xl border border-mist bg-white/70 p-4 text-sm text-pine">
            <p className="text-xs uppercase tracking-[0.3em] text-ink">Faster Checkout</p>
            <p className="mt-2">Save multiple addresses by creating an account.</p>
            <Link href="/account/login" className="mt-3 inline-flex text-xs uppercase tracking-[0.3em] text-rose">
              Sign in to use saved addresses
            </Link>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" error={errors.customerName?.message} {...register("customerName")} />
          <Input label="Phone" error={errors.customerPhone?.message} {...register("customerPhone")} />
          <Input
            label="Email"
            error={errors.customerEmail?.message}
            {...register("customerEmail")}
            readOnly={isAuthenticated}
          />
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
          {confirmation ? (
            <p className="text-xs uppercase tracking-[0.3em] text-pine">{confirmation}</p>
          ) : null}
          {submitError ? <p className="text-sm text-rose">{submitError}</p> : null}
        </form>
      </div>
      <div className="glass-card h-fit rounded-3xl p-6">
        <h3 className="text-xl text-ink">Order Summary</h3>
        <p className="mt-3 text-sm text-pine">{items.length} items in cart</p>
        <p className="mt-1 text-xs text-pine">Cash on delivery - Delivery in 2-4 days</p>
      </div>
    </section>
  );
}

