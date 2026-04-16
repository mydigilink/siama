"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./style.module.scss";
import { manualVideoIds } from "@/config/youtube-shorts";

interface Testimonial {
  name: string;
  text: string;
  videoId: string;
}

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
}

// Fallback testimonials if API fails - moved outside component to avoid dependency warning
const fallbackTestimonials: Testimonial[] = [
  {
    name: "At-home Sessions",
    text: "Choose your comfort: visit our clinic or enjoy the luxury of at-home sessions.",
    videoId: "CeU7htvmHHM",
  },
  {
    name: "Laser Hair Removal",
    text: "Top Laser Hair Removal in Noida Sec 18 | Client Reviews & Experience",
    videoId: "Ez8oYtXf6OU",
  },
  {
    name: "Hydraboost",
    text: "Hydraboost is your ultimate hydration therapy, designed to revitalize and rejuvenate from within.",
    videoId: "ymYQ-THkZ-g",
  },
  {
    name: "Hair Reduction",
    text: "Choose Laser Hair Reduction by Siama for smooth, hair-free skin",
    videoId: "uzAbIExr4dk",
  },
  {
    name: "Instant Glow",
    text: "HydraFacial at Siama Skincare | Instant Glow, Deep Cleansing & Hydration Facial",
    videoId: "7mxgOzsRxbA",
  },
  {
    name: "Hydracial",
    text: "Transform your Skin with our Game Changing #Hydracial for men!",
    videoId: "zfCzxdo2nSQ",
  },
];

interface VideoCardProps {
  item: Testimonial;
  isPlaying: boolean;
  onPlay: (videoId: string) => void;
  setIframeRef: (videoId: string, iframe: HTMLIFrameElement | null) => void;
  videoKey: number;
}

