// app/(public)/attention-monitoring/config/attentionConfig.ts

export const ATTENTION_CONFIG = {
  // =====================================================
  // GENERAL
  // =====================================================

  general: {
    monitoringEnabled: true,

    // Continuous negative kahit nagpapalit-palit:
    // SLEEPING -> NO_FACE -> LOOKING_AWAY
    unstableNegativeConfirmationMs: 3000,

    // Stable attentive state bago mag-recover.
    recoveryConfirmationMs: 900,
  },

  // =====================================================
  // AUTO CALIBRATION
  // =====================================================

  calibration: {
    enabled: true,

    durationMs: 2500,

    minimumSamples: 10,

    learnEyeOpenRatio: true,
    learnGazeCenter: true,
    learnFaceDistance: true,
  },

  // =====================================================
  // RELIABILITY
  // =====================================================

  reliability: {
    enabled: true,

    // Unreliable frame:
    // freeze current attention decision.
    pauseDecisionWhenUnreliable: true,

    // Reliable muna nang ganito katagal
    // bago bumalik sa normal detection.
    reliableRecoveryMs: 300,
  },

  // =====================================================
  // FACE
  // =====================================================

  face: {
    detectionEnabled: true,

    noFaceIsNegative: true,
    multipleFacesIsNegative: true,

    maxFaces: 2,

    detectionConfidence: 0.5,
    presenceConfidence: 0.5,
    trackingConfidence: 0.5,

    noFaceDelayMs: 3000,
    multipleFacesDelayMs: 1500,

    requireFaceInsideFrame: true,

    minCenterX: 0.12,
    maxCenterX: 0.88,

    minCenterY: 0.08,
    maxCenterY: 0.94,
  },

  // =====================================================
  // DISTANCE FROM CAMERA
  //
  // Relative face width ang measurement.
  // Hindi literal centimeters.
  // =====================================================

  distance: {
    enabled: true,

    useCalibration: true,

    // Fallback bago matapos calibration.
    minFaceWidthRatio: 0.15,
    maxFaceWidthRatio: 0.6,

    tooFarIsUnreliable: true,
    tooCloseIsUnreliable: true,

    // Relative sa calibrated normal distance.
    allowedFartherPercent: 40,
    allowedCloserPercent: 40,
  },

  // =====================================================
  // EYES
  // =====================================================

  eyes: {
    detectionEnabled: true,

    // Landmark eye-open ratio.
    useEyeOpenRatio: true,

    // Stable fallback.
    closedEyeRatio: 0.11,

    // Automatic threshold from calibration.
    useCalibratedEyeRatio: true,

    calibratedClosedRatioFactor: 0.45,

    // MediaPipe blink detection.
    useBlinkBlendshape: true,

    leftBlinkThreshold: 0.5,
    rightBlinkThreshold: 0.5,

    // true = parehong mata kailangan closed.
    requireBothEyesClosed: true,

    closedEyesDelayMs: 900,
  },

  // =====================================================
  // GAZE
  // =====================================================

  gaze: {
    detectionEnabled: true,

    gazeAwayIsNegative: true,

    // Stable fallback values.
    minX: 0.35,
    maxX: 0.65,

    minY: 0.3,
    maxY: 0.8,

    useCalibration: true,

    allowedHorizontalDeviation: 0.15,
    allowedVerticalDeviation: 0.25,

    lookingAwayDelayMs: 3000,
  },

  // =====================================================
  // HEAD POSITION
  // =====================================================

  head: {
    detectionEnabled: true,

    // false:
    // head turning alone cannot fail attention.
    turningHeadIsNegative: false,

    turningLeftAllowed: true,
    turningRightAllowed: true,
    turningUpAllowed: true,
    turningDownAllowed: true,

    // Stable normalized head offset.
    maxHorizontalOffset: 0.22,

    // Reserved only.
    // NOT part of stable decision while false.
    useActualDegrees: false,

    maxTurnLeftDegrees: 40,
    maxTurnRightDegrees: 40,

    maxTurnUpDegrees: 25,
    maxTurnDownDegrees: 30,

    maxTiltLeftDegrees: 25,
    maxTiltRightDegrees: 25,
  },

  // =====================================================
  // HANDS
  // =====================================================

  hands: {
    detectionEnabled: true,

    handOverEyesIsNegative: true,

    maxHands: 2,

    detectionConfidence: 0.5,
    presenceConfidence: 0.5,
    trackingConfidence: 0.5,

    requireBothEyesCovered: true,

    eyeBoxExpandX: 0.035,
    eyeBoxExpandY: 0.045,

    importantLandmarkIndexes: [4, 8, 12, 16, 20, 3, 7, 11, 15, 19],
  },

  // =====================================================
  // DIAGNOSTIC SCORES
  //
  // IMPORTANT:
  // Scores are DISPLAY/DEBUG information only.
  // They NEVER override the stable detector.
  // =====================================================

  scores: {
    enabled: true,

    eyeWeight: 0.4,
    gazeWeight: 0.4,
    positionWeight: 0.2,
  },

  // =====================================================
  // CAMERA
  // =====================================================

  camera: {
    cameraOffIsNegative: true,

    cameraOffDelayMs: 1000,
  },

  // =====================================================
  // ERROR
  // =====================================================

  error: {
    errorIsNegative: true,

    errorDelayMs: 1000,
  },

  // =====================================================
  // MEDIAPIPE
  // =====================================================

  mediapipe: {
    useGPU: true,

    wasmUrl: process.env.NEXT_PUBLIC_MEDIAPIPE_WASM_URL ?? "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",

    faceModelUrl: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",

    handModelUrl: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
  },

  // =====================================================
  // DEVELOPMENT LOGS
  // =====================================================

  logs: {
    hideHarmlessMediaPipeLogs: true,
  },
} as const;
