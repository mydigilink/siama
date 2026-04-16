"use client";

const stats = [
  {
    id: 1,
    value: "4,000+",
    label: "Happy Patients",
  },
  {
    id: 2,
    value: "50+",
    label: "Advanced Treatments",
  },
  {
    id: 3,
    value: "2+",
    label: "Premium Clinics",
  },
  {
    id: 4,
    value: "99.8%",
    label: "Success Rate",
  },
];

export default function ClinicHighlightStrip() {
  return (
    <section className="clinic-highlight-strip  py-md-5">
      <div className="container">
        <div className="highlight-strip-card">
          <div className="row align-items-center g-4 g-lg-0">
            {/* Left Content */}
            <div className="col-lg-5">
              <div className="highlight-left">
                <div className="highlight-icon">
                  <span className="spark spark-1"></span>
                  <span className="spark spark-2"></span>
                  <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="main-icon"
                  >
                    <circle cx="32" cy="32" r="28" fill="#FDE7D8" />
                    <path
                      d="M32 18C26.5 18 22 22.5 22 28C22 39 32 46 32 46C32 46 42 39 42 28C42 22.5 37.5 18 32 18Z"
                      fill="#FF7A59"
                    />
                    <path
                      d="M28 29H36"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M32 25V33"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="highlight-content">
                  <span className="mini-badge">Why Patients Trust Us</span>
                  <h2>
                     Trusted by Thousands for Beautiful, Confident Skin

                  </h2>
                  <p className="mb-0">
                 Customised treatments, cutting-edge methods, and expert help will make your journey with skin care better.

                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="col-lg-1 d-none d-lg-flex justify-content-center">
              <div className="center-divider"></div>
            </div>

            {/* Right Stats */}
            <div className="col-lg-6">
              <div className="stats-grid">
                {stats.map((item) => (
                  <div className="stat-item" key={item.id}>
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clinic-highlight-strip {
          background: linear-gradient(180deg, #fffaf6 0%, #ffffff 100%);
        }

        .highlight-strip-card {
          background: linear-gradient(135deg, #000000 0%, #7b7b7b 100%);
          border-radius: 32px 0;
          padding: 28px 22px;
          box-shadow: 0 18px 45px rgba(17, 24, 39, 0.08);
          overflow: hidden;
          position: relative;
        }

        .highlight-strip-card::before {
          content: "";
          position: absolute;
          top: -80px;
          right: -80px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          filter: blur(4px);
        }

        .highlight-left {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        .highlight-icon {
          position: relative;
          min-width: 92px;
          width: 92px;
          height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px 0;
          background: rgba(255, 255, 255, 0.28);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
        }

        .main-icon {
          width: 64px;
          height: 64px;
          position: relative;
          z-index: 2;
        }

        .spark {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.55);
        }

        .spark-1 {
          width: 10px;
          height: 10px;
          top: 12px;
          right: 14px;
        }

        .spark-2 {
          width: 7px;
          height: 7px;
          bottom: 14px;
          left: 14px;
        }

        .mini-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.45);
          padding: 7px 12px;
          border-radius: 999px;
          margin-bottom: 10px;
        }

        .highlight-content h2 {
          font-size: clamp(18px, 1.4vw, 28px);
          line-height: 1.4;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
          max-width: 520px;
        }

        .highlight-content h2 span {
          color: #ffffff;
        }

        .highlight-content p {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.75);
          max-width: 520px;
        }

        .center-divider {
          width: 1px;
          height: 100%;
          min-height: 140px;
          background: rgba(255, 255, 255, 0.18);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          position: relative;
          z-index: 2;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 22px 0;
          padding: 22px 16px;
          text-align: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .stat-item:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.42);
          box-shadow: 0 14px 30px rgba(17, 24, 39, 0.08);
        }

        .stat-item h3 {
          font-size: clamp(18px, 1.2vw, 22px);
          line-height: 1;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }

        .stat-item p {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
          line-height: 1.4;
        }

        /* Tablet */
        @media (max-width: 1199px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile / Tablet */
        @media (max-width: 991px) {
          .highlight-strip-card {
            padding: 24px 18px;
            border-radius: 24px 0;
          }

          .highlight-left {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 6px;
          }

          .highlight-icon {
            width: 80px;
            height: 80px;
            min-width: 80px;
            border-radius: 18px 0;
          }

          .main-icon {
            width: 56px;
            height: 56px;
          }

          .highlight-content h2 {
            font-size: 24px;
          }

          .highlight-content p {
            font-size: 14px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 10px;
          }

          .stat-item {
            padding: 18px 14px;
            border-radius: 18px 0;
          }

          .stat-item h3 {
            font-size: 26px;
          }

          .stat-item p {
            font-size: 13px;
          }
        }

        /* Small Mobile */
        @media (max-width: 575px) {
          .highlight-strip-card {
            padding: 18px 14px;
          }

          .mini-badge {
            font-size: 11px;
            padding: 6px 10px;
          }

          .highlight-content h2 {
            font-size: 21px;
            margin-bottom: 10px;
          }

          .highlight-content p {
            font-size: 13px;
            line-height: 1.6;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .stat-item {
            padding: 16px 10px;
          }

          .stat-item h3 {
            font-size: 22px;
            margin-bottom: 6px;
          }

          .stat-item p {
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
}