"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatMoney } from "@/lib/money";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, setQuantity, clear } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800"
            >
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-medium hover:text-indigo-600 transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="font-semibold">
                    {formatMoney(item.price * item.quantity)}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-3 flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full block text-center py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={clear}
              className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
