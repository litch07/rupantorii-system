"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { useAuth } from "../../../contexts/AuthContext";
import { getErrorMessage } from "../../../lib/helpers";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required")
});

export default function LoginClient() {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      await login(data.email, data.password);
      router.replace("/admin/dashboard");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to sign in."));
    }
  };

  return (
    <div className="section-pad flex min-h-[70vh] items-center justify-center">
      <div className="glass-card w-full max-w-md rounded-3xl p-8">
        <h1 className="text-2xl text-ink">Admin Login</h1>
        <p className="mt-2 text-sm text-pine">Sign in to manage products, orders, and customer support.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
          {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-xs uppercase tracking-[0.3em] text-pine">
          <span className="hover:text-rose">Forgot password?</span>
        </div>
      </div>
    </div>
  );
}

