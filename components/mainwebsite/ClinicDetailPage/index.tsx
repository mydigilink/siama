'use client';

import React, {  useState } from 'react';
import styles from './ClinicDetailPage.module.css';
import { FaStar, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Activity,Brush, CircleDot, Droplets, Flame, Layers,  ScanFace, Sun, Syringe, Wand2, Waves, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const tabs = ['Overview', 'Services', 'Reviews', 'Photos'];

// const clinic = {
//   name: 'Siama SkinCare',
//   type: 'Skin care clinic',
//   rating: 4.7,
//   reviews: 29,
//   location: 'Noida, Uttar Pradesh',
//   address: 'First Floor, C-129, C Block, Pocket C, Sector 18, Noida, Uttar Pradesh 201301',
//   phone: '+91 8287795045',

//   images: [
//     'https://lh3.googleusercontent.com/p/AF1QipO_b5Zbf2rNh5vNW_B5aPlXtBGPkOIMF1oh_7O-=w243-h406-n-k-no-nu',
//     'https://lh3.googleusercontent.com/p/AF1QipOoBcCmJfwfH0kEeNEHMA2VdWBYitxZQfs9-Xea=w243-h174-n-k-no-nu',
//     'https://lh3.googleusercontent.com/p/AF1QipP9cNx6pmMr4vwrZrKjEdaV3DEsHryqnmBp3CJ0=w243-h406-n-k-no-nu',
//     'https://lh3.googleusercontent.com/p/AF1QipOoBcCmJfwfH0kEeNEHMA2VdWBYitxZQfs9-Xea=w243-h174-n-k-no-nu'
//   ],

//   mapEmbed:
//     'https://www.google.com/maps?q=Siama+SkinCare+Noida&output=embed'
// };

// const faqData = [
//   {
//     question: 'Where is Siama SkinCare located?',
//     answer:
//       'Siama SkinCare is located in Noida, Uttar Pradesh, India.',
//   },
//   {
//     question: 'What is the rating of Siama SkinCare?',
//     answer:
//       'The clinic has a rating of 4.7 based on 29 Google reviews.',
//   },
//   {
//     question: 'What services are available at Siama SkinCare?',
//     answer:
//       'Services include acne treatment, laser therapy, anti-aging treatments, and skin rejuvenation.',
//   },
//   {
//     question: 'How can I contact Siama SkinCare?',
//     answer:
//       'You can contact the clinic directly using the Call Now button on this page.',
//   },
//   {
//     question: 'Does Siama SkinCare accept appointments?',
//     answer:
//       'Yes, appointments are recommended. You can call the clinic to book your visit.',
//   },
// ];
// const reviews = [
//   {
//     name: 'Rahul Sharma',
//     rating: 5,
//     time: '2 weeks ago',
//     text: 'Excellent skin treatment! The doctor is very experienced and staff is friendly.',
//   },
//   {
//     name: 'Priya Verma',
//     rating: 4,
//     time: '1 month ago',
//     text: 'Good experience overall. Clean clinic and professional service.',
//   },
//   {
//     name: 'Amit Singh',
//     rating: 5,
//     time: '3 weeks ago',
//     text: 'Highly recommended for acne treatment. Visible results in few sessions.',
//   },
// ];
export default function ClinicDetailPage( { clinic, faqData, reviews }: any) {
 const [openFAQ, setOpenFAQ] = useState<number | null>(null);
 const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.left}>
      <Image src={clinic.image} alt={clinic.name} width={200} height={200} />
        <div>   <h1>{clinic.name}</h1>
          <p className={styles.type}>{clinic.type}</p>

          <div className={styles.rating}>
            <span>{clinic.rating}</span>
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={styles.star}
                style={{ opacity: i < Math.round(clinic.rating) ? 1 : 0.3 }}
              />
            ))}
            <span>({clinic.reviews} Google reviews)</span>
          </div>

          <p className={styles.location}>
            <FaMapMarkerAlt /> {clinic.location}
          </p>

          <p className={styles.address}>{clinic.address}</p>
            <button className={styles.callBtn}>
            <FaPhoneAlt /> Call Now
          </button>
        </div>
