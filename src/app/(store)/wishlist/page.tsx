"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useAuth } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchWishlist();
  }, [user, router]);

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const addToCart = (product: any) => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0]?.url,
      quantity: 1,
    });
    alert("Added to cart!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl">
            <Heart className="text-pink-600 dark:text-pink-400 fill-pink-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Wishlist</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">Products you've saved for later</p>
          </div>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-12 rounded-[32px] border border-slate-100 dark:border-zinc-800 text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-slate-300 dark:text-zinc-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 dark:text-zinc-400 mb-6">Explore our products and save your favorites!</p>
          <Link 
            href="/"
            className="inline-flex px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src={product.images[0]?.url || "/placeholder.png"} 
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate flex-1 pr-4">{product.title}</h3>
                  <span className="font-black text-blue-600 dark:text-blue-400">{formatMoney(product.price)}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-500 mb-6 line-clamp-2">{product.description}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
