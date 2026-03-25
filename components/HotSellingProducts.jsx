"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const products = [
  {
    id: 1,
    name: "Skin Treatment",
    category: "Footwear",
    image: "/img/SkinTreatment.jpg",
    price: "₹2,499",
    oldPrice: "₹3,499",
    rating: 4.5,
    badge: "Hot",
    badgeClass: "hot",
  },
  {
    id: 2,
    name: "Advanced Laser Facial",
    category: "Accessories",
    image: "/img/AdvancedLaserFacial.jpg",
    price: "₹4,999",
    oldPrice: "₹6,299",
    rating: 4.8,
    badge: "-20%",
    badgeClass: "sale",
  },
  {
    id: 3,
    name: "PRP Treatment",
    category: "Electronics",
    image: "/img/PRPTreatment.jpg",
    price: "₹1,899",
    oldPrice: "₹2,799",
    rating: 4.6,
    badge: "Best Seller",
    badgeClass: "best",
  },
  {
    id: 4,
    name: "Hair Treatment",
    category: "Bags",
    image: "/img/HairTreatment.jpg",
    price: "₹1,299",
    oldPrice: "₹1,999",
    rating: 4.4,
    badge: "New",
    badgeClass: "new",
  },
  {
    id: 5,
    name: "Hydra Facial",
    category: "Skin Care",
    image: "/img/HydraFacial.jpg",
    price: "₹3,299",
    oldPrice: "₹4,199",
    rating: 4.7,
    badge: "Popular",
    badgeClass: "hot",
  },
   {
    id:6,
    name: "Veneers",
    category: "Teeth Care",
    image: "/img/Veneers.jpg",
    price: "₹3,299",
    oldPrice: "₹4,199",
    rating: 4.7,
    badge: "Popular",
    badgeClass: "hot",
  },
    
   {
    id:7,
    name: "Aligner Treatment",
    category: "Teeth Care",
    image: "/img/AlignerTreatment.jpg",
    price: "₹3,299",
    oldPrice: "₹4,199",
    rating: 4.7,
    badge: "Popular",
    badgeClass: "hot",
  },
    
  
];

