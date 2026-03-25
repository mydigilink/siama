"use client";

import { useRef, useState } from "react";

export default function FWPlayerPip() {
  const videoRef = useRef(null);
  const [isPip, setIsPip] = useState(false);

  const togglePiP = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPip(false);
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
        setIsPip(true);
      } else {
        alert("Picture-in-Picture is not supported in this browser.");
      }
    } catch (error) {
      console.error("PiP error:", error);
    }
  };

  return (
    <section className="fw-player-section py-5">
      <div className="container">
        <div className="player-card">
          <div className="player-header">
            <div>
              <span className="badge-label">Skin Care Demo</span>
              <h2 className="player-title">FW Player with PiP Mode</h2>
              <p className="player-subtitle">
                Modern responsive video player with Picture-in-Picture support.
              </p>
            </div>

            <button className="pip-btn" onClick={togglePiP}>
              {isPip ? "Exit PiP" : "Open PiP"}
            </button>
          </div>

          <div className="video-wrap">
            <video
              ref={videoRef}
              className="video-player"
              controls
              playsInline
              preload="metadata"
              poster="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80"
              onEnterPictureInPicture={() => setIsPip(true)}
              onLeavePictureInPicture={() => setIsPip(false)}
            >
              {/* Dummy skincare-style sample video */}
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="info-box">
            <h5>Features Included:</h5>
            <ul>
              <li>Responsive 16:9 player</li>
              <li>Picture-in-Picture button</li>
              <li>Custom modern UI wrapper</li>
              <li>Works in Next.js App Router</li>
              <li>Can replace with your real skincare video URL anytime</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-player-section {
          background: linear-gradient(180deg, #fffaf5 0%, #ffffff 100%);
        }

        .player-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(17, 24, 39, 0.08);
          border: 1px solid #f1f5f9;
        }

        .player-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .badge-label {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 122, 24, 0.12);
          color: #ff7a18;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .player-title {
          margin: 0 0 8px;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #111827;
        }

        .player-subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 15px;
        }

        .pip-btn {
          border: none;
          border-radius: 14px;
          padding: 14px 20px;
          background: linear-gradient(135deg, #ff7a18, #ff4d4f);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 12px 24px rgba(255, 122, 24, 0.22);
        }

        .pip-btn:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }

        .video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 22px;
          overflow: hidden;
          background: #000;
          margin-bottom: 24px;
        }

        .video-player {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          background: #000;
        }

        .info-box {
          background: #f8fafc;
          border-radius: 18px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }

        .info-box h5 {
          margin: 0 0 12px;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .info-box ul {
          margin: 0;
          padding-left: 18px;
          color: #4b5563;
        }

        .info-box li {
          margin-bottom: 6px;
        }

        @media (max-width: 768px) {
          .player-card {
            padding: 20px;
            border-radius: 18px;
          }

          .pip-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}