"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useCartStore, type CartItem } from "@/stores/cart-store";

export function AddToCartButton({
  item,
  className,
}: {
  item: Omit<CartItem, "quantity">;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <button
      type="button"
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-semibold",
        "bg-[var(--almari-primary)] text-[var(--almari-primary-foreground)] hover:opacity-95",
        className,
      )}
      onClick={() => {
        addItem(item, 1);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 900);
      }}
    >
      {justAdded ? "Added" : "Add to cart"}
    </button>
  );
}
