"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      coupon: null,

      addToCart: (item) => {
        const cart = get().cart;

        const existing = cart.find(
          (cartItem) =>
            String(cartItem.treatmentId || cartItem._id) ===
            String(item.treatmentId || item._id)
        );

        if (existing) {
          const updatedCart = cart.map((cartItem) => {
            const cartId = String(cartItem.treatmentId || cartItem._id);
            const itemId = String(item.treatmentId || item._id);

            if (cartId === itemId) {
              return {
                ...cartItem,
                quantity: (cartItem.quantity || cartItem.qty || 1) + 1,
              };
            }

            return {
              ...cartItem,
              quantity: cartItem.quantity || cartItem.qty || 1,
            };
          });

          set({ cart: updatedCart });
        } else {
          set({
            cart: [
              ...cart.map((cartItem) => ({
                ...cartItem,
                quantity: cartItem.quantity || cartItem.qty || 1,
              })),
              {
                ...item,
                quantity: item.quantity || item.qty || 1,
              },
            ],
          });
        }
      },

      removeFromCart: (id) => {
        set({
          cart: get().cart.filter(
            (item) => String(item.treatmentId || item._id) !== String(id)
          ),
        });
      },

      increaseQty: (id) => {
        set({
          cart: get().cart.map((item) =>
            String(item.treatmentId || item._id) === String(id)
              ? {
                  ...item,
                  quantity: (item.quantity || item.qty || 1) + 1,
                }
              : {
                  ...item,
                  quantity: item.quantity || item.qty || 1,
                }
          ),
        });
      },

      decreaseQty: (id) => {
        set({
          cart: get()
            .cart
            .map((item) => {
              const qty = item.quantity || item.qty || 1;

              if (String(item.treatmentId || item._id) === String(id)) {
                return {
                  ...item,
                  quantity: qty - 1,
                };
              }

              return {
                ...item,
                quantity: qty,
              };
            })
            .filter((item) => item.quantity > 0),
        });
      },

      clearCart: () => set({ cart: [], coupon: null }),

      setCoupon: (couponData) => set({ coupon: couponData }),

      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        return get().cart.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
          0
        );
      },

      getDiscount: () => {
        return Number(get().coupon?.discount || 0);
      },

      getConsultationFee: () => {
        return get().cart.length > 0 ? 199 : 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const consultationFee = get().getConsultationFee();

        return subtotal - discount + consultationFee;
      },
    }),
    {
      name: "treatment-cart",
    }
  )
);
// "use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       cart: [],

//       addToCart: (item) => {
//         const itemId = item.treatmentId || item._id;

//         const existing = get().cart.find(
//           (cartItem) => (cartItem.treatmentId || cartItem._id) === itemId
//         );

//         if (existing) {
//           set({
//             cart: get().cart.map((cartItem) =>
//               (cartItem.treatmentId || cartItem._id) === itemId
//                 ? {
//                     ...cartItem,
//                     quantity: (cartItem.quantity || cartItem.qty || 1) + 1,
//                   }
//                 : {
//                     ...cartItem,
//                     quantity: cartItem.quantity || cartItem.qty || 1,
//                   }
//             ),
//           });
//         } else {
//           set({
//             cart: [
//               ...get().cart.map((cartItem) => ({
//                 ...cartItem,
//                 quantity: cartItem.quantity || cartItem.qty || 1,
//               })),
//               {
//                 _id: item._id || item.treatmentId,
//                 treatmentId: item.treatmentId || item._id,
//                 title: item.title,
//                 price: Number(item.price) || 0,
//                 image: item.image || "",
//                 quantity: 1,
//               },
//             ],
//           });
//         }
//       },

//       removeFromCart: (id) => {
//         set({
//           cart: get().cart.filter(
//             (item) => (item.treatmentId || item._id) !== id
//           ),
//         });
//       },

//       increaseQty: (id) => {
//         set({
//           cart: get().cart.map((item) =>
//             (item.treatmentId || item._id) === id
//               ? {
//                   ...item,
//                   quantity: (item.quantity || item.qty || 1) + 1,
//                 }
//               : {
//                   ...item,
//                   quantity: item.quantity || item.qty || 1,
//                 }
//           ),
//         });
//       },

//       decreaseQty: (id) => {
//         set({
//           cart: get().cart
//             .map((item) => {
//               const currentQty = item.quantity || item.qty || 1;

//               if ((item.treatmentId || item._id) === id) {
//                 return {
//                   ...item,
//                   quantity: currentQty - 1,
//                 };
//               }

//               return {
//                 ...item,
//                 quantity: currentQty,
//               };
//             })
//             .filter((item) => item.quantity > 0),
//         });
//       },

//       clearCart: () => set({ cart: [] }),

//       getSubtotal: () => {
//         return get().cart.reduce(
//           (total, item) =>
//             total + (Number(item.price) || 0) * (item.quantity || item.qty || 1),
//           0
//         );
//       },
//     }),
//     {
//       name: "siama-treatment-cart",
//     }
//   )
// );
// // "use client";

// // import { create } from "zustand";
// // import { persist } from "zustand/middleware";

// // export const useCartStore = create(
// //   persist(
// //     (set, get) => ({
// //       cart: [],

// //       addToCart: (item) => {
// //         const existing = get().cart.find(
// //           (cartItem) => cartItem.treatmentId === item.treatmentId
// //         );

// //         if (existing) {
// //           set({
// //             cart: get().cart.map((cartItem) =>
// //               cartItem.treatmentId === item.treatmentId
// //                 ? { ...cartItem, quantity: cartItem.quantity + 1 }
// //                 : cartItem
// //             ),
// //           });
// //         } else {
// //           set({
// //             cart: [...get().cart, { ...item, quantity: 1 }],
// //           });
// //         }
// //       },

// //       removeFromCart: (treatmentId) => {
// //         set({
// //           cart: get().cart.filter((item) => item.treatmentId !== treatmentId),
// //         });
// //       },

// //       increaseQty: (treatmentId) => {
// //         set({
// //           cart: get().cart.map((item) =>
// //             item.treatmentId === treatmentId
// //               ? { ...item, quantity: item.quantity + 1 }
// //               : item
// //           ),
// //         });
// //       },

// //       decreaseQty: (treatmentId) => {
// //         set({
// //           cart: get().cart.map((item) =>
// //             item.treatmentId === treatmentId
// //               ? { ...item, quantity: Math.max(1, item.quantity - 1) }
// //               : item
// //           ),
// //         });
// //       },

// //       clearCart: () => set({ cart: [] }),

// //       getSubtotal: () => {
// //         return get().cart.reduce(
// //           (total, item) => total + item.price * item.quantity,
// //           0
// //         );
// //       },
// //     }),
// //     {
// //       name: "siama-cart-storage",
// //     }
// //   )
// // );