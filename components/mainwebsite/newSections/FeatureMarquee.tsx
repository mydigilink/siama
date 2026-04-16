"use client";

export default function FeatureMarquee() {

  const items = [
    "Home Sessions",
    "Dermatologist Monitored",
    "US FDA Approved",
    "24/7 Customer Support",
    "100% Safe",
    "Quick & Lasting Results",
     "Home Sessions",
    "Dermatologist Monitored",
    "US FDA Approved",
    "24/7 Customer Support",
    "100% Safe",
    "Quick & Lasting Results",
     "Home Sessions",
    "Dermatologist Monitored",
    "US FDA Approved",
    "24/7 Customer Support",
    "100% Safe",
    "Quick & Lasting Results"
  ];

  return (
    <div className="feature-marquee">
      <div className="marquee-track">

        {items.concat(items).map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
          </span>
        ))}

      </div>
    </div>
  );
}