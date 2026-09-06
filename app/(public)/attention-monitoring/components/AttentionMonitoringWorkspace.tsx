"use client";

import { useEffect, useRef, useState } from "react";

import { Camera, CircleStop, Eye, Pause, Play, ScanFace } from "lucide-react";

import { MonitorIssue,useAttentionDetection } from "../hook/useAttentionDetection";



export default function AttentionMonitoringWorkspace() {
  const demoVideoRef = useRef<HTMLVideoElement>(null);

  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const cameraStreamRef = useRef<MediaStream | null>(null);

  const pausedByAttentionRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const [isDetecting, setIsDetecting] = useState(false);

  const { isReady, issue, showWarning, warningSeconds, debugInfo } = useAttentionDetection({
    videoRef: cameraVideoRef,
    isDetecting,
  });

  // Raw issue exists but confirmed issue
  // is still LOOKING = currently checking.
  const isChecking = isDetecting && issue === "LOOKING" && debugInfo.issue !== "LOOKING";

  const checkingIssue = isChecking ? debugInfo.issue : null;

  const handlePlayPause = async () => {
    const video = demoVideoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      await video.play();
      return;
    }

    video.pause();
  };

  const startDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      cameraStreamRef.current = stream;

      const cameraVideo = cameraVideoRef.current;

      if (cameraVideo) {
        cameraVideo.srcObject = stream;

        await cameraVideo.play();
      }

      setIsDetecting(true);
    } catch (error) {
      console.error("Unable to access camera:", error);
    }
  };

  const stopDetection = () => {
    setIsDetecting(false);

    cameraStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    cameraStreamRef.current = null;

    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }

    // Resume only if attention monitoring
    // was the one that paused the video.
    if (pausedByAttentionRef.current) {
      demoVideoRef.current?.play().catch(() => {});

      pausedByAttentionRef.current = false;
    }
  };

  const handleDetection = () => {
    if (isDetecting) {
      stopDetection();
      return;
    }

    startDetection();
  };

  // Confirmed attention issue -> pause.
  // Attentive again -> resume.
  useEffect(() => {
    const video = demoVideoRef.current;

    if (!video || !isDetecting) {
      return;
    }

    if (showWarning && issue !== "LOOKING") {
      if (!video.paused) {
        video.pause();

        pausedByAttentionRef.current = true;
      }

      return;
    }

    if (issue === "LOOKING" && pausedByAttentionRef.current) {
      video.play().catch(() => {});

      pausedByAttentionRef.current = false;
    }
  }, [issue, showWarning, isDetecting]);

  useEffect(() => {
    return () => {
      cameraStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-72px)] max-w-[1280px] flex-col px-5 py-5 sm:px-8 lg:h-[calc(100dvh-72px)] lg:overflow-hidden lg:px-10">
      {/* Heading */}
      <header className="shrink-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <Eye size={13} />
          Smart Attention Monitoring
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#303234] sm:text-4xl dark:text-slate-100">
          Video Attention <span className="text-[#0a9b87] dark:text-emerald-400">Checker</span>
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 dark:text-slate-400">
          Play a video while monitoring participant attention through the camera. The video automatically pauses when a confirmed attention issue is detected.
        </p>
      </header>

      {/* Workspace */}
      <div className="mt-5 grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
        {/* Demo Video */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex shrink-0 items-center justify-between px-2 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-slate-100">Attention Monitoring Demo</h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Video activity used for the monitoring demonstration.</p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Demo
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-black">
            <video
              ref={demoVideoRef}
              src="/videos/Sample_animated_video.mp4"
              controls
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="h-full w-full object-contain"
            />

            {showWarning && (
              <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-red-600/90 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
                {getAttentionLabel(issue)}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-3 pt-3">
            <button
              type="button"
              onClick={handlePlayPause}
              className="inline-flex items-center gap-2 rounded-xl bg-[#07594b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#064c40] dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {isPlaying ? <Pause size={17} /> : <Play size={17} />}

              {isPlaying ? "Pause Video" : "Play Video"}
            </button>

            <button
              type="button"
              onClick={handleDetection}
              className={
                isDetecting
                  ? "inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  : "inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }
            >
              {isDetecting ? <CircleStop size={17} /> : <Camera size={17} />}

              {isDetecting ? "Stop Detection" : "Start Detection"}
            </button>
          </div>
        </section>

        {/* Right Side */}
        <aside className="flex min-h-0 flex-col gap-4">
          {/* Camera Preview */}
          <section className="shrink-0 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mb-3 flex items-center gap-2">
              <Camera size={17} className="text-[#07594b] dark:text-emerald-400" />

              <h2 className="text-sm font-bold text-gray-800 dark:text-slate-100">Camera Preview</h2>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <video ref={cameraVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />

              {!isDetecting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400">
                  <Camera size={25} />

                  <p className="mt-2 text-xs">Camera is off</p>
                </div>
              )}
            </div>
          </section>

          {/* Attention Status */}
          <section className={`shrink-0 rounded-2xl border p-4 ${getStatusClasses(issue, isDetecting, isReady, isChecking)}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ScanFace size={16} />

                <p className="text-[11px] font-bold uppercase tracking-[0.14em]">Attention Status</p>
              </div>

              <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(issue, isDetecting, isReady, isChecking)}`} />
            </div>

            <p className="mt-3 text-sm font-bold">{isChecking ? "Checking" : getAttentionLabel(issue, isDetecting, isReady)}</p>

            <p className="mt-1 text-xs opacity-75">{isChecking ? getCheckingMessage(checkingIssue) : getAttentionMessage(issue, isDetecting, isReady)}</p>

            {isChecking && checkingIssue && <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide opacity-70">Detected: {getRawIssueLabel(checkingIssue)}</p>}

            {showWarning && <p className="mt-2 text-[11px] font-medium">Detected for {warningSeconds}s</p>}
          </section>

          {/* Rules */}
          {/* Detection Rules */}
          <section className="min-h-0 flex-1 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-sm font-bold text-gray-800 dark:text-slate-100">Detection Rules</h2>

            <ul className="mt-4 space-y-2.5 text-xs leading-5 text-gray-500 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>
                <span>Closed eyes are checked before being confirmed.</span>
              </li>

              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>
                <span>Normal blinks do not immediately pause the video.</span>
              </li>

              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>
                <span>Looking away must remain detected before triggering.</span>
              </li>

              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>
                <span>No face and multiple faces are also monitored.</span>
              </li>

              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>
                <span>Detection is processed in the browser.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}

function getAttentionLabel(issue: MonitorIssue, isDetecting = true, isReady = true) {
  if (!isReady) {
    return "Loading MediaPipe";
  }

  if (!isDetecting) {
    return "Detection Inactive";
  }

  switch (issue) {
    case "LOOKING":
      return "Attentive";

    case "LOOKING_AWAY":
      return "Looking Away";

    case "NO_FACE":
      return "No Face Detected";

    case "MULTIPLE_FACES":
      return "Multiple Faces";

    case "SLEEPING":
      return "Eyes Closed / Sleeping";

    case "CAMERA_OFF":
      return "Camera Off";

    case "ERROR":
      return "Detection Error";

    default:
      return "Checking";
  }
}

function getAttentionMessage(issue: MonitorIssue, isDetecting: boolean, isReady: boolean) {
  if (!isReady) {
    return "Preparing face and hand detection models.";
  }

  if (!isDetecting) {
    return "Start detection to begin attention monitoring.";
  }

  switch (issue) {
    case "LOOKING":
      return "Eyes are open and participant is attentive.";

    case "LOOKING_AWAY":
      return "Participant is looking away from the screen.";

    case "NO_FACE":
      return "No face is visible in the camera.";

    case "MULTIPLE_FACES":
      return "More than one face is visible.";

    case "SLEEPING":
      return "Eyes remained closed long enough to trigger the warning.";

    case "CAMERA_OFF":
      return "Camera is unavailable.";

    case "ERROR":
      return "Attention detection encountered an error.";

    default:
      return "Analyzing participant attention.";
  }
}

function getCheckingMessage(issue: MonitorIssue | null) {
  switch (issue) {
    case "SLEEPING":
      return "Eyes appear closed. Checking if they remain closed...";

    case "LOOKING_AWAY":
      return "Possible looking away. Checking attention...";

    case "NO_FACE":
      return "Face temporarily not detected. Checking...";

    case "MULTIPLE_FACES":
      return "Multiple faces detected. Checking...";

    case "CAMERA_OFF":
      return "Camera signal may be unavailable. Checking...";

    case "ERROR":
      return "Possible detection issue. Checking...";

    default:
      return "Checking attention...";
  }
}

function getRawIssueLabel(issue: MonitorIssue) {
  switch (issue) {
    case "SLEEPING":
      return "Eyes Closed";

    case "LOOKING_AWAY":
      return "Looking Away";

    case "NO_FACE":
      return "No Face";

    case "MULTIPLE_FACES":
      return "Multiple Faces";

    case "CAMERA_OFF":
      return "Camera Off";

    case "ERROR":
      return "Error";

    default:
      return "Attentive";
  }
}

function getStatusClasses(issue: MonitorIssue, isDetecting: boolean, isReady: boolean, isChecking: boolean) {
  if (!isReady || !isDetecting) {
    return "border-gray-200 bg-gray-50 text-gray-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300";
  }

  if (isChecking) {
    return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
  }

  if (issue === "LOOKING") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400";
  }

  return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400";
}

function getStatusDot(issue: MonitorIssue, isDetecting: boolean, isReady: boolean, isChecking: boolean) {
  if (!isReady || !isDetecting) {
    return "bg-gray-400";
  }

  if (isChecking) {
    return "bg-amber-500";
  }

  if (issue === "LOOKING") {
    return "bg-emerald-500";
  }

  return "bg-red-500";
}
