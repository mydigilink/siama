"use client";

export default function ServicesSection() {

  const services = [
    {
      title: "Skin Care",
      para:"Take care of your healthy and radiant skin starts",
      image: "/img/Facial Treatment.jpg"
    },
    {
      title: "Eyebrow Tattoo",
      para:"Absolutely stunning shaped brows that wow.",
            image: "/img/Eyebrows Makeup.jpg"
    },
    {
      title: "Lip Tattoo",
      para:" Perfect, natural, long-lasting lip enhancement.",
      image: "/img/Permanent makeup.jpg"
    }
  ];

  return (
    <section className="services-section py-5">
      <div className="container">

        {/* Section Heading */}
        <div className="text-center mb-5">
          <span className="services-subtitle">
            BEAUTY SALON SERVICES
          </span>

          <h2 className="services-title">
          Elevate Your Natural Beauty with <br />Our Most Trusted Services
          </h2>
        </div>

        {/* Cards */}
        <div className="row g-4">

          {services.map((service, i) => (
            <div className="col-lg-4 col-md-6" key={i}>
              <div className="service-card">

                <img
                  src={service.image}
                  alt={service.title}
                  className="img-fluid"
                />

                <div className="service-content">

                  <h4>{service.title}</h4>
                  <p>{service.para}</p>

                  <span className="explore-link">
                    EXPLORE →
                  </span>

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Button */}
        <div className="text-center mt-5">
          <button className="all-services-btn">
            ALL SERVICES →
          </button>
        </div>

      </div>
    </section>
  );
}