"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CAMPAIGN_CATEGORIES } from "@/shared/types";
import { Input, Select } from "@/shared/ui";

export function CampaignFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    router.push(`/campaigns?${next.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <Input
          placeholder="Search campaigns…"
          defaultValue={params.get("search") || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update("search", (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
      <div className="sm:w-56">
        <Select
          value={params.get("category") || ""}
          onChange={(e) => update("category", e.target.value)}
          options={[
            { value: "", label: "All categories" },
            ...CAMPAIGN_CATEGORIES.map((c) => ({ value: c, label: c })),
          ]}
        />
      </div>
    </div>
  );
}
