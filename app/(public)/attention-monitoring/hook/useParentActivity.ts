"use client";

import { useEffect, type RefObject } from "react";

// Limit session activity messages to one every 15 seconds.
const ACTIVITY_INTERVAL_MS = 15_000;
const PARENT_ORIGIN = "https://cagabay-web-recode-git-refacto-6a6776-conding-students-projects.vercel.app";

export function useParentActivity(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    if (window.parent === window) return;

    let lastSentAt = -Infinity;
    const notifyActivity = () => {
      if (document.visibilityState !== "visible") return;
      const now = performance.now();
      if (now - lastSentAt < ACTIVITY_INTERVAL_MS) return;
      window.parent.postMessage({ type: "gabaymeet:activity" }, PARENT_ORIGIN);
      lastSentAt = now;
    };

    const handleInteraction = (event: Event) => {
      if (event.isTrusted) notifyActivity();
    };
    const video = videoRef.current;
    const handlePlayback = () => {
      if (video && !video.paused && !video.ended) notifyActivity();
    };
    notifyActivity();
    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    video?.addEventListener("timeupdate", handlePlayback);

    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      video?.removeEventListener("timeupdate", handlePlayback);
    };
  }, [videoRef]);
}
