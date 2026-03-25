// "use client";

// import Link from "next/link";
// import BreadcrumbSection from "@/components/Breadcrumb";
// import { useCartStore } from "@/store/cartStore";

// export default function CartPage() {
//   const {
//     cart,
//     removeFromCart,
//     increaseQty,
//     decreaseQty,
//     clearCart,
//     getSubtotal,
//   } = useCartStore();

//   const subtotal = getSubtotal();
//   const discount = subtotal > 10000 ? 1000 : 0; // example discount
//   const consultationFee = cart.length > 0 ? 199 : 0; // optional extra charge
//   const total = subtotal - discount + consultationFee;

//   if (cart.length === 0) {
//     return (
//       <>
//         <BreadcrumbSection
//           title="Your Cart"
//           items={[{ label: "Cart" }]}
//         />

//         <section className="py-5">
//           <div className="container">
//             <div className="text-center py-5">
//               <div className="mb-4">
//                 <i className="bi bi-cart-x display-1 text-muted"></i>
//               </div>

//               <h2 className="fw-bold mb-3">Your cart is empty</h2>
//               <p className="text-muted mb-4">
//                 Looks like you haven’t added any treatments yet.
//               </p>

//               <div className="d-flex justify-content-center gap-3 flex-wrap">
//                 <Link href="/men" className="btn btn-dark rounded-pill px-4">
//                   Explore Men Treatments
//                 </Link>
//                 <Link href="/women" className="btn btn-outline-dark rounded-pill px-4">
//                   Explore Women Treatments
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       </>
//     );
//   }

//   return (
//     <>
//       <BreadcrumbSection
//         title="Your Cart"
//         items={[{ label: "Cart" }]}
//       />

//       <section className="py-5 bg-light">
//         <div className="container">
//           <div className="row g-4">
//             {/* Left Side - Cart Items */}
//             <div className="col-lg-8">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h3 className="fw-bold mb-0">Selected Treatments</h3>

//                 <button
//                   className="btn btn-sm btn-outline-danger rounded-pill"
//                   onClick={clearCart}
//                 >
//                   <i className="bi bi-trash3 me-2"></i>
//                   Clear Cart
//                 </button>
//               </div>

//               <div className="d-flex flex-column gap-4">
//                 {cart.map((item) => (
//                   <div
//                     key={item._id}
//                     className="card border-0 shadow-sm rounded-4 overflow-hidden"
//                   >
//                     <div className="row g-0 align-items-center">
//                       <div className="col-md-3">
//                         <img
//                           src={item.image || "/images/treatment-placeholder.jpg"}
//                           alt={item.title}
//                           className="img-fluid w-100 h-100"
//                           style={{
//                             objectFit: "cover",
//                             minHeight: "180px",
//                             maxHeight: "180px",
//                           }}
//                         />
//                       </div>

//                       <div className="col-md-9">
//                         <div className="card-body p-4">
//                           <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
//                             <div>
//                               <h5 className="fw-bold mb-2">{item.title}</h5>
//                               <p className="text-muted mb-2">
//                                 Premium clinic treatment package
//                               </p>
//                               <span className="fw-bold fs-5 text-dark">
//                                 ₹{item.price}
//                               </span>
//                             </div>

//                             <button
//                               className="btn btn-sm btn-outline-danger rounded-pill"
//                               onClick={() => removeFromCart(item._id)}
//                             >
//                               <i className="bi bi-x-lg me-1"></i>
//                               Remove
//                             </button>
//                           </div>

//                           <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
//                             {/* Quantity Controls */}
//                             <div className="d-flex align-items-center border rounded-pill overflow-hidden">
//                               <button
//                                 className="btn btn-light px-3 py-2 border-0"
//                                 onClick={() => decreaseQty(item._id)}
//                               >
//                                 <i className="bi bi-dash-lg"></i>
//                               </button>

//                               <span className="px-4 fw-semibold">
//                                 {item.quantity}
//                               </span>

//                               <button
//                                 className="btn btn-light px-3 py-2 border-0"
//                                 onClick={() => increaseQty(item._id)}
//                               >
//                                 <i className="bi bi-plus-lg"></i>
//                               </button>
//                             </div>

//                             {/* Item Total */}
//                             <div>
//                               <span className="text-muted me-2">Total:</span>
//                               <span className="fw-bold fs-5">
//                                 ₹{item.price * item.quantity}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Continue Shopping */}
//               <div className="mt-4">
//                 <Link href="/women" className="btn btn-outline-dark rounded-pill px-4 me-2">
//                   <i className="bi bi-arrow-left me-2"></i>
//                   Continue Shopping
//                 </Link>
//               </div>
//             </div>

