"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Nisha Sharma Sharma",
      role: "Laser Facial",
      gLink :"https://www.google.com/search?sca_esv=6125c3d1919d1932&rlz=1C5GCEM_enIN1050IN1050&sxsrf=ANbL-n7XFaC30GgNszjfCpJJcUo8EhC75w:1769318330480&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOZK1BfksvNQCLaITLKeQ1F9SUz_0pcbyGhFwoWQNRoJkloW5krlOrRArnMpIpv_zdJKN_98pWVLWz_YnsXVQWzMNupC9&q=Siama+Skincare+Reviews&sa=X&ved=2ahUKEwjBzdS0-KWSAxU9wjgGHQBiBi8Q0bkNegQIJxAH&biw=1512&bih=827&dpr=2&aic=0#lrd=0x390cef8a50ce7ec7:0x5e1dec902a13bdf6,1,,,,",
      review:
        "I am undergoing carbon laser treatment from Siama skin care clinic, I am getting very good results from it and the staff here is also very good, they take care of complete hygiene, I am happy to get treatment from here. Thank you siama",
      image: "/img/logo.png",
    },
    {
      name: "Maria - UK",
      role: "Skin Treatment",
      review:
        "Amazing experience! The staff is professional and the results were visible immediately. Highly recommended.",
      image: "/img/logo.png",
    },
    {
      name: "Sara - Canada",
      role: "Facial Treatment",
      review:
        "The atmosphere is relaxing and the treatments are top quality. My skin has never looked better.",
      image: "/img/logo.png",
    },
    {
      name: "Emma - Australia",
      role: "Laser Facial",
      review:
        "Very professional team and beautiful ambiance. I felt comfortable throughout the process and loved the final result.",
      image: "/img/logo.png",
    },
  ];

  return (
    <section className="testimonial-section py-5">
      <div className="container">
        <div className=" row">
          {/* LEFT CONTENT */}
          <div className="col-md-12 text-center mb-4">
            <span className="subtitle">GENUINE REVIEWS</span>
            <h3>Our Clients Love Their Results</h3>
            <p>
              Know why our clients trust us with their advanced beauty and skincare needs.<br /> Our personalised approach makes sure that every client feels cared for and confident, from radiant skin to results that last.

            </p>

            {/* <button className="review-btn">ALL REVIEWS →</button> */}

            {/* <div className="stats">
              <div>
                <h4>5.2K</h4>
                <span>Customers</span>
              </div>
              <div>
                <h4>6.4K</h4>
                <span>Bookings</span>
              </div>
              <div>
                <h4>4.9 ★</h4>
                <span>3.5K Reviews</span>
              </div>
            </div> */}
          </div>

          {/* RIGHT SLIDER */}
          <div className="testimonial-slider col-md-12">
            <Swiper
              modules={[Navigation, Autoplay]}
              slidesPerView={3}
              spaceBetween={20}
              navigation={true}
              loop={true}
              speed={800}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  }}
              className="testimonialSwiper"
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="review-card">
                   
                    {/* <h4>Exceptional Skincare, Glowing Results</h4> */}

                   

                    <div className="review-user">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.role}</span>
 <div className="stars">★★★★★</div>


                      </div>
                    </div>
                     <p>{item.review}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonial-section {
          background: linear-gradient(180deg, #fff8f5 0%, #ffffff 100%);
          overflow: hidden;
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 40px;
          align-items: center;
        }

        .testimonial-left {
          padding-right: 10px;
        }

        .subtitle {
          display: inline-block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #111827;
          background: rgba(17, 24, 39, 0.08);
          padding: 8px 14px;
          border-radius: 999px;
          margin-bottom: 16px;
        }

        .testimonial-left h2 {
          font-size: clamp(30px, 4vw, 52px);
          font-weight: 800;
          line-height: 1.15;
          color: #111827;
          margin-bottom: 16px;
        }

        .testimonial-left p {
          font-size: 16px;
          line-height: 1.7;
          color: #6b7280;
          margin-bottom: 24px;
          max-width: 460px;
        }

        .review-btn {
          border: none;
          background: #111827;
          color: #fff;
          padding: 14px 22px;
          font-weight: 700;
          border-radius: 24px 0;
          cursor: pointer;
          transition: 0.3s ease;
          margin-bottom: 28px;
        }

        .review-btn:hover {
          background: #000;
          transform: translateY(-2px);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .stats div {
          background: #fff;
          padding: 18px 14px;
          border-radius: 20px 0;
          box-shadow: 0 10px 25px rgba(17, 24, 39, 0.06);
          border: 1px solid #f1f5f9;
        }

        .stats h4 {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 4px;
          color: #111827;
        }

        .stats span {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
        }

        .testimonial-slider {
          position: relative;
          min-width: 0;
        }

        .review-card {
          background: #fff;
          border-radius: 28px 0;
          padding: 30px 60px;
          box-shadow: 0 16px 40px rgba(17, 24, 39, 0.08);
          border: 1px solid #f3f4f6;
          min-height: 320px;
          display: flex;
          flex-direction: column;
        }

        .stars {
          color: #f59e0b;
          font-size: 18px;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }

        .review-card h4 {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .review-card p {
          font-size: 16px;
          line-height: 1.8;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .review-user {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .review-user img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #f3f4f6;
        }

        .review-user strong {
          display: block;
          font-size: 16px;
          color: #111827;
        }

        .review-user span {
          font-size: 14px;
          color: #6b7280;
        }

        /* Swiper nav */
        :global(.testimonialSwiper .swiper-button-prev),
        :global(.testimonialSwiper .swiper-button-next) {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 8px 20px rgba(17, 24, 39, 0.12);
          color: #111827;
        }
            :global(.testimonialSwiper .swiper-button-prev svg),
        :global(.testimonialSwiper .swiper-button-next svg) {width: 16px; height: 16px;}

        :global(.testimonialSwiper .swiper-button-prev:after),
        :global(.testimonialSwiper .swiper-button-next:after) {
          font-size: 16px;
          font-weight: 700;
        }

        /* Tablet */
        @media (max-width: 991px) {
          .testimonial-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .testimonial-left {
            padding-right: 0;
          }

          .stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .review-card {
            min-height: auto;
            padding: 24px;
          }
        }

        /* Mobile */
        @media (max-width: 575px) {
          .testimonial-section {
            padding: 40px 0;
          }

          .testimonial-left h2 {
            font-size: 28px;
          }

          .testimonial-left p {
            font-size: 14px;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .review-card {
            padding: 20px;
            border-radius: 20px 0;
          }

          .review-card h4 {
            font-size: 20px;
          }

          .review-card p {
            font-size: 14px;
            line-height: 1.7;
          }

          :global(.testimonialSwiper .swiper-button-prev),
          :global(.testimonialSwiper .swiper-button-next) {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}