</div> 
      
      </div>

      {/* IMAGE GALLERY */}
        {/* <div className={styles.gallery}>
          {clinic.images.map((img, i) => (
            <img key={i} src={img} alt="clinic" />
          ))}
        </div> */}

      {/* TABS */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${
              activeTab === tab ? styles.active : ''
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {activeTab === 'Overview' && (
          <>
            <h3>About {clinic.name}</h3>
            <p>
             "Siama is a leading cosmetology and aesthetic clinic offering advanced skin and hair treatments using modern, FDA-approved technology. Our expert dermatologists and certified professionals specialize in laser hair reduction, skin rejuvenation, PRP hair therapy, advanced facials, and customized skincare solutions. We are committed to delivering safe, effective, and result-oriented treatments tailored to each client’s needs. At Siama, your beauty and confidence are our priority."
             <br />
             <br />
              {clinic.name} is a trusted {clinic.type.toLowerCase()} in{' '}
              {clinic.location}. Known for high-quality treatments and strong
              patient satisfaction, it holds a {clinic.rating} rating based on{' '}
              {clinic.reviews} Google reviews.
            </p>
          </>
        )}

        {activeTab === 'Services' && (
            <ul className={styles.servicesList}>
        <li><Link href="/services/laser-hair-removal" > Laser Hair Removal</Link></li>
        <li><Link href="/services/laser-facials"> Laser Facials</Link></li>
        <li><Link href="/services/chemical-peel"> Chemical Peels</Link></li>
        <li><Link href="/services/face-prp"> Face PRP</Link></li>
        <li><Link href="/services/skin-rejuvenation"> Skin Rejuvenation</Link></li>
        <li><Link href="/services/permanent-makeup"> Permanent Makeup</Link></li>
        <li><Link href="/services/exosome-treatment"> Exosome Treatment</Link></li>
        <li><Link href="/services/microdermabrasion"> Microdermabrasion</Link></li>
        <li><Link href="/services/microneedling"> Microneedling</Link></li>
        <li><Link href="/services/hydra-facial"> Hydra Facial</Link></li>
        <li><Link href="/services/acne-treatment"> Acne Treatment</Link></li>
        <li><Link href="/services/fractional-co2"> Fractional CO2</Link></li>
       
          <li><Link href="/services/body-slimming">Body Slimming</Link></li>
        <li><Link href="/services/weight-loss-treatment"> Weight Loss</Link></li>
        <li><Link href="/services/slimming-facial"> Slimming Facial</Link></li>
        <li><Link href="/services/jawline-definition"> Jawline</Link></li>
        <li><Link href="/services/body-shaping"> Body Shaping</Link></li>
        <li><Link href="/services/coolsculpting"> Coolsculpting</Link></li>
        <li><Link href="/services/figure-correction"> Figure Correction</Link></li>
        <li><Link href="/services/full-face-remodeling"> Face Remodeling</Link></li>
        <li><Link href="/services/chin-enhancement"> Chin Enhancement</Link></li>
     <li><Link href="/services/hair-prp"> Hair PRP</Link></li>
        <li><Link href="/services/hair-gfc"> Hair GFC</Link></li>
        <li><Link href="/services/hair-transplant"> Hair Transplant</Link></li>
        <li><Link href="/services/hair-exosome"> Hair Exosome</Link></li>
     <li><Link href="/services/botox"> Botox</Link></li>
        <li><Link href="/services/hifu-treatment"> HIFU</Link></li>
        <li><Link href="/services/skin-booster"> Skin Booster</Link></li>
        <li><Link href="/services/mnrf"> MNRF</Link></li>
        <li><Link href="/services/cog-thread"> Cog Thread</Link></li>
        <li><Link href="/services/prp"> PRP</Link></li>
        <li><Link href="/services/dermal-filler"> Dermal Filler</Link></li>
        <li><Link href="/services/prophilo"> Prophilo</Link></li>
   
       
       
        <li>
          <Link href="/services" style={{fontSize:"12px"}}>
            View All →
          </Link>
        </li>
      </ul>
        )}

        {activeTab === 'Reviews' && (
          <div>
            {reviews.map((review: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; rating: number; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; time: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
              <div key={index} className={styles.review}>
                <h4>{review.name}</h4>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={styles.star}>
                      {i < review.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p>{review.text}</p>
                <small>{review.time}</small>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Photos' && (
          <div className={styles.gallery}>
            {clinic.images.map((img: string, i: number) => (
              <img key={i} src={img} alt="clinic" />
            ))}
          </div>
        )}
      </div>
 <h3 className={styles.h3}>Locate Us</h3>

      {/* MAP */}
      <div className={styles.mapContainer}>
        <iframe
          src={clinic.mapEmbed}
          width="100%"
          height="350"
          loading="lazy"
        ></iframe>
      </div>
      {/* FAQ SECTION */}
<div className={styles.faqSection}>
  <h3 className={styles.h3}>Frequently Asked Questions</h3>

  {faqData.map((faq: { question: string; answer: string }, index: number) => (
    <div key={index} className={styles.faqItem}>
      <button
        className={styles.faqQuestion}
        onClick={() =>
          setOpenFAQ(openFAQ === index ? null : index)
        }
      >
        {faq.question}
      </button>

      {openFAQ === index && (
        <p className={styles.faqAnswer}>{faq.answer}</p>
      )}
    </div>
  ))}
</div>
    </div>
  );
}