"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// =========================================================
// ATTENTION CONFIG
//
// Simple muna:
// 1. Exactly one face.
// 2. Both eyes must be open.
// 3. Eyes must be looking at screen.
//
// Gaze uses:
// - Iris landmarks
// - MediaPipe eye-look blendshapes
// =========================================================

const ATTENTION_CONFIG = {
  face: {
    // 2 ang ipapadetect para malaman natin
    // kung may extra face.
    maxFacesToDetect: 1,

    detectionConfidence: 0.5,
    presenceConfidence: 0.5,
    trackingConfidence: 0.5,
  },

  eyes: {
    // MediaPipe blink score.
    //
    // Higher score = mas mukhang closed/blinking.
    blinkThreshold: 1,

    // Iris position inside the eye.
    //
    // 0 = left/top
    // 1 = right/bottom
    gazeMinX: 0.35,
    gazeMaxX: 0.65,

    gazeMinY: 0.3,
    gazeMaxY: 0.8,

    // MediaPipe eye-look blendshape.
    //
    // Kapag isa sa eyeLook scores ay lumampas dito,
    // considered strong looking-away signal.
    lookAwayBlendshapeThreshold: 0.45,
  },

  mediapipe: {
    useGPU: true,

    wasmUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",

    faceModelUrl: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
  },
} as const;

// =========================================================
// TYPES
// =========================================================

export type MonitorIssue = "LOADING" | "LOOKING" | "NO_FACE" | "MULTIPLE_FACES" | "LOOKING_AWAY" | "CAMERA_OFF" | "ERROR";

type Landmark = {
  x: number;
  y: number;
  z?: number;
};

type BlendshapeCategory = {
  categoryName: string;
  score: number;
};

type FaceResult = {
  faceLandmarks?: Landmark[][];

  faceBlendshapes?: {
    categories?: BlendshapeCategory[];
  }[];
};

type FaceLandmarkerLike = {
  detectForVideo: (video: HTMLVideoElement, timestamp: number) => FaceResult;

  close?: () => void;
};

export type DebugInfo = {
  issue: MonitorIssue;

  faceCount: number;

  leftEyeOpen: boolean;
  rightEyeOpen: boolean;

  irisOnScreen: boolean;
  blendshapeOnScreen: boolean;

  gazeX: number;
  gazeY: number;

  leftBlink: number;
  rightBlink: number;

  strongestEyeLook: number;

  note?: string;
};

interface UseAttentionDetectionParams {
  token: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  isDetecting: boolean;
}

// =========================================================
// HOOK
// =========================================================

