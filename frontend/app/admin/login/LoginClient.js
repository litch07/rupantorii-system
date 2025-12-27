"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { useAuth } from "../../../contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required")
});

export default function LoginClient() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    await login(data.email, data.password);
    router.replace("/admin/dashboard");
  };

  return (
    <div className="section-pad flex min-h-[70vh] items-center justify-center">
      <div className="glass-card w-full max-w-md rounded-3xl p-8">
        <h1 className="text-2xl text-ink">Admin Login</h1>
        <p className="mt-2 text-sm text-pine">Use the seeded admin credentials to sign in.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
