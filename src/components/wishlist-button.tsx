"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

export function WishlistButton({ 
  productId, 
  className 
}: { 
  productId: string; 
  className?: string;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetch("/api/wishlist")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setIsWishlisted(data.some((p: any) => p.id === productId));
          }
        })
        .catch(console.error);
    }
  }, [user, productId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isWishlisted) {
        await fetch("/api/wishlist", {
          method: "DELETE",
          body: JSON.stringify({ productId }),
        });
        setIsWishlisted(false);
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId }),
        });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-xl transition-all active:scale-90",
        isWishlisted 
          ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600" 
          : "bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-pink-600",
        className
      )}
    >
      <Heart size={20} className={cn(isWishlisted && "fill-pink-600")} />
    </button>
  );
}
