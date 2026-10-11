"use client";

import { useEffect, useRef, useState } from "react";

import { Bug, Camera, CircleStop, Eye, Pause, Play, ScanFace } from "lucide-react";

import { type MonitorIssue, useAttentionDetection } from "../hook/useAttentionDetection";

// =========================================================
// DEBUG UI
//
// true  = show debug panel
// false = hide debug panel
// =========================================================

const SHOW_DEBUG_UI = true;

// =========================================================
// COMPONENT
// =========================================================

export default function AttentionMonitoringWorkspace({ token }: { token: string }) {
  const demoVideoRef = useRef<HTMLVideoElement>(null);

  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const cameraStreamRef = useRef<MediaStream | null>(null);

  const pausedByAttentionRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const [isDetecting, setIsDetecting] = useState(false);

  const { isReady, issue, showWarning, debugInfo } = useAttentionDetection({
    token,
    videoRef: cameraVideoRef,
    isDetecting,
  });

  // =======================================================
  // DEMO VIDEO PLAY / PAUSE
  // =======================================================

  const handlePlayPause = async () => {
    const video = demoVideoRef.current;

    if (!video) return;

    if (video.paused) {
      await video.play();

      return;
    }

    video.pause();
  };

  // =======================================================
  // START DETECTION
  // =======================================================

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

  // =======================================================
  // STOP DETECTION
  // =======================================================

  const stopDetection = () => {
    setIsDetecting(false);

    cameraStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    cameraStreamRef.current = null;

    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }

    // Resume demo video only if
    // attention monitoring paused it.
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

  // =======================================================
  // ATTENTION VIDEO CONTROL
  //
  // RAW detection muna.
  //
  // LOOKING      -> play/resume
  // anything else -> pause
  // =======================================================

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

  // =======================================================
  // CLEANUP CAMERA
  // =======================================================

  useEffect(() => {
    return () => {
      cameraStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  // =======================================================
  // UI
  // =======================================================

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-72px)] max-w-[1280px] flex-col px-5 py-5 sm:px-8 lg:h-[calc(100dvh-72px)] lg:overflow-hidden lg:px-10">
      {/* ================================================= */}
      {/* HEADING */}
      {/* ================================================= */}

      <header className="shrink-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <Eye size={13} />
          Smart Attention Monitoring
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#303234] sm:text-4xl dark:text-slate-100">
          Video Attention <span className="text-[#0a9b87] dark:text-emerald-400">Checker</span>
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 dark:text-slate-400">Play a video while monitoring participant attention through the camera.</p>
      </header>

      {/* ================================================= */}
      {/* WORKSPACE */}
      {/* ================================================= */}

      <div className="mt-5 grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
        {/* =============================================== */}
        {/* DEMO VIDEO */}
        {/* =============================================== */}

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
            {/* PLAY / PAUSE */}

            <button
              type="button"
              onClick={handlePlayPause}
              className="inline-flex items-center gap-2 rounded-xl bg-[#07594b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#064c40] dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {isPlaying ? <Pause size={17} /> : <Play size={17} />}

              {isPlaying ? "Pause Video" : "Play Video"}
            </button>

            {/* START / STOP DETECTION */}

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

        {/* =============================================== */}
        {/* RIGHT SIDE */}
        {/* =============================================== */}

        <aside className="flex min-h-0 flex-col gap-4">
          {/* ============================================= */}
          {/* CAMERA PREVIEW */}
          {/* ============================================= */}

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

          {/* ============================================= */}
          {/* ATTENTION STATUS */}
          {/* ============================================= */}

          <section className={`shrink-0 rounded-2xl border p-4 ${getStatusClasses(issue, isDetecting, isReady)}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ScanFace size={16} />

                <p className="text-[11px] font-bold uppercase tracking-[0.14em]">Attention Status</p>
              </div>

              <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(issue, isDetecting, isReady)}`} />
            </div>

            <p className="mt-3 text-sm font-bold">{getAttentionLabel(issue, isDetecting, isReady)}</p>

            <p className="mt-1 text-xs opacity-75">{getAttentionMessage(issue, isDetecting, isReady)}</p>
          </section>

          {/* ============================================= */}
          {/* DEBUG UI */}
          {/* ============================================= */}

          {SHOW_DEBUG_UI && (
            <section className="shrink-0 rounded-2xl border border-violet-200 bg-violet-50/70 p-4 text-violet-950 shadow-sm dark:border-violet-900 dark:bg-violet-950/20 dark:text-violet-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bug size={16} />

                  <h2 className="text-xs font-bold uppercase tracking-[0.12em]">Detection Debug</h2>
                </div>

                <span className="text-[10px] font-medium opacity-60">RAW</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {/* FACE COUNT */}

                <DebugValue label="Face Count" value={debugInfo.faceCount} good={debugInfo.faceCount === 1} />

                {/* RAW ISSUE */}

                <DebugValue label="Raw Issue" value={debugInfo.issue} good={debugInfo.issue === "LOOKING"} />

                {/* LEFT EYE */}

                <DebugValue label="Left Eye" value={debugInfo.leftEyeOpen ? "OPEN" : "CLOSED"} good={debugInfo.leftEyeOpen} />

                {/* RIGHT EYE */}

                <DebugValue label="Right Eye" value={debugInfo.rightEyeOpen ? "OPEN" : "CLOSED"} good={debugInfo.rightEyeOpen} />

                {/* LEFT BLINK SCORE */}

                <DebugValue label="Left Blink" value={formatDebugNumber(debugInfo.leftBlink)} />

                {/* RIGHT BLINK SCORE */}

                <DebugValue label="Right Blink" value={formatDebugNumber(debugInfo.rightBlink)} />

                {/* GAZE X */}

                <DebugValue label="Gaze X" value={formatDebugNumber(debugInfo.gazeX)} />

                {/* GAZE Y */}

                <DebugValue label="Gaze Y" value={formatDebugNumber(debugInfo.gazeY)} />

                {/* IRIS RESULT */}

                <DebugValue label="Iris" value={debugInfo.irisOnScreen ? "ON SCREEN" : "AWAY"} good={debugInfo.irisOnScreen} />

                {/* BLENDSHAPE RESULT */}

                <DebugValue label="Blendshape" value={debugInfo.blendshapeOnScreen ? "ON SCREEN" : "AWAY"} good={debugInfo.blendshapeOnScreen} />

                {/* STRONGEST EYE LOOK */}

                <DebugValue label="Eye Look" value={formatDebugNumber(debugInfo.strongestEyeLook)} />
              </div>

              {/* REASON */}

              <div className="mt-3 rounded-lg bg-white/60 px-3 py-2 text-[11px] leading-4 dark:bg-slate-950/30">
                <span className="font-semibold">Reason:</span> {debugInfo.note ?? "-"}
              </div>
            </section>
          )}

          {/* ============================================= */}
          {/* DETECTION RULES */}
          {/* ============================================= */}

          <section className="min-h-0 flex-1 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-sm font-bold text-gray-800 dark:text-slate-100">Detection Rules</h2>

            <ul className="mt-4 space-y-2.5 text-xs leading-5 text-gray-500 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>

                <span>Exactly one face must be visible.</span>
              </li>

              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>

                <span>Both eyes must be open.</span>
              </li>

              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>

                <span>Iris position must remain inside the allowed gaze range.</span>
              </li>

              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>

                <span>MediaPipe eye-look blendshapes provide a second gaze check.</span>
              </li>

              <li className="flex gap-2">
                <span className="text-[#0a9b87]">•</span>

                <span>Detection runs directly in the browser.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}

// =========================================================
// DEBUG VALUE
// =========================================================

function DebugValue({ label, value, good }: { label: string; value: string | number; good?: boolean }) {
  return (
    <div className="rounded-lg bg-white/60 px-2.5 py-2 dark:bg-slate-950/30">
      <p className="text-[9px] font-semibold uppercase tracking-wide opacity-50">{label}</p>

      <p className={good === undefined ? "mt-0.5 font-bold" : good ? "mt-0.5 font-bold text-emerald-600 dark:text-emerald-400" : "mt-0.5 font-bold text-red-600 dark:text-red-400"}>
        {value}
      </p>
    </div>
  );
}

// =========================================================
// FORMAT DEBUG NUMBER
// =========================================================

function formatDebugNumber(value: number) {
  return value.toFixed(3);
}

// =========================================================
// ATTENTION LABEL
// =========================================================

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

    case "CAMERA_OFF":
      return "Camera Off";

    case "ERROR":
      return "Detection Error";

    default:
      return "Loading";
  }
}

