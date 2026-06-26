"use client";

import { GooeyInput } from "./ui/gooey-input";

export default function GooeySearch({
  query,
  setQuery,
  placeholder = "Search spinach, mango, paneer...",
}) {
  return (
    <div className="flex h-28 w-full items-center justify-center">
      <GooeyInput
        placeholder={placeholder}
        value={query}
        onValueChange={setQuery}
      />
    </div>
  );
}