export function useAttentionDetection({ token, videoRef, isDetecting }: UseAttentionDetectionParams) {
  const faceLandmarkerRef = useRef<FaceLandmarkerLike | null>(null);

  const animationFrameRef = useRef<number | null>(null);

  const lastVideoTimeRef = useRef(-1);

  const [isReady, setIsReady] = useState(false);

  const [issue, setIssue] = useState<MonitorIssue>("LOADING");

  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    issue: "LOADING",

    faceCount: 0,

    leftEyeOpen: false,
    rightEyeOpen: false,

    irisOnScreen: false,
    blendshapeOnScreen: false,

    gazeX: 0,
    gazeY: 0,

    leftBlink: 0,
    rightBlink: 0,

    strongestEyeLook: 0,

    note: "Loading MediaPipe",
  });

  // =====================================================
  // LOAD MEDIAPIPE
  // =====================================================

  useEffect(() => {
    if (!token.trim()) return;

    let mounted = true;

    async function loadMediaPipe() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");

        const vision = await FilesetResolver.forVisionTasks(ATTENTION_CONFIG.mediapipe.wasmUrl);

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: ATTENTION_CONFIG.mediapipe.faceModelUrl,

            delegate: ATTENTION_CONFIG.mediapipe.useGPU ? "GPU" : "CPU",
          },

          runningMode: "VIDEO",

          numFaces: ATTENTION_CONFIG.face.maxFacesToDetect,

          minFaceDetectionConfidence: ATTENTION_CONFIG.face.detectionConfidence,

          minFacePresenceConfidence: ATTENTION_CONFIG.face.presenceConfidence,

          minTrackingConfidence: ATTENTION_CONFIG.face.trackingConfidence,

          // Needed for:
          //
          // eyeBlinkLeft
          // eyeBlinkRight
          // eyeLookIn...
          // eyeLookOut...
          // eyeLookUp...
          // eyeLookDown...
          outputFaceBlendshapes: true,

          outputFacialTransformationMatrixes: false,
        });

        faceLandmarkerRef.current = faceLandmarker as FaceLandmarkerLike;

        if (!mounted) return;

        setIsReady(true);
        setIssue("LOOKING");

        setDebugInfo({
          issue: "LOOKING",

          faceCount: 0,

          leftEyeOpen: false,
          rightEyeOpen: false,

          irisOnScreen: false,
          blendshapeOnScreen: false,

          gazeX: 0,
          gazeY: 0,

          leftBlink: 0,
          rightBlink: 0,

          strongestEyeLook: 0,

          note: "MediaPipe ready",
        });
      } catch (error) {
        console.warn("MediaPipe loading failed:", error);

        if (!mounted) return;

        setIssue("ERROR");

        setDebugInfo({
          issue: "ERROR",

          faceCount: 0,

          leftEyeOpen: false,
          rightEyeOpen: false,

          irisOnScreen: false,
          blendshapeOnScreen: false,

          gazeX: 0,
          gazeY: 0,

          leftBlink: 0,
          rightBlink: 0,

          strongestEyeLook: 0,

          note: "MediaPipe failed to load",
        });
      }
    }

    loadMediaPipe();

    return () => {
      mounted = false;

      faceLandmarkerRef.current?.close?.();

      faceLandmarkerRef.current = null;
    };
  }, [token]);

  // =====================================================
  // RESET WHEN DETECTION STOPS
  // =====================================================

  useEffect(() => {
    if (isDetecting) return;

    lastVideoTimeRef.current = -1;

    if (isReady) {
      setIssue("LOOKING");

      setDebugInfo({
        issue: "LOOKING",

        faceCount: 0,

        leftEyeOpen: false,
        rightEyeOpen: false,

        irisOnScreen: false,
        blendshapeOnScreen: false,

        gazeX: 0,
        gazeY: 0,

        leftBlink: 0,
        rightBlink: 0,

        strongestEyeLook: 0,

        note: "Detection inactive",
      });
    }
  }, [isDetecting, isReady]);

  // =====================================================
  // DETECTION LOOP
  // =====================================================

  useEffect(() => {
    if (!token.trim() || !isDetecting || !isReady) {
      return;
    }

    lastVideoTimeRef.current = -1;

    function nextFrame() {
      animationFrameRef.current = requestAnimationFrame(detectLoop);
    }

    function detectLoop() {
      const video = videoRef.current;

      const faceLandmarker = faceLandmarkerRef.current;

      // =============================================
      // CAMERA CHECK
      // =============================================

      const stream = video?.srcObject instanceof MediaStream ? video.srcObject : null;

      const cameraTrack = stream?.getVideoTracks()[0];

      if (!cameraTrack || cameraTrack.readyState !== "live") {
        setIssue("CAMERA_OFF");

        setDebugInfo({
          issue: "CAMERA_OFF",

          faceCount: 0,

          leftEyeOpen: false,
          rightEyeOpen: false,

          irisOnScreen: false,
          blendshapeOnScreen: false,

          gazeX: 0,
          gazeY: 0,

          leftBlink: 0,
          rightBlink: 0,

          strongestEyeLook: 0,

          note: "Camera is off",
        });

        nextFrame();

        return;
      }

      if (!video || !faceLandmarker || video.readyState < 2) {
        nextFrame();

        return;
      }

      try {
        // Analyze only new video frames.
        if (video.currentTime === lastVideoTimeRef.current) {
          nextFrame();

          return;
        }

        lastVideoTimeRef.current = video.currentTime;

        const result = faceLandmarker.detectForVideo(video, performance.now());

        const analysis = analyzeFace(result);

        // RAW RESULT LANG MUNA.
        //
        // Walang 3-second timer.
        // Walang recovery.
        // Walang calibration.
        setIssue(analysis.issue);

        setDebugInfo(analysis);
      } catch (error) {
        console.warn("Attention detection failed:", error);

        setIssue("ERROR");

        setDebugInfo({
          issue: "ERROR",

          faceCount: 0,

          leftEyeOpen: false,
          rightEyeOpen: false,

          irisOnScreen: false,
          blendshapeOnScreen: false,

          gazeX: 0,
          gazeY: 0,

          leftBlink: 0,
          rightBlink: 0,

          strongestEyeLook: 0,

          note: "Attention detection failed",
        });
      }

      nextFrame();
    }

    nextFrame();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = null;
    };
  }, [token, isDetecting, isReady, videoRef]);

  // =====================================================
  // SIMPLE RETURN
  // =====================================================

  const showWarning = issue !== "LOOKING" && issue !== "LOADING";

  return {
    isReady,

    issue,

    // Immediate/raw muna.
    showWarning,

    // Wala pa tayong timer.
    warningSeconds: 0,

    debugInfo,
  };
}

