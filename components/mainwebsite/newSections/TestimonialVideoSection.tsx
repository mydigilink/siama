"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaStar, FaPlay } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    id: 1,
    name: "Nisha",
    role: "",
    review:
      "I recently tried the IV Glutathione therapy at Siama Skincare and I’m thrilled with the results! From start to finish, the experience was professional, comfortable, and effective. The team ...",
    rating: 4,
    video: "/video/testimonial-1.mp4",
    poster: "/images/testimonial-1.jpg",
    type: "text-video",
  },
  {
    id: 2,
    name: "Nidhi Gupta",
    role: "",
    review:
      "I recently tried the IV Glutathione therapy at Siama Skincare and I’m thrilled with the results! From start to finish, the experience was professional, comfortable, and effective. The team ...",
    rating: 5,
    video: "/video/testimonial-2.mp4",
    poster: "/images/testimonial-2.jpg",
    type: "video-text",
  },
  {
    id: 3,
    name: "Priya",
    role: "",
    review:
      "I recently tried the IV Glutathione therapy at Siama Skincare and I’m thrilled with the results! From start to finish, the experience was professional, comfortable, and effective. The team ...",
    rating: 4,
    video: "/video/testimonial-3.mp4",
    poster: "/images/testimonial-3.jpg",
    type: "text-video",
  },
  {
    id: 4,
    name: "Himani Sao",
    role: "",
    review:
      "Amazing service, professional therapists, and a very relaxing experience. I highly recommend their treatments to anyone looking for visible skin improvements.",
    rating: 5,
    video: "/video/testimonial-4.mp4",
    poster: "/images/testimonial-4.jpg",
    type: "video-text",
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="testimonial-stars">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < count ? "star active" : "star"}
        />
      ))}
    </div>
  );
}

function VideoCard({ video, poster }: { video: string; poster: string }) {
  return (
    <div className="testimonial-video">
      <video
        poster={poster}
        preload="auto"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* <button
        className="play-btn"
        onClick={(e) => {
          const videoEl = e.currentTarget.parentElement.querySelector("video");
          if (videoEl.paused) {
            videoEl.play();
            videoEl.controls = true;
            e.currentTarget.style.display = "none";
          }
        }}
        aria-label="Play testimonial video"
      >
        <FaPlay />
      </button> */}
    </div>
  );
}

function TestimonialCard({ item }: { item: typeof testimonials[0] }) {
  return (
    <div className="testimonial-card">
      {item.type === "text-video" ? (
        <>
          <div className="testimonial-content">
            <Stars count={item.rating} />
            <p className="review">"{item.review}"</p>
            <h4>{item.name}</h4>
            <span>{item.role}</span>
          </div>
          <VideoCard video={item.video} poster={item.poster} />
        </>
      ) : (
        <>
          <VideoCard video={item.video} poster={item.poster} />
          <div className="testimonial-content">
            <Stars count={item.rating} />
            <p className="review">"{item.review}"</p>
            <h4>{item.name}</h4>
           <Image src="/img/postedGoogle.jpeg" alt="Google Reviews" width={60} height={16}  />
                              {/* <span>{item.role}</span> */}
          </div>
        </>
      )}
    </div>
  );
}

export default function TestimonialVideoSection() {
  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="section-head">
          <h2>Client Testimonials</h2>
        </div>

        <div className="testimonial-slider-wrap">
          <button className="custom-nav custom-prev">‹</button>
          <button className="custom-nav custom-next">›</button>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={3}
            loop={true}
            speed={900}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <TestimonialCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx>{`
      
      `}</style>
    </section>
  );
}