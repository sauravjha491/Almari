"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/cn";

export function CartLink() {
  const items = useCartStore((s) => s.items);

  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items],
  );

  return (
    <Link
      href="/cart"
      className={cn(
        "relative rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800",
        "hover:bg-slate-50",
      )}
    >
      Cart
      {count > 0 ? (
        <span
          className={cn(
            "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-semibold",
            "bg-[var(--almari-accent)] text-[var(--almari-accent-foreground)]",
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
