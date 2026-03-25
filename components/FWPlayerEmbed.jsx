"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function FWPlayerEmbed() {
  const playerRef = useRef(null);

  useEffect(() => {
    const initPlayer = () => {
      if (!window || !window.fwplayer || !playerRef.current) return;

      try {
        // Destroy old instance if needed
        if (window.__fwPlayerInstance && window.__fwPlayerInstance.destroy) {
          window.__fwPlayerInstance.destroy();
        }

        // Example init (replace with your actual FW player config)
        window.__fwPlayerInstance = window.fwplayer(playerRef.current, {
          playlist: [
            {
              sources: [
                {
                  file: "https://www.w3schools.com/html/mov_bbb.mp4",
                },
              ],
              image:
                "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80",
              title: "Skin Care Demo Video",
            },
          ],
          width: "100%",
          aspectratio: "16:9",
          autostart: false,
          mute: false,
          controls: true,
          pip: true, // if supported by your FW player version
        });
      } catch (error) {
        console.error("FW Player init error:", error);
      }
    };

    // Delay थोड़ा helpful होता है external script load के लिए
    const timer = setTimeout(() => {
      initPlayer();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Replace with your actual FW player script URL */}
      <Script
        src="https://cdn.fwplayer.com/path-to-your-player-sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("FW Player script loaded");
        }}
      />

      <div className="fw-player-wrap">
        <div
          id="fw-player"
          ref={playerRef}
          className="cy-player needsclick"
          style={{ display: "flex", visibility: "visible" }}
        ></div>
      </div>

      <style jsx>{`
        .fw-player-wrap {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        #fw-player {
          width: 100%;
          min-height: 560px;
          background: #000;
        }

        @media (max-width: 991px) {
          #fw-player {
            min-height: 420px;
          }
        }

        @media (max-width: 576px) {
          #fw-player {
            min-height: 240px;
          }
        }
      `}</style>
    </>
  );
}