function VideoCard({ item, isPlaying, onPlay, setIframeRef, videoKey }: VideoCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const thumbnailUrl = `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const handlePlay = () => {
    onPlay(item.videoId);
  };

  // Register iframe ref with parent when playing
  useEffect(() => {
    if (isPlaying && iframeRef.current) {
      setIframeRef(item.videoId, iframeRef.current);
    } else {
      // Clear ref when not playing
      setIframeRef(item.videoId, null);
    }
    return () => {
      // Cleanup: clear ref on unmount
      setIframeRef(item.videoId, null);
    };
  }, [item.videoId, isPlaying, setIframeRef]);

  // Stop video when isPlaying becomes false
  useEffect(() => {
    if (!isPlaying && iframeRef.current) {
      const iframe = iframeRef.current;
      try {
        // Send stop commands via YouTube IFrame API
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'stopVideo', args: '' }),
          '*'
        );
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
          '*'
        );
        // Immediately clear the src to stop playback
        iframe.src = 'about:blank';
      } catch (error) {
        // Fallback: clear src
        try {
          iframe.src = 'about:blank';
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }, [isPlaying]);

  return (
    <div className={styles.videoCard}>
      <div className={styles.videoWrapper}>
        {!isPlaying ? (
          <div className={styles.videoThumbnail} onClick={handlePlay}>
            <Image
              src={thumbnailUrl}
              alt={`Testimonial from ${item.name}`}
              fill
              className={styles.thumbnailImage}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
            <div className={styles.playButtonOverlay}>
              <button className={styles.playButton} aria-label="Play video">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="30" cy="30" r="30" fill="rgba(0, 0, 0, 0.7)" />
                  <path
                    d="M24 20L24 40L40 30L24 20Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <iframe
            key={`${item.videoId}-${videoKey}`}
            ref={iframeRef}
            className={styles.video}
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=0&loop=1&playlist=${item.videoId}&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${origin}`}
            allowFullScreen
            title={`Testimonial from ${item.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            loading="lazy"
            frameBorder="0"
          />
        )}
      </div>
      <div className={styles.videoInfo}>
        <p className={styles.testimonialText}>{item.text}</p>
        <p className={styles.testimonialName}>{item.name}</p>
      </div>
    </div>
  );
}

export default function TestimonialVideo() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState(0);
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());

  const handleVideoPlay = (videoId: string) => {
    // If clicking the same video that's playing, pause it
    if (playingVideoId === videoId) {
      // Stop the current video aggressively
      const currentIframe = iframeRefs.current.get(videoId);
      if (currentIframe) {
        try {
          // Send stop commands with proper JSON format
          currentIframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'stopVideo', args: '' }),
            '*'
          );
          currentIframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
            '*'
          );
          // Immediately clear src to stop playback
          currentIframe.src = 'about:blank';
        } catch (error) {
          // If postMessage fails, just clear src
          try {
            currentIframe.src = 'about:blank';
          } catch (e) {
            // Ignore errors
          }
        }
      }
      // Clear refs and state immediately
      iframeRefs.current.clear();
      setPlayingVideoId(null);
      setVideoKey(prev => prev + 1);
      return;
    }

    // Stop ALL videos first (including the currently playing one)
    iframeRefs.current.forEach((iframe) => {
      if (iframe) {
        try {
          // Send stop commands with proper JSON format
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'stopVideo', args: '' }),
            '*'
          );
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
            '*'
          );
          // Immediately clear src to stop playback
          iframe.src = 'about:blank';
        } catch (error) {
          // If postMessage fails, just clear src
          try {
            iframe.src = 'about:blank';
          } catch (e) {
            // Ignore errors
          }
        }
      }
    });

    // Clear refs and stop all videos
    iframeRefs.current.clear();
    setPlayingVideoId(null);
    // Force remount by changing key
    setVideoKey(prev => prev + 1);

    // Start new video after a brief delay
    setTimeout(() => {
      setPlayingVideoId(videoId);
    }, 150);
  };

  // Register iframe ref callback
  const setIframeRef = (videoId: string, iframe: HTMLIFrameElement | null) => {
    if (iframe) {
      iframeRefs.current.set(videoId, iframe);
    } else {
      iframeRefs.current.delete(videoId);
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  // Extract video ID from YouTube Shorts URL
  const extractVideoIdFromUrl = (url: string): string | null => {
    // Handle various YouTube URL formats
    const patterns = [
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  useEffect(() => {
    async function fetchYouTubeVideos() {
      try {
        // If manual video IDs are provided in config, use them
        if (manualVideoIds && manualVideoIds.length > 0) {
          const manualTestimonialsPromises = manualVideoIds.map(async (videoIdOrUrl, index) => {
            const videoId = extractVideoIdFromUrl(videoIdOrUrl) || videoIdOrUrl;
            
            if (!videoId) {
              return null;
            }

            // Fetch video details from YouTube API
            try {
              const response = await fetch(`/api/youtube-video-details?videoId=${videoId}`);
              const data = await response.json();
              
              if (data.video) {
                return {
                  name: data.video.name || `Client ${index + 1}`,
                  text: data.video.text || data.video.title || "Watch this testimonial video",
                  videoId: videoId,
                };
              }
            } catch (error) {
              console.error(`Error fetching details for video ${videoId}:`, error);
            }

            return {
              name: `Client ${index + 1}`,
              text: "Watch this testimonial video",
              videoId: videoId,
            };
          });

          const manualTestimonialsResults = await Promise.all(manualTestimonialsPromises);

          // Filter out null values
          const validTestimonials: Testimonial[] = manualTestimonialsResults.filter(
            (t): t is Testimonial => t !== null
          );

          if (validTestimonials.length > 0) {
            setTestimonials(validTestimonials);
            setLoading(false);
            return;
          }
        }

        // Otherwise, fetch from channel
        const response = await fetch("/api/youtube-shorts");
        const data = await response.json();

        if (data.videos && data.videos.length > 0) {
          // Remove duplicates based on videoId
          const uniqueVideos = data.videos.reduce((acc: YouTubeVideo[], video: YouTubeVideo) => {
            if (!acc.find(v => v.videoId === video.videoId)) {
              acc.push(video);
            }
            return acc;
          }, []);

          // Transform YouTube videos into testimonials format
          const transformedTestimonials: Testimonial[] = uniqueVideos.map(
            (video: YouTubeVideo, index: number) => {
              // Try to extract name from title (look for patterns like "by Name", "from Name", etc.)
              let name = `Client ${index + 1}`;
              const namePatterns = [
                /(?:by|from|with|by\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
                /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+(?:says|shares|testimonial))/i,
                /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):/,
              ];

              for (const pattern of namePatterns) {
                const match = video.title.match(pattern);
                if (match && match[1]) {
                  name = match[1].trim();
                  break;
                }
              }

              // Extract testimonial text from description or title
              // Prefer description, but use title if description is empty
              let text = "";
              if (video.description && video.description.trim().length > 0) {
                // Get first meaningful sentence from description
                const firstSentence = video.description
                  .split(/[.!?]\s+/)
                  .find((s: string) => s.length > 20) || video.description.split("\n")[0];
                text = firstSentence.substring(0, 120).trim();
                if (firstSentence.length > 120) text += "...";
              } else {
                // Use title as testimonial text
                text = video.title.substring(0, 100).trim();
                if (video.title.length > 100) text += "...";
              }

              return {
                name,
                text: text || "Watch this testimonial video",
                videoId: video.videoId,
              };
            }
          );

          setTestimonials(transformedTestimonials);
        } else {
          // Use fallback if no videos found
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        // Use fallback on error
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    }

    fetchYouTubeVideos();
  }, []);

  if (loading) {
    return (
      <div className={styles.testimonialVideo}>
        <div className={styles.container}>
          <h2 className={styles.title}>Client Testimonials</h2>
          <div className={styles.loadingState}>Loading testimonials...</div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className={styles.testimonialVideo}>
        <div className={styles.container}>
          <h2 className={styles.title}>Client Testimonials</h2>
          <div className={styles.errorState}>
            No testimonials available at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <div >
        <div >
          <h2 className={styles.title}>Client Testimonials</h2>
          <Carousel
            responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={12000}
          arrows={false}
          swipeable={true}
          draggable={true}
          showDots={true}
          containerClass={styles.carouselContainer}
          itemClass={styles.carouselItem}
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
        >
          {testimonials.map((item) => (
            <VideoCard
              key={item.videoId}
              item={item}
              isPlaying={playingVideoId === item.videoId}
              onPlay={handleVideoPlay}
              setIframeRef={setIframeRef}
              videoKey={videoKey}
            />
          ))}
        </Carousel>
      </div>
    </div>
    </div>
  );
}