// =========================================================
// ANALYZE FACE
// =========================================================

function analyzeFace(result: FaceResult): DebugInfo {
  const faces = result.faceLandmarks ?? [];

  // =====================================================
  // RULE 1:
  // EXACTLY ONE FACE
  // =====================================================

  if (faces.length === 0) {
    return emptyResult("NO_FACE", 0, "No face detected");
  }

  if (faces.length > 1) {
    return emptyResult("MULTIPLE_FACES", faces.length, "More than one face detected");
  }

  const face = faces[0];

  if (!face) {
    return emptyResult("NO_FACE", 0, "No face detected");
  }

  // =====================================================
  // EYE + IRIS LANDMARKS
  // =====================================================

  const leftEyeOuter = face[33];

  const leftEyeInner = face[133];

  const rightEyeOuter = face[263];

  const rightEyeInner = face[362];

  const leftEyeTop = face[159];

  const leftEyeBottom = face[145];

  const rightEyeTop = face[386];

  const rightEyeBottom = face[374];

  const leftIris = face[468];

  const rightIris = face[473];

  if (!leftEyeOuter || !leftEyeInner || !rightEyeOuter || !rightEyeInner || !leftEyeTop || !leftEyeBottom || !rightEyeTop || !rightEyeBottom || !leftIris || !rightIris) {
    return emptyResult("LOOKING_AWAY", 1, "Eye landmarks incomplete");
  }

  // =====================================================
  // BLENDSHAPES
  // =====================================================

  const blendshapes = result.faceBlendshapes?.[0]?.categories ?? [];

  // =====================================================
  // RULE 2:
  // BOTH EYES MUST BE OPEN
  //
  // Blendshape ang primary check natin dito.
  // =====================================================

  const leftBlink = getScore(blendshapes, "eyeBlinkLeft");

  const rightBlink = getScore(blendshapes, "eyeBlinkRight");

  const leftEyeOpen = leftBlink < ATTENTION_CONFIG.eyes.blinkThreshold;

  const rightEyeOpen = rightBlink < ATTENTION_CONFIG.eyes.blinkThreshold;

  // =====================================================
  // IRIS GAZE
  // =====================================================

  const leftGazeX = normalizedPosition(leftIris.x, leftEyeOuter.x, leftEyeInner.x);

  const rightGazeX = normalizedPosition(rightIris.x, rightEyeOuter.x, rightEyeInner.x);

  const gazeX = (leftGazeX + rightGazeX) / 2;

  const leftGazeY = normalizedPosition(leftIris.y, leftEyeTop.y, leftEyeBottom.y);

  const rightGazeY = normalizedPosition(rightIris.y, rightEyeTop.y, rightEyeBottom.y);

  const gazeY = (leftGazeY + rightGazeY) / 2;

  const irisOnScreen =
    gazeX >= ATTENTION_CONFIG.eyes.gazeMinX && gazeX <= ATTENTION_CONFIG.eyes.gazeMaxX && gazeY >= ATTENTION_CONFIG.eyes.gazeMinY && gazeY <= ATTENTION_CONFIG.eyes.gazeMaxY;

  // =====================================================
  // BLENDSHAPE GAZE
  //
  // Ito yung "isa pang detector"
  // bukod sa iris landmarks.
  // =====================================================

  const eyeLookScores = [
    getScore(blendshapes, "eyeLookInLeft"),

    getScore(blendshapes, "eyeLookOutLeft"),

    getScore(blendshapes, "eyeLookUpLeft"),

    getScore(blendshapes, "eyeLookDownLeft"),

    getScore(blendshapes, "eyeLookInRight"),

    getScore(blendshapes, "eyeLookOutRight"),

    getScore(blendshapes, "eyeLookUpRight"),

    getScore(blendshapes, "eyeLookDownRight"),
  ];

  const strongestEyeLook = Math.max(...eyeLookScores);

  const blendshapeOnScreen = strongestEyeLook < ATTENTION_CONFIG.eyes.lookAwayBlendshapeThreshold;

  // =====================================================
  // FINAL RULE
  //
  // 1 face
  // AND both eyes open
  // AND iris says on-screen
  // AND blendshape does not strongly say away
  // =====================================================

  const looking = leftEyeOpen && rightEyeOpen && irisOnScreen && blendshapeOnScreen;

  return {
    issue: looking ? "LOOKING" : "LOOKING_AWAY",

    faceCount: 1,

    leftEyeOpen,
    rightEyeOpen,

    irisOnScreen,
    blendshapeOnScreen,

    gazeX,
    gazeY,

    leftBlink,
    rightBlink,

    strongestEyeLook,

    note: looking ? "Eyes looking at screen": getAttentionReason({
          leftEyeOpen,
          rightEyeOpen,
          irisOnScreen,
          blendshapeOnScreen,
        }),
  };
}

