"use client";

import {
  FaSpa,
  FaLaptopMedical,
  FaUserCheck,
  FaFlask,
  FaRegSmile,
  FaHandsHelping
} from "react-icons/fa";

export default function WhyChoose() {

  const features = [
    {
      icon: <FaSpa size={50} />,
      title: "Expert Care",
      desc: "Our skilled team ensures every treatment brings out your natural beauty."
    },
    {
      icon: <FaLaptopMedical size={50} />,
      title: "Advanced Technology",
      desc: "Experience ultimate comfort and relaxation in our serene salon environment."
    },
    {
      icon: <FaUserCheck size={50} />,
      title: "Personalized Treatment",
      desc: "Personalized services designed to meet your unique beauty needs and goals."
    },
    {
      icon: <FaFlask size={50} />,
      title: "High-Quality products only",
      desc: "We use premium, trusted products for safe and effective beauty care."
    },
    {
      icon: <FaRegSmile size={50} />,
      title: "Attention to every detail",
      desc: "Our dedication to perfection means every detail is thoughtfully handled."
    },
    {
      icon: <FaHandsHelping size={50} />,
      title: "Comprehensive beauty care",
      desc: "From skincare to hair treatments, we offer a complete range of services."
    }
  ];

  return (
    <section className="why-section py-5">

      <div className="container">

        {/* Heading */}

        <div className="text-center mb-5">
          <span className="why-subtitle">
            WHY CHOOSE SIAMA?
          </span>

          <h2 className="why-title">
            Personalized Treatment
          </h2>
        </div>

        {/* Features */}

        <div className="row g-4">

          {features.map((item, i) => (
            <div className="col-lg-4 col-md-6" key={i}>

              <div className="why-item">

                <div className="why-icon">
                
                  {item.icon}
                </div>

                <div>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}