"use client";

import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import styles from "./style.module.scss";

interface Testimonial {
  name: string;
  prof: string;
  date: string;
  comment: string;
  img: string;
  rating?: number;
}

interface GoogleReviewsResponse {
  status: string;
  name?: string;
  rating?: number;
  totalRatings?: number;
  reviews?: Testimonial[];
  message?: string;
}
const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const getColor = (name: string) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
const FALLBACK_TESTIMONIALS: Testimonial[] = [
    {
      name: "Abhishek Tiwari",
      prof: "Siama Skincare",
      date: "3 months ago",
      comment:
        "I recently opted for the **LHR (Laser Hair Reduction) + IV Glutathione combo package** at Siama Skincare, and I can confidently say it was an amazing experience from start to finish. ",
      img: "https://img.freepik.com/free-photo/beautiful-woman-purple-sweater-skirt_1303-17487.jpg?size=626&ext=jpg&ga=GA1.1.47829334.1716269168&semt=ais_user",
      rating: 5,
    },
    {
      name: "simran jha",
      prof: "Siama Skincare",
      date: "3 weeks ago",
      comment:
        "I recently took a combo package for Full Body Laser Hair Reduction, IV Glutathione, and CO2 Fractional Laser for scar removal at Siama Skin Care, and my experience has been excellent. …",
      img: "https://img.freepik.com/free-photo/portrait-female-tourist-visiting-great-wall-china_23-2151261878.jpg?t=st=1718278847~exp=1718282447~hmac=f7732529c15f92d1b2858ce7e910fff68f4cd7286b64b3307210c09e145c37b7&w=740",
      rating: 5,
    },
    {
      name: "Amit Gusain",
      prof: "Siama Skincare",
      date: "3 weeks ago",
      comment:
        "I recently visited Siama Skincare and honestly, I’m so happy with my experience. The senior doctor suggested a combination of Hydra and Glutathione treatment after carefully checking my skin, and it turned out to be the perfect choice for ",
      img: "https://img.freepik.com/free-photo/medium-shot-woman-front-stairs-looking-camera_23-2148286121.jpg?w=360&t=st=1718278918~exp=1718279518~hmac=3605e21a1f38865c61395c144cba0711bfd1ac502b8186a911ec87b4ab6ae5be",
      rating: 5,
    },
    {
      name: "Amit",
      prof: "Siama Skincare",
      date: "1 week ago",
      comment:
        "I had an amazing experience with Siama Skin Care for my acne and LHR (Laser Hair Removal) combo treatment. The results have been truly impressive! My acne has reduced significantly, and my skin feels much healthier and clearer now. …",
      img: "https://img.freepik.com/free-photo/medium-shot-woman-front-stairs-looking-camera_23-2148286121.jpg?w=360&t=st=1718278918~exp=1718279518~hmac=3605e21a1f38865c61395c144cba0711bfd1ac502b8186a911ec87b4ab6ae5be",
      rating: 5,
    },
    {
      name: "Abhishek",
      prof: "Siama Skincare",
      date: "3 weeks ago",
      comment:
        "I honestly can’t express how grateful I am to Siama Skincare for my transformation. I went for full body LHR and scar removal treatment, and the results have truly changed my confidence and the way I feel about myself. …",
      img: "https://img.freepik.com/free-photo/medium-shot-woman-front-stairs-looking-camera_23-2148286121.jpg?w=360&t=st=1718278918~exp=1718279518~hmac=3605e21a1f38865c61395c144cba0711bfd1ac502b8186a911ec87b4ab6ae5be",
      rating: 5,
    },
    {
      name: "Kumari Ekta Jha",
      prof: "Siama Skincare",
      date: "1 week ago",
      comment:
        "I had a wonderful experience with the Mounjaro weight management program at Siama Skin Care. After doing a lot of research and comparing multiple clinics, I finally chose Siama because of the trust factor, affordable pricing, and the expert …",
      img: "https://img.freepik.com/free-photo/medium-shot-woman-front-stairs-looking-camera_23-2148286121.jpg?w=360&t=st=1718278918~exp=1718279518~hmac=3605e21a1f38865c61395c144cba0711bfd1ac502b8186a911ec87b4ab6ae5be",
      rating: 5,
    },
  ];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function fetchGoogleReviews() {
      try {
        const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';
        
        console.log('🔍 Fetching Google reviews for place_id:', placeId || 'NOT SET');
        
        if (!placeId) {
          console.warn('⚠️ Google Place ID not configured. Please set NEXT_PUBLIC_GOOGLE_PLACE_ID in your .env.local file');
          console.warn('Using fallback testimonials');
          setTestimonials(FALLBACK_TESTIMONIALS);
          setLoading(false);
          return;
        }

        console.log('📡 Calling API: /api/google-reviews?place_id=' + placeId);
        const response = await fetch(`/api/google-reviews?place_id=${placeId}`);
        
        if (!response.ok) {
          console.error('❌ API response not OK:', response.status, response.statusText);
          const errorData = await response.json().catch(() => ({}));
          console.error('Error data:', errorData);
          setTestimonials(FALLBACK_TESTIMONIALS);
          setLoading(false);
          return;
        }

        const data: GoogleReviewsResponse = await response.json();
        console.log('📦 API Response:', data);

        if (data.status === 'success' && data.reviews && data.reviews.length > 0) {
          console.log('✅ Successfully loaded', data.reviews.length, 'Google reviews');
          setTestimonials(data.reviews);
          setOverallRating(data.rating || 0);
          setTotalRatings(data.totalRatings || 0);
        } else {
          console.warn('⚠️ Failed to fetch Google reviews:', data.message || 'No reviews in response');
          console.warn('Using fallback testimonials');
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } catch (error) {
        console.error('❌ Error fetching Google reviews:', error);
        setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }

    fetchGoogleReviews();
  }, []);

  return (
    <div className='container mx-auto px-4 py-12'>
    <div className={styles.testimonials}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
        <p className={styles.sectionSubtitle}>
          Real experiences from our satisfied customers
        </p>
      </div>
      <div className={styles.carouselWrapper}>
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={4000}
          keyBoardControl={true}
          customTransition="all 1s ease"
          transitionDuration={500}
          slidesToSlide={1}
          containerClass={styles.carouselContainer}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          itemClass={styles.carouselItem}
        >
          {loading ? (
            <div className={styles.testimonialCard}>
              <p>Loading reviews...</p>
            </div>
          ) : (
            testimonials.map((elem, id) => (
              <div className={styles.testimonialCard} key={id}>
               <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => {
                    const rating = elem.rating || 5;
                    const isFilled = i < Math.floor(rating);
                    return (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.starIcon}
                        viewBox="0 0 20 20"
                        fill={isFilled ? "currentColor" : "none"}
                        stroke={isFilled ? "currentColor" : "currentColor"}
                        strokeWidth={isFilled ? 0 : 1}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    );
                  })}
                </div>
                <p className={styles.comment}>&quot;{elem.comment}&quot;</p>
               
                 <div className={styles.cardHeader}>
                  {/* <div className={styles.avatar}>
                    <div className={styles.avatarInitial}>
                      {elem.name.charAt(0).toUpperCase()}
                    </div>
                  </div> */}
                  <div className={styles.userInfo}>
                    <h4 className={styles.userName}>{elem.name}</h4>
                    
                {/* <p className={styles.userProf}>{elem.prof}</p> */}
                     {/* <p className={styles.date}>{elem.date}</p> */}
                      <a
                  href="https://www.google.com/search?sca_esv=6125c3d1919d1932&rlz=1C5GCEM_enIN1050IN1050&sxsrf=ANbL-n7XFaC30GgNszjfCpJJcUo8EhC75w:1769318330480&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOZK1BfksvNQCLaITLKeQ1F9SUz_0pcbyGhFwoWQNRoJkloW5krlOrRArnMpIpv_zdJKN_98pWVLWz_YnsXVQWzMNupC9&q=Siama+Skincare+Reviews&sa=X&ved=2ahUKEwjBzdS0-KWSAxU9wjgGHQBiBi8Q0bkNegQIJxAH&biw=1512&bih=827&dpr=2&aic=0#lrd=0x390cef8a50ce7ec7:0x5e1dec902a13bdf6,1,,,,"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.moreReviewsLink}
                >
                <Image src="/img/postedGoogle.jpeg" alt="Google Reviews" width={60} height={16} className={styles.googleIcon} />
                </a></div>
                </div>
                
             
              </div>
            ))
          )}
        </Carousel>
      </div>

      {/* <div className={styles.statsSection}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>98%</div>
          <p className={styles.statLabel}>Client Satisfaction</p>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>2k+</div>
          <p className={styles.statLabel}>Happy Clients</p>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>2+</div>
          <p className={styles.statLabel}>Years Experience</p>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>4.9</div>
          <p className={styles.statLabel}>Average Rating</p>
        </div>
      </div> */}
    </div>
    </div>
  );
}

