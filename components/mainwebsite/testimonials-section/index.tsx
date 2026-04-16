"use client";

import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./style.module.scss";

interface Testimonial {
  name: string;
  location: string;
  review: string;
  rating: number;
  timeAgo: string;
}

export default function TestimonialsSection() {
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const testimonials: Testimonial[] = [
    {
      name: "Nehaeats",
      location: "Mumbai",
      review: "I totally loved the service. It was my first session with makeO and I loved how professional they are. Leela, made sure I was comfortable at all times and answered all my questions patiently. The treatment was amazing and I can already see the difference in my skin.",
      rating: 5,
      timeAgo: "2 weeks ago",
    },
    {
      name: "Khushi Rawal",
      location: "New Delhi",
      review: "Absolutely love the treatment! amazing results, super hygienic and very kind counselors and therapists! My therapist Bhavna Tyagi was very professional and made me feel comfortable throughout the entire process. Highly recommend!",
      rating: 5,
      timeAgo: "5 months ago",
    },
    {
      name: "Mahek Kataria",
      location: "Mumbai",
      review: "It was my first experience with skinnsi and it was very great. The service is impeccable and Saba who helped me through the process was very delightful throughout and ensured I was comfortable. The results are visible and I'm very happy with the service.",
      rating: 4,
      timeAgo: "3 weeks ago",
    },
    {
      name: "Priya Sharma",
      location: "Bangalore",
      review: "Excellent service! The team was professional and the treatment was very effective. I noticed significant improvement in my skin texture after just one session. The therapist was knowledgeable and made sure I understood everything.",
      rating: 5,
      timeAgo: "1 month ago",
    },
    {
      name: "Anjali Patel",
      location: "Pune",
      review: "Great experience overall. The treatment was comfortable and the results are amazing. The staff was friendly and professional. I would definitely recommend Siama to anyone looking for quality beauty treatments.",
      rating: 5,
      timeAgo: "2 months ago",
    },
    {
      name: "Riya Mehta",
      location: "Gurgaon",
      review: "Very satisfied with the service. The therapist was skilled and the treatment was done with great care. I can see visible improvements in my skin. The booking process was also very smooth.",
      rating: 4,
      timeAgo: "1 week ago",
    },
  ];

  const truncateText = (text: string, maxLength: number = 120): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const toggleReview = (index: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={styles.testimonialsWrapper}>
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={false}
        responsive={responsive}
        infinite={true}
        autoPlay={false}
        keyBoardControl={true}
        customTransition="all 0.5s ease"
        transitionDuration={500}
        containerClass={styles.carouselContainer}
        itemClass={styles.carouselItem}
        arrows={true}
        renderButtonGroupOutside={false}
      >
        {testimonials.map((testimonial, index) => {
          const isExpanded = expandedReviews[index];
          const displayText = isExpanded
            ? testimonial.review
            : truncateText(testimonial.review);

          return (
            <div className={styles.testimonialCard} key={index}>
              <div className={styles.quoteIcon}>
                <span className={styles.quoteMark}>&ldquo;</span>
                <span className={styles.quoteMark}>&rdquo;</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.customerName}>{testimonial.name}</h3>
                <p className={styles.location}>{testimonial.location}</p>
                <p className={styles.reviewText}>
                  {displayText}
                  {!isExpanded && testimonial.review.length > 120 && (
                    <button
                      className={styles.readMore}
                      onClick={() => toggleReview(index)}
                    >
                      read more
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      className={styles.readMore}
                      onClick={() => toggleReview(index)}
                    >
                      read less
                    </button>
                  )}
                </p>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill={i < testimonial.rating ? "#FFD700" : "none"}
                      stroke={i < testimonial.rating ? "#FFD700" : "#E0E0E0"}
                      strokeWidth="2"
                      className={styles.star}
                    >
                      <path d="M10 1L12.5 7.5L19 8.5L14 13L15.5 19.5L10 16L4.5 19.5L6 13L1 8.5L7.5 7.5L10 1Z" />
                    </svg>
                  ))}
                </div>
                <div className={styles.footer}>
                  <div className={styles.googleLogo}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                  <span className={styles.timeAgo}>{testimonial.timeAgo}</span>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