export default function HotSellingProducts() {
  return (
    <section className="hot-selling-products py-5">
      <div className="container">
        {/* Section Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 mb-md-5">
          <div>
            {/* <span className="section-subtitle">Trending Now</span> */}
            <h2 className="section-title mb-0"> Our Most Loved Beauty Treatments
 </h2>
          </div>
          <a href="#" className="view-all-btn mt-3 mt-md-0">
          Get all of your treatments here →
          </a>
        </div>

        {/* Swiper Slider */}
        <div className="product-slider-wrap position-relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={products.length > 4}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".hot-products-next",
              prevEl: ".hot-products-prev",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.1,
                spaceBetween: 16,
              },
              576: {
                slidesPerView: 1.4,
                spaceBetween: 18,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 22,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="hot-products-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-card">
                  <div className="product-thumb">
                    {/* Uncomment if you want badge */}
                    {/* <span className={`product-badge ${product.badgeClass}`}>
                      {product.badge}
                    </span> */}

                    <img src={product.image} alt={product.name} />

                    {/* Uncomment if you want actions */}
                    {/* <div className="product-actions">
                      <button type="button" aria-label="Wishlist">❤</button>
                      <button type="button" aria-label="Quick View">👁</button>
                      <button type="button" aria-label="Compare">⇄</button>
                    </div> */}
                  </div>

                  <div className="product-content">
                    {/* <span className="product-category">{product.category}</span> */}

                    <h5 className="product-title text-center">
                      <a href="#">{product.name}</a>
                    </h5>

                    {/* <div className="product-rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-text">({product.rating})</span>
                    </div> */}

                    {/* <div className="product-price">
                      <span className="new-price">{product.price}</span>
                      <span className="old-price">{product.oldPrice}</span>
                    </div> */}

                    {/* <button className="cart-btn">View More</button> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <button className="slider-nav hot-products-prev" aria-label="Previous">
           <span>‹</span> 
          </button>
          <button className="slider-nav hot-products-next" aria-label="Next">
            <span>›</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .hot-selling-products {
          background: linear-gradient(180deg, #fffaf5 0%, #ffffff 100%);
          overflow: hidden;
        }

        .section-subtitle {
          display: inline-block;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #000;
          background: rgba(16, 16, 16, 0.1);
          padding: 6px 12px;
          border-radius: 50px;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #111827;
          line-height: 1.2;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 24px 0;
          background: #111827;
          color: #fff;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          background: #000;
          color: #fff;
        }

        .product-slider-wrap {
          position: relative;
          padding: 10px 0px;
        }

        .hot-products-swiper {
          overflow: visible;
        }

        .product-card {
          background: #fff;
          border-radius: 24px 0;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(17, 24, 39, 0.08);
          transition: all 0.35s ease;
          height: 100%;
          border: 1px solid #f3f4f6;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 40px rgba(17, 24, 39, 0.12);
        }

        .product-thumb {
          position: relative;
          background: #f8fafc;
          overflow: hidden;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          display: block;
        }

        .product-card:hover .product-thumb img {
          transform: scale(1.08);
        }

        .product-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 2;
          padding: 7px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .product-badge.hot {
          background: linear-gradient(135deg, #ff7a18, #ff4d4f);
        }

        .product-badge.sale {
          background: linear-gradient(135deg, #16a34a, #22c55e);
        }

        .product-badge.best {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
        }

        .product-badge.new {
          background: linear-gradient(135deg, #0284c7, #0ea5e9);
        }

        .product-actions {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.35s ease;
        }

        .product-card:hover .product-actions {
          opacity: 1;
          transform: translateX(0);
        }

        .product-actions button {
          width: 42px;
          height: 42px;
          border: none;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          font-size: 16px;
          border-radius: 24px 0;
          transition: all 0.3s ease;
        }
 
        .product-actions button:hover {
          background: #000;
          color: #fff;
          transform: scale(1.08);
        }

        .product-content {
          padding: 22px;
        }

        .product-category {
          display: inline-block;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .product-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
          line-height: 1.35;
        
        }

        .product-title a {
          text-decoration: none;
          color: #111827;
          transition: color 0.3s ease;
        }

        .product-title a:hover {
          color: #000;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .stars {
          color: #f59e0b;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .rating-text {
          font-size: 14px;
          color: #6b7280;
          font-weight: 600;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .new-price {
          font-size: 22px;
          font-weight: 800;
          color: #111827;
        }

        .old-price {
          font-size: 15px;
          color: #9ca3af;
          text-decoration: line-through;
        }

        .cart-btn {
          width: 100%;
          border: none;
          padding: 14px 18px;
          background: linear-gradient(135deg, #111827, #1f2937);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 24px 0;
        }

        .cart-btn:hover {
          background: linear-gradient(135deg, #000, #000);
          transform: translateY(-2px);
        }

        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 50%;
          background: #111827;
          color: #fff;
          font-size: 28px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .slider-nav:hover {
          background: #000;
          transform: translateY(-50%) scale(1.05);
        }

        .hot-products-prev {
          left: 0;
        }
  .hot-products-prev span{
          top: -5px;position: relative;
        }
           .hot-products-next span{
          top: -5px;position: relative;
        }
        .hot-products-next {
          right: 0;
        }

        @media (max-width: 1199px) {
          .product-thumb {
            height: 250px;
          }
        }

        @media (max-width: 991px) {
          .product-slider-wrap {
            padding: 10px 42px;
          }

          .product-thumb {
            height: 240px;
          }

          .product-title {
            font-size: 18px;
            min-height: auto;
          }
        }

        @media (max-width: 767px) {
          .product-slider-wrap {
            padding: 0;
          }

          .slider-nav {
            display: none;
          }

          .product-thumb {
            height: 260px;
          }

          .product-content {
            padding: 18px;
          }
        }

        @media (max-width: 576px) {
          .section-title {
            font-size: 24px;
          }

          .view-all-btn {
            width: 100%;
            justify-content: center;
          }

          .product-thumb {
            height: 230px;
          }

          .product-title {
            font-size: 17px;
          }
        }
      `}</style>
    </section>
  );
}