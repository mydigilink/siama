"use client";

export default function AboutSiama() {
  return (
    <section className="about-siama py-5">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* Image */}
          <div className="col-lg-6">
            <div className="about-image">
              <img
                src="/img/aboutmain.jpeg"
                alt="About Siama"
                className="img-fluid"
              />
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-6">

            <span className="about-subtitle">
              ABOUT SIAMA
            </span>
            <h2 className="about-title">
             Your Personal Destination for Confidence & Radiance

            </h2>


            <p className="about-desc">
            SIAMA is where care, skill, and beauty come together. With the help of our skilled professionals who use new techniques and a personalised approach, you can bring out your best features. We work hard every day to bring out your inner beauty and make you feel more powerful and beautiful.
 </p>

            <button className="about-btn">
             Learn More About Us →
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}