"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function LoanSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="Search by user email or loan title..."
        className="pl-10 pr-4 py-6 text-lg"
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
