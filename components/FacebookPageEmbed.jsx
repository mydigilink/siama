"use client";

import { useEffect } from "react";

export default function FacebookPageEmbed() {
  useEffect(() => {
    // Load Facebook SDK
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    } else {
      // Re-parse if SDK already loaded
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    }
  }, []);

  return (
    <>
      <div id="fb-root"></div>

      <div
        className="fb-page"
        data-href="https://www.facebook.com/Siama-Skincare-61559660877512/"
        data-tabs="events"
        data-width="400"
        data-height="200"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote
          cite="https://www.facebook.com/Siama-Skincare-61559660877512/"
          className="fb-xfbml-parse-ignore"
        >
          <a href="https://www.facebook.com/Siama-Skincare-61559660877512/">
            Facebook Page
          </a>
        </blockquote>
      </div>
    </>
  );
}