// =========================================================
// ATTENTION MESSAGE
// =========================================================

function getAttentionMessage(issue: MonitorIssue, isDetecting: boolean, isReady: boolean) {
  if (!isReady) {
    return "Preparing face detection model.";
  }

  if (!isDetecting) {
    return "Start detection to begin attention monitoring.";
  }

  switch (issue) {
    case "LOOKING":
      return "Both eyes are open and looking at the screen.";

    case "LOOKING_AWAY":
      return "Eyes are not currently looking at the screen.";

    case "NO_FACE":
      return "No face is visible in the camera.";

    case "MULTIPLE_FACES":
      return "More than one face is visible.";

    case "CAMERA_OFF":
      return "Camera is unavailable.";

    case "ERROR":
      return "Attention detection encountered an error.";

    default:
      return "Analyzing participant attention.";
  }
}

// =========================================================
// STATUS CLASSES
// =========================================================

function getStatusClasses(issue: MonitorIssue, isDetecting: boolean, isReady: boolean) {
  if (!isReady || !isDetecting) {
    return "border-gray-200 bg-gray-50 text-gray-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300";
  }

  if (issue === "LOOKING") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400";
  }

  return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400";
}

// =========================================================
// STATUS DOT
// =========================================================

function getStatusDot(issue: MonitorIssue, isDetecting: boolean, isReady: boolean) {
  if (!isReady || !isDetecting) {
    return "bg-gray-400";
  }

  if (issue === "LOOKING") {
    return "bg-emerald-500";
  }

  return "bg-red-500";
}