// =========================================================
// REASON
// =========================================================

function getAttentionReason({
  leftEyeOpen,
  rightEyeOpen,
  irisOnScreen,
  blendshapeOnScreen,
}: {
  leftEyeOpen: boolean;
  rightEyeOpen: boolean;

  irisOnScreen: boolean;
  blendshapeOnScreen: boolean;
}) {
  if (!leftEyeOpen || !rightEyeOpen) {
    return "Both eyes must be open";
  }

  if (!irisOnScreen) {
    return "Iris is outside screen gaze range";
  }

  if (!blendshapeOnScreen) {
    return "Eye-look blendshape detected looking away";
  }

  return "Not looking at screen";
}

// =========================================================
// EMPTY RESULT
// =========================================================

function emptyResult(issue: MonitorIssue, faceCount: number, note: string): DebugInfo {
  return {
    issue,

    faceCount,

    leftEyeOpen: false,
    rightEyeOpen: false,

    irisOnScreen: false,
    blendshapeOnScreen: false,

    gazeX: 0,
    gazeY: 0,

    leftBlink: 0,
    rightBlink: 0,

    strongestEyeLook: 0,

    note,
  };
}

// =========================================================
// BLENDSHAPE SCORE
// =========================================================

function getScore(categories: BlendshapeCategory[], name: string) {
  return categories.find((item) => item.categoryName === name)?.score ?? 0;
}

// =========================================================
// NORMALIZED IRIS POSITION
//
// Converts iris position inside eye into roughly:
//
// 0 ------------------------- 1
//
// This makes gaze thresholds easier to understand.
// =========================================================

function normalizedPosition(value: number, pointA: number, pointB: number) {
  const minimum = Math.min(pointA, pointB);

  const maximum = Math.max(pointA, pointB);

  const size = maximum - minimum;

  if (size <= 0.00001) {
    return 0.5;
  }

  return (value - minimum) / size;
}
