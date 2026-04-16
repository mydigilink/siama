"use client";

import Script from "next/script";

export default function FWPlayer() {
  return (
    <>
      {/* Load external player script */}
      <Script
        src="https://cdn.flowplayer.com/players/native/3/stable/flowplayer.min.js"
        strategy="afterInteractive"
      />

      {/* Player container */}
      <div
        data-player-id="YOUR_PLAYER_ID"
        data-embed-id="default"
        className="flowplayer"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          aspectRatio: "16 / 9",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      />

      <style jsx>{`
        .flowplayer {
          background: #000;
        }
      `}</style>
    </>
  );
}