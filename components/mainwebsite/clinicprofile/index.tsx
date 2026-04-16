'use client';

import React from 'react';
import styles from './ClinicProfile.module.css';
import { FaPhoneAlt, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function ClinicProfile({ clinicData }: any) {

  const defaultData = {
    name: 'Siama SkinCare',
    image:'/img/clinc.png',
    type: 'Skin care clinic',
    rating: 4.7,
    reviews: 29,
    source: 'Google reviews',
    location: '',
    address: '',
    phone: '',
    map: '',
    images: [],
    reviewsList: [],
  };


  const data = { ...defaultData, ...clinicData };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={styles.star}
        style={{ opacity: i < rating ? 1 : 0.3 }}
      />
    ));
  };

  return (
    <div className="container mt-5">

      {/* TOP CARD */}
      <div className={styles.card}>
        <div className={styles.left}>
         <Image src={data.image} alt={data.name}  width={200} height={200} />
              

          <div>
            {/* ✅ FIXED */}
            <h2 className={styles.title}>{data.name}</h2>
            <p className={styles.subtitle}>{data.type}</p>

            <div className={styles.rating}>
              <span className={styles.ratingNumber}>
                {data.rating}
              </span>

              {renderStars(Math.round(data.rating))}

              <span className={styles.reviews}>
                ({data.reviews} {data.source})
              </span>
            </div>

            <p className={styles.location}>{data.location}</p>
            <p className={styles.address}>{data.address}</p>

            {/* ✅ MAP LINK */}
            
          </div>
        </div>

        {/* ✅ INDIVIDUAL PHONE */}
        <div className={styles.right}>
        <div> <a href={`tel:${data.phone}`} className={styles.callBtn}>
            <FaPhoneAlt /> {data.phone}
          </a>
           <a href={`/clinic/${data.url}`} className={styles.viewMoreBtn}>
           View More
          </a>
          </div> 
          <div>
          <a
              href={data.map}
              target="_blank"
             className={styles.getDirectionsBtn}
            >
              <FaMapMarkerAlt /> Get Directions
            </a>
        </div></div>
      </div>

    </div>
  );
}