"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function TreatmentCard({ treatment }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="border rounded-xl p-4 shadow-sm">
      <Image
        src={treatment.image || "/placeholder.jpg"}
        alt={treatment.title}
        width={400}
        height={250}
        className="w-full h-52 object-cover rounded-lg"
      />

      <h3 className="text-xl font-semibold mt-4">{treatment.title}</h3>
      <p className="text-gray-600 text-sm mt-2">{treatment.shortDescription}</p>

      <div className="mt-3 flex items-center justify-between">
        <div>
          {treatment.salePrice > 0 ? (
            <>
              <span className="text-lg font-bold text-pink-600">
                ₹{treatment.salePrice}
              </span>
              <span className="text-sm text-gray-400 line-through ml-2">
                ₹{treatment.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">₹{treatment.price}</span>
          )}
        </div>

        <button
          onClick={() =>
            addToCart({
              _id: treatment._id,
              title: treatment.title,
              price: treatment.salePrice > 0 ? treatment.salePrice : treatment.price,
              image: treatment.image,
            })
          }
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}