"use client";

import { useCartStore } from "@/store/cartStore";

export default function CartCount() {
  const cart = useCartStore((state) => state.cart);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs text-white">
      {count}
    </span>
  );
}