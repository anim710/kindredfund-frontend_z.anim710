"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CAMPAIGN_CATEGORIES } from "@/shared/types";
import { Button, Input, Select, TextArea } from "@/shared/ui";
import { clientApi } from "@/shared/lib/api/browser";

const schema = z.object({
  title: z.string().min(5).max(100),
  story: z.string().min(20).max(5000),
  category: z.enum([
    "Technology",
    "Art",
    "Community",
    "Health",
    "Education",
    "Environment",
    "Other",
  ]),
  fundingGoal: z.string().min(1).transform(Number).pipe(z.number().min(1).max(9999999)),
  minimumContribution: z.string().min(1).transform(Number).pipe(z.number().min(1)),
  deadline: z.string().min(1),
  rewardInfo: z.string().min(5),
  imageUrl: z.string().url(),
});

type FormValues = z.input<typeof schema>;
type SubmitValues = z.output<typeof schema>;

export default function NewCampaignPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, SubmitValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "Community",
      fundingGoal: "1000",
      minimumContribution: "10",
      imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const deadline = new Date(values.deadline).toISOString();
      const res = await clientApi.post<{ campaign: { _id: string } }>("/campaigns", {
        ...values,
        deadline,
      });
      router.push(`/campaigns/${res.campaign._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create campaign");
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Create campaign</h1>
      <p className="text-[var(--ink-muted)]">Submitted campaigns start as pending until an admin approves them.</p>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <Input label="Title" error={errors.title?.message} {...register("title")} />
        <TextArea label="Story" error={errors.story?.message} {...register("story")} />
        <Select
          label="Category"
          options={CAMPAIGN_CATEGORIES.map((c) => ({ value: c, label: c }))}
          error={errors.category?.message}
          {...register("category")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Funding goal (credits)" type="number" error={errors.fundingGoal?.message} {...register("fundingGoal")} />
          <Input label="Minimum contribution" type="number" error={errors.minimumContribution?.message} {...register("minimumContribution")} />
        </div>
        <Input label="Deadline" type="date" error={errors.deadline?.message} {...register("deadline")} />
        <TextArea label="Reward info" error={errors.rewardInfo?.message} {...register("rewardInfo")} />
        <Input label="Image URL" error={errors.imageUrl?.message} {...register("imageUrl")} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit for review"}
        </Button>
      </form>
    </div>
  );
}
