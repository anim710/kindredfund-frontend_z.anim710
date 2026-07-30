"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@/shared/ui";
import { useAuth } from "@/modules/auth/AuthProvider";
import { GoogleLoginButton } from "@/modules/auth/GoogleLoginButton";

const schema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/\d/, "Need a number")
    .regex(/[A-Z]/, "Need an uppercase letter")
    .regex(/[a-z]/, "Need a lowercase letter")
    .regex(/[!@#$%^&*(),.?\":{}|<>]/, "Need a special character"),
  role: z.enum(["Supporter", "Creator"]),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { setUser, refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Supporter" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Registration failed");
      return;
    }
    setUser(data.user);
    await refresh();
    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Select
        label="I want to join as"
        options={[
          { value: "Supporter", label: "Supporter (50 starter credits)" },
          { value: "Creator", label: "Creator (20 starter credits)" },
        ]}
        error={errors.role?.message}
        {...register("role")}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create account"}
      </Button>
      <GoogleLoginButton />
      <p className="text-center text-sm text-[var(--ink-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--accent)] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
