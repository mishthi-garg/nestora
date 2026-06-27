"use client";

import { GooeyInput } from "./ui/gooey-input";
import { useMediaQuery } from "react-responsive";

export default function GooeySearch({
  query,
  setQuery,
  placeholder = "Search spinach, mango, paneer...",
}) {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <div className="flex h-28 w-full items-center justify-center">
      <GooeyInput
        placeholder={placeholder}
        value={query}
        onValueChange={setQuery}
        collapsedWidth={isMobile ? 220 : 280}
        expandedWidth={isMobile ? 300 : 500}
      />
    </div>
  );
}
