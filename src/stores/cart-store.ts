"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((it) => it.productId === item.productId);
          if (!existing) {
            return { items: [...state.items, { ...item, quantity }] };
          }
          return {
            items: state.items.map((it) =>
              it.productId === item.productId
                ? { ...it, quantity: it.quantity + quantity }
                : it,
            ),
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((it) => it.productId !== productId),
        }));
      },
      setQuantity: (productId, quantity) => {
        const normalizedQuantity = Number.isFinite(quantity)
          ? Math.max(1, Math.floor(quantity))
          : 1;
        set((state) => ({
          items: state.items.map((it) =>
            it.productId === productId ? { ...it, quantity: normalizedQuantity } : it,
          ),
        }));
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "almari-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
