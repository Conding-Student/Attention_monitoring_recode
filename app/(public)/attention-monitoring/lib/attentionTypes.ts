// app/(public)/attention-monitoring/lib/attentionTypes.ts

export type MonitorIssue = "LOADING" | "LOOKING" | "NO_FACE" | "MULTIPLE_FACES" | "LOOKING_AWAY" | "SLEEPING" | "CAMERA_OFF" | "ERROR";

export type Landmark = {
  x: number;
  y: number;
  z?: number;
};

export type BlendshapeCategory = {
  categoryName: string;
  score: number;
};

export type FaceBlendshapes = {
  categories?: BlendshapeCategory[];
};

export type FaceResult = {
  faceLandmarks?: Landmark[][];
  faceBlendshapes?: FaceBlendshapes[];
};

export type HandResult = {
  landmarks?: Landmark[][];
};

export type CalibrationData = {
  eyeOpenRatio: number | null;

  gazeX: number | null;
  gazeY: number | null;

  faceWidthRatio: number | null;
};

export type DetectionScores = {
  face: number;
  eyes: number;
  gaze: number;
  distance: number;

  reliability: number;
  attention: number;
  overall: number;
};

export type AnalysisResult = {
  issue: MonitorIssue;

  faceCount: number;
  handCount: number;

  isReliable: boolean;
  reliabilityReason?: string;

  handOverEyes: boolean;

  eyeOpenRatio?: number;

  headOffsetX?: number;

  gazeX?: number;
  gazeY?: number;

  faceWidthRatio?: number;

  scores: DetectionScores;

  note?: string;
};

export type DebugInfo = AnalysisResult & {
  isCalibrating?: boolean;

  calibrationSamples?: number;

  pendingIssue?: MonitorIssue | null;
  pendingSeconds?: number;
};
