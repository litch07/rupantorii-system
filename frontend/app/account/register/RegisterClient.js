"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { useCustomerAuth } from "../../../contexts/CustomerAuthContext";
import { getErrorMessage } from "../../../lib/helpers";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  addressLine: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional(),
  label: z.string().optional()
});

export default function RegisterClient() {
  const router = useRouter();
  const { register: registerUser } = useCustomerAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      await registerUser(data);
      router.replace("/account");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to create account."));
    }
  };

  return (
    <div className="section-pad flex min-h-[70vh] items-center justify-center">
      <div className="glass-card w-full max-w-md rounded-3xl p-8">
        <h1 className="text-2xl text-ink">Create Account</h1>
        <p className="mt-2 text-sm text-pine">Create your Rupantorii profile for faster checkout.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full Name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" error={errors.email?.message} {...register("email")} />
          <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
          <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
          <Input label="Address Line" error={errors.addressLine?.message} {...register("addressLine")} />
          <Input label="City" error={errors.city?.message} {...register("city")} />
          <Input label="Postal Code" error={errors.postalCode?.message} {...register("postalCode")} />
          <Input label="Address Label" error={errors.label?.message} {...register("label")} />
          {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-6 flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-pine">
          <Link href="/account/login" className="hover:text-rose">Already have an account</Link>
          <Link href="/admin/login" className="hover:text-rose">Admin login</Link>
        </div>
      </div>
    </div>
  );
}