//             {/* Right Side - Order Summary */}
//             <div className="col-lg-4">
//               <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: "100px" }}>
//                 <div className="card-body p-4">
//                   <h4 className="fw-bold mb-4">Order Summary</h4>

//                   <div className="d-flex justify-content-between mb-3">
//                     <span className="text-muted">Subtotal</span>
//                     <span className="fw-semibold">₹{subtotal}</span>
//                   </div>

//                   <div className="d-flex justify-content-between mb-3">
//                     <span className="text-muted">Discount</span>
//                     <span className="fw-semibold text-success">- ₹{discount}</span>
//                   </div>

//                   <div className="d-flex justify-content-between mb-3">
//                     <span className="text-muted">Consultation Fee</span>
//                     <span className="fw-semibold">₹{consultationFee}</span>
//                   </div>

//                   <hr />

//                   <div className="d-flex justify-content-between mb-4">
//                     <span className="fw-bold fs-5">Total</span>
//                     <span className="fw-bold fs-4 text-dark">₹{total}</span>
//                   </div>

//                   <Link
//                     href="/checkout"
//                     className="btn btn-dark w-100 rounded-pill py-3 fw-semibold"
//                   >
//                     Proceed to Checkout
//                   </Link>

//                   <p className="text-muted small mt-3 mb-0 text-center">
//                     Secure checkout for appointment booking & treatment confirmation.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const {
    cart,
    coupon,
    removeFromCart,
    increaseQty,
    decreaseQty,
    setCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getConsultationFee,
    getTotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const consultationFee = getConsultationFee();
  const total = getTotal();

  const handleApplyCoupon = async () => {
    try {
      setCouponMessage("");
      setCouponError("");

      if (!couponCode.trim()) {
        setCouponError("Please enter a coupon code");
        return;
      }

      if (subtotal <= 0) {
        setCouponError("Your cart is empty");
        return;
      }

      setCouponLoading(true);

      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid coupon");
      }

      setCoupon(data.coupon);
      setCouponMessage(data.message);
      setCouponCode("");
    } catch (error) {
      setCouponError(error.message || "Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <h1 className="fw-bold mb-4">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="mb-3">Your cart is empty</h4>
            <Link href="/" className="btn btn-dark rounded-pill px-4">
              Browse Treatments
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  {cart.map((item) => {
                    const itemId = item.treatmentId || item._id;
                    const qty = item.quantity || item.qty || 1;

                    return (
                      <div
                        key={itemId}
                        className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between border-bottom py-3 gap-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image || "/images/placeholder.jpg"}
                            alt={item.title}
                            className="rounded-3"
                            style={{
                              width: "90px",
                              height: "90px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <h5 className="mb-1 fw-semibold">{item.title}</h5>
                            <p className="mb-0 text-muted">₹{item.price}</p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm rounded-circle"
                            onClick={() => increaseQty(itemId)}
                          >
                            -
                          </button>

                          <span className="fw-semibold px-2">{qty}</span>

                          <button
                            className="btn btn-outline-secondary btn-sm rounded-circle"
                            onClick={() => decreaseQty(itemId)}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-end">
                          <div className="fw-bold mb-2">₹{item.price * qty}</div>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={() => removeFromCart(itemId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coupon Section */}
              <div className="card border-0 shadow-sm rounded-4 mt-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Have a Coupon?</h5>

                  {!coupon ? (
                    <>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                          className="btn btn-dark"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                        >
                          {couponLoading ? "Applying..." : "Apply"}
                        </button>
                      </div>

                      {couponMessage && (
                        <div className="alert alert-success mt-3 mb-0 rounded-3">
                          {couponMessage}
                        </div>
                      )}

                      {couponError && (
                        <div className="alert alert-danger mt-3 mb-0 rounded-3">
                          {couponError}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between bg-light rounded-4 p-3">
                      <div>
                        <div className="fw-semibold">Coupon Applied</div>
                        <div className="text-success">
                          {coupon.code}{" "}
                          {coupon.title ? `- ${coupon.title}` : ""}
                        </div>
                        <small className="text-muted">
                          Discount: ₹{coupon.discount}
                        </small>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill mt-3 mt-md-0"
                        onClick={removeCoupon}
                      >
                        Remove Coupon
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="col-lg-4">
              <div
                className="card border-0 shadow-sm rounded-4 sticky-top"
                style={{ top: "100px" }}
              >
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Order Summary</h4>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Consultation Fee</span>
                    <span>₹{consultationFee}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="btn btn-dark w-100 rounded-pill py-2"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}