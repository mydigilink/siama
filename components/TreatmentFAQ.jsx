"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const defaultFAQs = [
  {
    question: "What is this treatment and how does it work?",
    answer:
      "This treatment is designed to address specific skin or wellness concerns using advanced techniques and professional-grade products. Our specialists customize the procedure based on your individual needs to deliver safe and effective results.",
  },
  {
    question: "Who is this treatment suitable for?",
    answer:
      "This treatment is suitable for most individuals looking to improve their skin health, appearance, or overall wellness. A consultation is recommended to assess your goals, skin type, and medical history.",
  },
  {
    question: "How long does the treatment session take?",
    answer:
      "Most treatment sessions usually take between 30 to 90 minutes depending on the selected service and your personalized treatment plan.",
  },
  {
    question: "Is the treatment painful?",
    answer:
      "Most clients experience little to no discomfort during the treatment. Some procedures may cause mild sensitivity or warmth, but this is typically temporary and manageable.",
  },
  {
    question: "Is there any downtime after the treatment?",
    answer:
      "Many treatments have minimal to no downtime. In some cases, temporary redness, mild swelling, or sensitivity may occur and usually resolves quickly.",
  },
  {
    question: "When will I see results?",
    answer:
      "Some treatments show immediate visible improvement, while others provide gradual results over the following days or weeks depending on the treatment type and your body's response.",
  },
  {
    question: "How many sessions will I need?",
    answer:
      "The number of sessions depends on your treatment goals and the condition being treated. Some clients see benefits after one session, while others may require multiple sessions for optimal results.",
  },
  {
    question: "Can I book a consultation before the treatment?",
    answer:
      "Yes, we highly recommend booking a consultation before the treatment. This allows our specialists to understand your concerns and recommend the most suitable treatment plan.",
  },
];

export default function TreatmentFAQ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know before booking your treatment.",
  faqs = defaultFAQs,
}) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="treatment-faq-section py-5 py-md-6">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-4 mb-md-5">
          <span className="faq-badge mb-3 d-inline-block">FAQs</span>
          <div className="text-center mb-5">
            <h2 className="fw-bold">{title}</h2>
            <p className="text-muted mb-0">
              {subtitle}
            </p>
          </div>
          
        </div>

        {/* FAQ List */}
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`faq-card mb-3 ${isOpen ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="faq-button w-100 d-flex align-items-center justify-content-between text-start border-0 bg-transparent"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="d-flex align-items-start gap-3">
                    <span className="faq-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="faq-question mb-0">{faq.question}</h3>
                  </div>

                  <span className="faq-icon">
                    {isOpen ? <FiMinus size={18} /> : <FiPlus size={18} />}
                  </span>
                </button>

                <div className={`faq-answer-wrap ${isOpen ? "open" : ""}`}>
                  <div className="faq-answer">
                    <p className="mb-0">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="faq-cta text-center mt-4 mt-md-5">
          <div className="faq-cta-box d-inline-flex flex-column flex-md-row align-items-center gap-3">
            <p className="mb-0">Still have questions about this treatment?</p>
            <a href="/contact" className="btn faq-btn">
              Book a Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Scoped CSS */}
      <style jsx>{`
        .treatment-faq-section {
          background: linear-gradient(180deg, #fff8fb 0%, #ffffff 50%, #fff8fb 100%);
          position: relative;
        }

        .faq-badge {
          padding: 8px 18px;
          border-radius: 999px;
          background: #fde7f1;
          color: #d63384;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .faq-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #1f1f1f;
          margin-bottom: 12px;
        }

        .faq-subtitle {
          max-width: 680px;
          color: #6c757d;
          font-size: 16px;
          line-height: 1.8;
        }

        .faq-card {
          background: #ffffff;
          border: 1px solid #f1d9e4;
          border-radius: 24px;
          padding: 0;
          box-shadow: 0 10px 30px rgba(214, 51, 132, 0.05);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(214, 51, 132, 0.08);
        }

        .faq-card.active {
          border-color: #f5b7cf;
          box-shadow: 0 16px 40px rgba(214, 51, 132, 0.12);
        }

        .faq-button {
          padding: 22px 24px;
          cursor: pointer;
        }

        .faq-number {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ff4fa0 0%, #ff6b81 100%);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(255, 79, 160, 0.25);
        }

        .faq-question {
          font-size: 18px;
          font-weight: 600;
          color: #212529;
          line-height: 1.5;
          padding-top: 2px;
        }

        .faq-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 50%;
          border: 1px solid #f1d9e4;
          color: #d63384;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          transition: all 0.3s ease;
        }

        .faq-card.active .faq-icon {
          background: #d63384;
          color: #fff;
          border-color: #d63384;
          transform: rotate(180deg);
        }

        .faq-answer-wrap {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }

        .faq-answer-wrap.open {
          max-height: 300px;
        }

        .faq-answer {
          padding: 0 24px 24px 84px;
          color: #6c757d;
          font-size: 15px;
          line-height: 1.9;
          border-top: 1px solid #fbe3ec;
        }

        .faq-answer p {
          padding-top: 18px;
        }

        .faq-cta-box {
          background: #ffffff;
          border: 1px solid #f7dce7;
          border-radius: 24px;
          padding: 18px 24px;
          box-shadow: 0 10px 30px rgba(214, 51, 132, 0.06);
        }

        .faq-cta-box p {
          color: #495057;
          font-size: 15px;
        }

        .faq-btn {
          background: linear-gradient(135deg, #ff4fa0 0%, #ff6b81 100%);
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 999px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .faq-btn:hover {
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(255, 79, 160, 0.25);
        }

        @media (max-width: 767px) {
          .faq-button {
            padding: 18px 16px;
            align-items: flex-start !important;
          }

          .faq-number {
            width: 40px;
            height: 40px;
            min-width: 40px;
            border-radius: 14px;
            font-size: 12px;
          }

          .faq-question {
            font-size: 16px;
          }

          .faq-icon {
            width: 38px;
            height: 38px;
            min-width: 38px;
          }

          .faq-answer {
            padding: 0 16px 18px 16px;
            font-size: 14px;
          }

          .faq-answer p {
            padding-top: 14px;
          }

          .faq-cta-box {
            width: 100%;
            padding: 18px;
          }
        }
      `}</style>
    </section>
  );
}