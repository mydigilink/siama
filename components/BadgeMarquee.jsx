"use client";
import Image from "next/image";

const badges = [
  {
    img: "/img/100-safe.webp",
    text1: "Completely Safe",
    text2: "& Secure",
  },
  {
    img: "/img/Dermatologist-Monitored.webp",
    text1: "Expert Dermatologist",
    text2: "Care",
  },
  {
    img: "/img/US-FDA-Approved.webp",
    text1: "FDA Certified",
    text2: "Technology",
  },
  {
    img: "/img/Quick-Lasting-Results.webp",
    text1: "Fast & Lasting",
    text2: "Results",
  },
  {
    img: "/img/At-Home-Sessions.webp",
    text1: "Convenient At-Home",
    text2: "Sessions",
  },
];

export default function BadgeMarquee() {
  const items = [...badges, ...badges]; // duplicate for infinite loop

  return (
    <section className="badge-marquee py-3 bg-dark">
      <div className="container-fluid overflow-hidden">
        <div className="marquee-track d-flex">
          {items.map((item, index) => (
            <div className="badge-item d-flex align-items-center" key={index}>
              <Image
              className="image-to-white"
                src={item.img}
                alt={item.text1}
                width={48}
                height={48}
              />
              <p className="mb-0 ms-2 text-white">
                <span>{item.text1} </span>
                <span>{item.text2}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}