"use client";


import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type RefObject,
} from "react";


// =========================================================
// ATTENTION MONITOR CONFIGURATION
//
// DITO LANG MAG-ADJUST NG VALUES.
// =========================================================


const ATTENTION_CONFIG = {
    // =====================================================
    // GENERAL
    // =====================================================


    general: {
        monitoringEnabled: true,


        // Kapag negative states ay pabago-bago:
        //
        // SLEEPING
        // -> NO_FACE
        // -> LOOKING_AWAY
        //
        // Pero continuously negative naman,
        // eventually considered inattentive.
        unstableNegativeConfirmationMs: 1000,


        // Kapag bumalik sa normal,
        // kailangan stable muna bago mag-recover.
        recoveryConfirmationMs: 900,
    },


    // =====================================================
    // AUTO CALIBRATION
    // =====================================================


    calibration: {
        enabled: true,


        // Ilang milliseconds mag-aaral ng normal position
        // pagkatapos mag-start detection.
        durationMs: 2500,


        learnEyeOpenRatio: true,
        learnGazeCenter: true,
        learnFaceDistance: true,


        // Minimum number of valid samples bago tanggapin
        // ang calibration.
        minimumSamples: 10,
    },


    // =====================================================
    // RELIABILITY
    // =====================================================


    reliability: {
        enabled: true,


        // Kapag unreliable ang frame:
        // huwag mag-decide kung attentive/inattentive.
        pauseDecisionWhenUnreliable: true,


        // Ilang ms dapat maging reliable ulit
        // bago ulit magpatuloy ang attention decision.
        reliableRecoveryMs: 300,
    },


    // =====================================================
    // FACE
    // =====================================================


    face: {
        detectionEnabled: true,


        noFaceIsNegative: true,
        multipleFacesIsNegative: true,


        maxFaces: 1,


        detectionConfidence: 0.5,
        presenceConfidence: 0.5,
        trackingConfidence: 0.5,


        noFaceDelayMs: 3000,
        multipleFacesDelayMs: 1500,


        // Require reasonably visible face inside frame.
        requireFaceInsideFrame: true,


        minCenterX: 0.12,
        maxCenterX: 0.88,


        minCenterY: 0.08,
        maxCenterY: 0.94,
    },


    // =====================================================
    // DISTANCE FROM CAMERA
    //
    // Hindi literal centimeters.
    // Face width relative to camera frame ang ginagamit.
    // =====================================================


    distance: {
        enabled: true,


        // Automatic baseline based sa user's normal
        // starting distance.
        useCalibration: true,


        // Fallback values kapag walang calibration.
        //
        // Example:
        // 0.15 = face occupies around 15% ng frame width.
        minFaceWidthRatio: 0.15,
        maxFaceWidthRatio: 0.6,


        tooFarIsUnreliable: true,
        tooCloseIsUnreliable: true,


        // Kapag calibrated:
        // gaano kalaking movement ang allowed relative
        // sa original distance.
        allowedFartherPercent: 40,
        allowedCloserPercent: 40,
    },


    // =====================================================
    // EYES
    // =====================================================


    eyes: {
        detectionEnabled: true,


        // Original landmark eye-ratio detection.
        useEyeOpenRatio: true,


        // Original fallback.
        closedEyeRatio: 0.11,


        // Automatic threshold based sa normal open eyes.
        useCalibratedEyeRatio: true,


        // Example:
        // normal = 0.30
        // threshold = 0.30 * 0.45 = 0.135
        calibratedClosedRatioFactor: 0.45,


        // MediaPipe Face Blendshape.
        useBlinkBlendshape: true,


        leftBlinkThreshold: 0.5,
        rightBlinkThreshold: 0.5,


        // true:
        // parehong mata kailangan closed.
        requireBothEyesClosed: true,


        closedEyesDelayMs: 2000,
    },


    // =====================================================
    // GAZE
    // =====================================================


    gaze: {
        detectionEnabled: true,


        gazeAwayIsNegative: true,


        // Original fallback gaze boundaries.
        minX: 0.35,
        maxX: 0.65,


        minY: 0.3,
        maxY: 0.8,


        // Better:
        // learn saan natural na center ng user's gaze.
        useCalibration: true,


        // Allowed deviation mula calibrated gaze center.
        allowedHorizontalDeviation: 0.15,
        allowedVerticalDeviation: 0.25,


        lookingAwayDelayMs: 3000,
    },


    // =====================================================
    // HEAD POSITION
    // =====================================================


    head: {
        detectionEnabled: true,


        // IMPORTANT:
        //
        // false:
        // pwede nakatagilid ang ulo basta eyes are still
        // looking at screen.
        //
        // true:
        // head position itself can trigger LOOKING_AWAY.
        turningHeadIsNegative: false,


        turningLeftAllowed: true,
        turningRightAllowed: true,
        turningUpAllowed: true,
        turningDownAllowed: true,


        // Current normalized head-offset fallback.
        maxHorizontalOffset: 0.22,


        // -------------------------------------------------
        // FUTURE REAL HEAD ANGLES
        //
        // Hindi pa ginagamit hangga't
        // useActualDegrees = false.
        // -------------------------------------------------


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


        // Original behavior:
        // kailangan matamaan parehong eye area.
        requireBothEyesCovered: true,


        eyeBoxExpandX: 0.035,
        eyeBoxExpandY: 0.045,


        importantLandmarkIndexes: [
            4,
            8,
            12,
            16,
            20,
            3,
            7,
            11,
            15,
            19,
        ],
    },


    // =====================================================
    // CAMERA
    // =====================================================


    camera: {
        cameraOffIsNegative: true,
        cameraOffDelayMs: 1000,
    },


    // =====================================================
    // ERRORS
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


        wasmUrl:
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",


        faceModelUrl:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",


        handModelUrl:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
    },
} as const;


// =========================================================
// TYPES
// =========================================================


export type MonitorIssue =
    | "LOADING"
    | "LOOKING"
    | "NO_FACE"
    | "MULTIPLE_FACES"
    | "LOOKING_AWAY"
    | "SLEEPING"
    | "CAMERA_OFF"
    | "ERROR";


type Landmark = {
    x: number;
    y: number;
    z?: number;
};


type BlendshapeCategory = {
    categoryName: string;
    score: number;
};


type FaceBlendshapes = {
    categories?: BlendshapeCategory[];
};


type FaceResult = {
    faceLandmarks?: Landmark[][];
    faceBlendshapes?: FaceBlendshapes[];
};


type HandResult = {
    landmarks?: Landmark[][];
};


type FaceLandmarkerLike = {
    detectForVideo: (
        video: HTMLVideoElement,
        timestamp: number,
    ) => FaceResult;


    close?: () => void;
};


type HandLandmarkerLike = {
    detectForVideo: (
        video: HTMLVideoElement,
        timestamp: number,
    ) => HandResult;


    close?: () => void;
};


type CalibrationData = {
    eyeOpenRatio: number | null;


    gazeX: number | null;
    gazeY: number | null;


    faceWidthRatio: number | null;
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


    note?: string;
};


export type DebugInfo = AnalysisResult & {
    isCalibrating?: boolean;


    calibrationSamples?: number;


    pendingIssue?: MonitorIssue | null;
    pendingSeconds?: number;
};


interface UseAttentionDetectionParams {
    videoRef: RefObject<HTMLVideoElement | null>;
    isDetecting: boolean;
}


// =========================================================
// HOOK
// =========================================================


export function useAttentionDetection({
    videoRef,
    isDetecting,
}: UseAttentionDetectionParams) {
    // =====================================================
    // MEDIAPIPE REFS
    // =====================================================


    const faceLandmarkerRef =
        useRef<FaceLandmarkerLike | null>(null);


    const handLandmarkerRef =
        useRef<HandLandmarkerLike | null>(null);


    const animationFrameRef =
        useRef<number | null>(null);


    const lastVideoTimeRef = useRef(-1);


    // =====================================================
    // ATTENTION TIMERS
    // =====================================================


    const pendingIssueRef =
        useRef<MonitorIssue | null>(null);


    const pendingIssueStartRef =
        useRef<number | null>(null);


    const negativeStartRef =
        useRef<number | null>(null);


    const recoveryStartRef =
        useRef<number | null>(null);


    const reliableStartRef =
        useRef<number | null>(null);


    const activeWarningRef =
        useRef(false);


    // =====================================================
    // CALIBRATION
    // =====================================================


    const calibrationStartedAtRef =
        useRef<number | null>(null);


    const calibrationSamplesRef =
        useRef<AnalysisResult[]>([]);


    const calibrationDataRef =
        useRef<CalibrationData>({
            eyeOpenRatio: null,


            gazeX: null,
            gazeY: null,


            faceWidthRatio: null,
        });


    const calibrationCompletedRef =
        useRef(false);


    // =====================================================
    // STATE
    // =====================================================


    const [isReady, setIsReady] =
        useState(false);


    const [issue, setIssue] =
        useState<MonitorIssue>("LOADING");


    const [showWarning, setShowWarning] =
        useState(false);


    const [warningSeconds, setWarningSeconds] =
        useState(0);


    const [debugInfo, setDebugInfo] =
        useState<DebugInfo>({
            issue: "LOADING",


            faceCount: 0,
            handCount: 0,


            isReliable: false,


            handOverEyes: false,


            note: "Loading MediaPipe",
        });


    // =====================================================
    // ISSUE DELAY
    // =====================================================


    const getDelayForIssue = useCallback(
        (nextIssue: MonitorIssue) => {
            switch (nextIssue) {
                case "SLEEPING":
                    return ATTENTION_CONFIG.eyes
                        .closedEyesDelayMs;


                case "MULTIPLE_FACES":
                    return ATTENTION_CONFIG.face
                        .multipleFacesDelayMs;


                case "NO_FACE":
                    return ATTENTION_CONFIG.face
                        .noFaceDelayMs;


                case "LOOKING_AWAY":
                    return ATTENTION_CONFIG.gaze
                        .lookingAwayDelayMs;


                case "CAMERA_OFF":
                    return ATTENTION_CONFIG.camera
                        .cameraOffDelayMs;


                case "ERROR":
                    return ATTENTION_CONFIG.error
                        .errorDelayMs;


                default:
                    return 0;
            }
        },
        [],
    );


    // =====================================================
    // RESET HELPERS
    // =====================================================


    const clearPendingState = useCallback(() => {
        pendingIssueRef.current = null;
        pendingIssueStartRef.current = null;


        recoveryStartRef.current = null;
    }, []);


    const clearAttentionTracking =
        useCallback(() => {
            clearPendingState();


            negativeStartRef.current = null;
            reliableStartRef.current = null;
        }, [clearPendingState]);


    const resetCalibration = useCallback(() => {
        calibrationStartedAtRef.current = null;


        calibrationSamplesRef.current = [];


        calibrationCompletedRef.current =
            !ATTENTION_CONFIG.calibration.enabled;


        calibrationDataRef.current = {
            eyeOpenRatio: null,


            gazeX: null,
            gazeY: null,


            faceWidthRatio: null,
        };
    }, []);


    // =====================================================
    // APPLY ATTENTION STATE
    // =====================================================


    const applyAttentionIssue = useCallback(
        (nextIssue: MonitorIssue) => {
            const now = Date.now();


            // -------------------------------------------------
            // ATTENTIVE
            // -------------------------------------------------


            if (nextIssue === "LOOKING") {
                // Wala namang previous negative.
                if (negativeStartRef.current === null) {
                    clearPendingState();


                    activeWarningRef.current = false;


                    setIssue("LOOKING");
                    setShowWarning(false);
                    setWarningSeconds(0);


                    return;
                }


                // Start recovery.
                if (recoveryStartRef.current === null) {
                    recoveryStartRef.current = now;


                    return;
                }


                const recoveryDuration =
                    now - recoveryStartRef.current;


                if (
                    recoveryDuration <
                    ATTENTION_CONFIG.general
                        .recoveryConfirmationMs
                ) {
                    return;
                }


                clearAttentionTracking();


                activeWarningRef.current = false;


                setIssue("LOOKING");
                setShowWarning(false);
                setWarningSeconds(0);


                return;
            }


            // -------------------------------------------------
            // NEGATIVE
            // -------------------------------------------------


            recoveryStartRef.current = null;


            if (negativeStartRef.current === null) {
                negativeStartRef.current = now;
            }


            // Nagbago raw issue.
            if (
                pendingIssueRef.current !== nextIssue
            ) {
                pendingIssueRef.current =
                    nextIssue;


                pendingIssueStartRef.current =
                    now;
            }


            const currentIssueDuration =
                now -
                (pendingIssueStartRef.current ??
                    now);


            const totalNegativeDuration =
                now -
                (negativeStartRef.current ?? now);


            const requiredDelay =
                getDelayForIssue(nextIssue);


            setWarningSeconds(
                Math.floor(
                    totalNegativeDuration / 1000,
                ),
            );


            const currentIssueConfirmed =
                currentIssueDuration >= requiredDelay;


            const unstableNegativeConfirmed =
                totalNegativeDuration >=
                ATTENTION_CONFIG.general
                    .unstableNegativeConfirmationMs;


            if (
                !currentIssueConfirmed &&
                !unstableNegativeConfirmed
            ) {
                if (!activeWarningRef.current) {
                    setIssue("LOOKING");
                    setShowWarning(false);
                }


                return;
            }


            activeWarningRef.current = true;


            setIssue(nextIssue);
            setShowWarning(true);
        },
        [
            clearAttentionTracking,
            clearPendingState,
            getDelayForIssue,
        ],
    );


    // =====================================================
    // LOAD MEDIAPIPE
    // =====================================================


    useEffect(() => {
        let mounted = true;


        async function loadMediaPipe() {
            try {
                const {
                    FaceLandmarker,
                    HandLandmarker,
                    FilesetResolver,
                } = await import(
                    "@mediapipe/tasks-vision"
                );


                const vision =
                    await FilesetResolver.forVisionTasks(
                        ATTENTION_CONFIG.mediapipe
                            .wasmUrl,
                    );


                const faceLandmarker =
                    await FaceLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath:
                                    ATTENTION_CONFIG
                                        .mediapipe
                                        .faceModelUrl,


                                delegate:
                                    ATTENTION_CONFIG
                                        .mediapipe.useGPU
                                        ? "GPU"
                                        : "CPU",
                            },


                            runningMode: "VIDEO",


                            numFaces:
                                ATTENTION_CONFIG.face
                                    .maxFaces,


                            minFaceDetectionConfidence:
                                ATTENTION_CONFIG.face
                                    .detectionConfidence,


                            minFacePresenceConfidence:
                                ATTENTION_CONFIG.face
                                    .presenceConfidence,


                            minTrackingConfidence:
                                ATTENTION_CONFIG.face
                                    .trackingConfidence,


                            outputFaceBlendshapes:
                                ATTENTION_CONFIG.eyes
                                    .useBlinkBlendshape,


                            outputFacialTransformationMatrixes:
                                false,
                        },
                    );


                const handLandmarker =
                    await HandLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath:
                                    ATTENTION_CONFIG
                                        .mediapipe
                                        .handModelUrl,


                                delegate:
                                    ATTENTION_CONFIG
                                        .mediapipe.useGPU
                                        ? "GPU"
                                        : "CPU",
                            },


                            runningMode: "VIDEO",


                            numHands:
                                ATTENTION_CONFIG.hands
                                    .maxHands,


                            minHandDetectionConfidence:
                                ATTENTION_CONFIG.hands
                                    .detectionConfidence,


                            minHandPresenceConfidence:
                                ATTENTION_CONFIG.hands
                                    .presenceConfidence,


                            minTrackingConfidence:
                                ATTENTION_CONFIG.hands
                                    .trackingConfidence,
                        },
                    );


                faceLandmarkerRef.current =
                    faceLandmarker as FaceLandmarkerLike;


                handLandmarkerRef.current =
                    handLandmarker as HandLandmarkerLike;


                if (!mounted) return;


                setIsReady(true);


                setIssue("LOOKING");


                setDebugInfo({
                    issue: "LOOKING",


                    faceCount: 0,
                    handCount: 0,


                    isReliable: false,


                    handOverEyes: false,


                    note: "MediaPipe ready",
                });
            } catch (error) {
                console.warn(
                    "MediaPipe loading failed:",
                    error,
                );


                if (!mounted) return;


                applyAttentionIssue("ERROR");


                setDebugInfo({
                    issue: "ERROR",


                    faceCount: 0,
                    handCount: 0,


                    isReliable: false,


                    handOverEyes: false,


                    note:
                        "MediaPipe failed to load",
                });
            }
        }


        loadMediaPipe();


        return () => {
            mounted = false;


            faceLandmarkerRef.current?.close?.();
            handLandmarkerRef.current?.close?.();


            faceLandmarkerRef.current = null;
            handLandmarkerRef.current = null;
        };
    }, [applyAttentionIssue]);


    // =====================================================
    // RESET WHEN DETECTION STOPS
    // =====================================================


    useEffect(() => {
        if (isDetecting) return;


        lastVideoTimeRef.current = -1;


        clearAttentionTracking();


        resetCalibration();


        activeWarningRef.current = false;


        setShowWarning(false);
        setWarningSeconds(0);


        if (isReady) {
            setIssue("LOOKING");


            setDebugInfo({
                issue: "LOOKING",


                faceCount: 0,
                handCount: 0,


                isReliable: false,


                handOverEyes: false,


                note: "Detection inactive",
            });
        }
    }, [
        isDetecting,
        isReady,
        clearAttentionTracking,
        resetCalibration,
    ]);


    // =====================================================
    // START CALIBRATION
    // =====================================================


    useEffect(() => {
        if (!isDetecting) return;


        resetCalibration();


        if (ATTENTION_CONFIG.calibration.enabled) {
            calibrationStartedAtRef.current =
                Date.now();
        }
    }, [isDetecting, resetCalibration]);


    // =====================================================
    // DETECTION LOOP
    // =====================================================


    useEffect(() => {
        if (
            !isDetecting ||
            !ATTENTION_CONFIG.general.monitoringEnabled
        ) {
            return;
        }


        lastVideoTimeRef.current = -1;


        function scheduleNextFrame() {
            animationFrameRef.current =
                requestAnimationFrame(detectLoop);
        }


        function detectLoop() {
            const video = videoRef.current;


            const faceLandmarker =
                faceLandmarkerRef.current;


            const handLandmarker =
                handLandmarkerRef.current;


            // -------------------------------------------------
            // CAMERA CHECK
            // -------------------------------------------------


            const stream =
                video?.srcObject instanceof MediaStream
                    ? video.srcObject
                    : null;


            const cameraTrack =
                stream?.getVideoTracks()[0];


            if (
                !cameraTrack ||
                cameraTrack.readyState !== "live"
            ) {
                applyAttentionIssue("CAMERA_OFF");


                setDebugInfo({
                    issue: "CAMERA_OFF",


                    faceCount: 0,
                    handCount: 0,


                    isReliable: false,


                    handOverEyes: false,


                    note: "Camera is off",
                });


                scheduleNextFrame();


                return;
            }


            if (
                !video ||
                !faceLandmarker ||
                !handLandmarker ||
                video.readyState < 2
            ) {
                scheduleNextFrame();


                return;
            }


            try {
                // Only analyze new video frames.
                if (
                    video.currentTime !==
                    lastVideoTimeRef.current
                ) {
                    lastVideoTimeRef.current =
                        video.currentTime;


                    const timestamp =
                        performance.now();


                    const faceResult =
                        faceLandmarker.detectForVideo(
                            video,
                            timestamp,
                        );


                    const handResult =
                        handLandmarker.detectForVideo(
                            video,
                            timestamp,
                        );


                    const analysis = analyzeFrame(
                        faceResult,
                        handResult,
                        calibrationDataRef.current,
                    );


                    // =========================================
                    // CALIBRATION
                    // =========================================


                    const calibrationResult =
                        processCalibration(analysis);


                    if (calibrationResult.isCalibrating) {
                        setDebugInfo({
                            ...analysis,


                            isCalibrating: true,


                            calibrationSamples:
                                calibrationSamplesRef.current
                                    .length,


                            note:
                                "Calibrating normal position...",
                        });


                        scheduleNextFrame();


                        return;
                    }


                    // =========================================
                    // RELIABILITY GATE
                    // =========================================


                    if (
                        ATTENTION_CONFIG.reliability
                            .enabled &&
                        !analysis.isReliable
                    ) {
                        reliableStartRef.current = null;


                        setDebugInfo({
                            ...analysis,


                            isCalibrating: false,


                            note:
                                analysis.reliabilityReason ??
                                "Unreliable camera data",
                        });


                        // IMPORTANT:
                        // Do NOT send LOOKING.
                        // Do NOT send LOOKING_AWAY.
                        //
                        // Freeze decision habang unreliable.
                        scheduleNextFrame();


                        return;
                    }


                    // =========================================
                    // RELIABLE RECOVERY
                    // =========================================


                    if (
                        ATTENTION_CONFIG.reliability
                            .enabled
                    ) {
                        if (
                            reliableStartRef.current === null
                        ) {
                            reliableStartRef.current =
                                Date.now();
                        }


                        const reliableDuration =
                            Date.now() -
                            reliableStartRef.current;


                        if (
                            reliableDuration <
                            ATTENTION_CONFIG.reliability
                                .reliableRecoveryMs
                        ) {
                            setDebugInfo({
                                ...analysis,


                                note:
                                    "Checking camera reliability...",
                            });


                            scheduleNextFrame();


                            return;
                        }
                    }


                    // =========================================
                    // ATTENTION DECISION
                    // =========================================


                    applyAttentionIssue(
                        analysis.issue,
                    );


                    setDebugInfo({
                        ...analysis,


                        isCalibrating: false,


                        pendingIssue:
                            pendingIssueRef.current,


                        pendingSeconds:
                            negativeStartRef.current
                                ? Math.floor(
                                        (Date.now() -
                                            negativeStartRef.current) /
                                            1000,
                                    )
                                : 0,
                    });
                }
            } catch (error) {
                console.warn(
                    "Attention detection failed:",
                    error,
                );


                applyAttentionIssue("ERROR");


                setDebugInfo({
                    issue: "ERROR",


                    faceCount: 0,
                    handCount: 0,


                    isReliable: false,


                    handOverEyes: false,


                    note:
                        "Attention detection failed",
                });
            }


            scheduleNextFrame();
        }


        // =================================================
        // CALIBRATION PROCESSOR
        // =================================================


        function processCalibration(
            analysis: AnalysisResult,
        ) {
            if (
                !ATTENTION_CONFIG.calibration.enabled ||
                calibrationCompletedRef.current
            ) {
                return {
                    isCalibrating: false,
                };
            }


            const startedAt =
                calibrationStartedAtRef.current;


            if (startedAt === null) {
                calibrationStartedAtRef.current =
                    Date.now();


                return {
                    isCalibrating: true,
                };
            }


            // Only use reasonably valid face measurements.
            if (
                analysis.faceCount === 1 &&
                analysis.eyeOpenRatio !== undefined &&
                analysis.gazeX !== undefined &&
                analysis.gazeY !== undefined &&
                analysis.faceWidthRatio !== undefined
            ) {
                calibrationSamplesRef.current.push(
                    analysis,
                );
            }


            const elapsed =
                Date.now() - startedAt;


            if (
                elapsed <
                ATTENTION_CONFIG.calibration.durationMs
            ) {
                return {
                    isCalibrating: true,
                };
            }


            const samples =
                calibrationSamplesRef.current;


            if (
                samples.length <
                ATTENTION_CONFIG.calibration
                    .minimumSamples
            ) {
                // Restart calibration if insufficient data.
                calibrationStartedAtRef.current =
                    Date.now();


                calibrationSamplesRef.current = [];


                return {
                    isCalibrating: true,
                };
            }


            calibrationDataRef.current = {
                eyeOpenRatio:
                    ATTENTION_CONFIG.calibration
                        .learnEyeOpenRatio
                        ? average(
                                samples
                                    .map(
                                        (item) =>
                                            item.eyeOpenRatio,
                                    )
                                    .filter(isNumber),
                            )
                        : null,


                gazeX:
                    ATTENTION_CONFIG.calibration
                        .learnGazeCenter
                        ? average(
                                samples
                                    .map(
                                        (item) => item.gazeX,
                                    )
                                    .filter(isNumber),
                            )
                        : null,


                gazeY:
                    ATTENTION_CONFIG.calibration
                        .learnGazeCenter
                        ? average(
                                samples
                                    .map(
                                        (item) => item.gazeY,
                                    )
                                    .filter(isNumber),
                            )
                        : null,


                faceWidthRatio:
                    ATTENTION_CONFIG.calibration
                        .learnFaceDistance
                        ? average(
                                samples
                                    .map(
                                        (item) =>
                                            item.faceWidthRatio,
                                    )
                                    .filter(isNumber),
                            )
                        : null,
            };


            calibrationCompletedRef.current = true;


            return {
                isCalibrating: false,
            };
        }


        scheduleNextFrame();


        return () => {
            if (
                animationFrameRef.current !== null
            ) {
                cancelAnimationFrame(
                    animationFrameRef.current,
                );
            }


            animationFrameRef.current = null;
        };
    }, [
        isDetecting,
        videoRef,
        applyAttentionIssue,
    ]);


    return {
        isReady,


        issue,
        showWarning,
        warningSeconds,


        debugInfo,


        calibration:
            calibrationDataRef.current,
    };
}


// =========================================================
// FRAME ANALYSIS
// =========================================================


function analyzeFrame(
    faceResult: FaceResult,
    handResult: HandResult,
    calibration: CalibrationData,
): AnalysisResult {
    const faces =
        faceResult.faceLandmarks ?? [];


    const hands =
        handResult.landmarks ?? [];


    // =====================================================
    // NO FACE
    // =====================================================


    if (faces.length === 0) {
        return {
            issue: "NO_FACE",


            faceCount: 0,
            handCount: hands.length,


            isReliable: true,


            handOverEyes: false,


            note: "No face detected",
        };
    }


    // =====================================================
    // MULTIPLE FACES
    // =====================================================


    if (
        ATTENTION_CONFIG.face
            .multipleFacesIsNegative &&
        faces.length > 1
    ) {
        return {
            issue: "MULTIPLE_FACES",


            faceCount: faces.length,
            handCount: hands.length,


            isReliable: true,


            handOverEyes: false,


            note: "Multiple faces detected",
        };
    }


    const face = faces[0];


    if (!face) {
        return {
            issue: "NO_FACE",


            faceCount: 0,
            handCount: hands.length,


            isReliable: true,


            handOverEyes: false,
        };
    }


    // =====================================================
    // FACE LANDMARKS
    // =====================================================


    const nose = face[1];


    const leftFace = face[234];
    const rightFace = face[454];


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


    if (
        !nose ||
        !leftFace ||
        !rightFace ||
        !leftEyeOuter ||
        !leftEyeInner ||
        !rightEyeOuter ||
        !rightEyeInner ||
        !leftEyeTop ||
        !leftEyeBottom ||
        !rightEyeTop ||
        !rightEyeBottom ||
        !leftIris ||
        !rightIris
    ) {
        return {
            issue: "LOOKING_AWAY",


            faceCount: 1,
            handCount: hands.length,


            isReliable: false,


            reliabilityReason:
                "Face or eye landmarks are incomplete",


            handOverEyes: false,


            note:
                "Insufficient landmark data",
        };
    }


    // =====================================================
    // FACE DISTANCE
    // =====================================================


    const faceWidthRatio =
        Math.abs(
            rightFace.x - leftFace.x,
        );


    const distanceReliability =
        checkDistanceReliability(
            faceWidthRatio,
            calibration.faceWidthRatio,
        );


    // =====================================================
    // HEAD OFFSET
    // =====================================================


    const eyeCenterX =
        (leftEyeOuter.x +
            rightEyeOuter.x) /
        2;


    const eyeDistance =
        Math.abs(
            rightEyeOuter.x -
                leftEyeOuter.x,
        );


    const headOffsetX =
        eyeDistance > 0.00001
            ? Math.abs(
                    nose.x - eyeCenterX,
                ) / eyeDistance
            : 0;


    const headFacingScreen =
        headOffsetX <
        ATTENTION_CONFIG.head
            .maxHorizontalOffset;


    // =====================================================
    // GAZE
    // =====================================================


    const leftGazeX =
        normalizedPosition(
            leftIris.x,
            leftEyeOuter.x,
            leftEyeInner.x,
        );


    const rightGazeX =
        normalizedPosition(
            rightIris.x,
            rightEyeInner.x,
            rightEyeOuter.x,
        );


    const gazeX =
        (leftGazeX + rightGazeX) / 2;


    const leftGazeY =
        normalizedPosition(
            leftIris.y,
            leftEyeTop.y,
            leftEyeBottom.y,
        );


    const rightGazeY =
        normalizedPosition(
            rightIris.y,
            rightEyeTop.y,
            rightEyeBottom.y,
        );


    const gazeY =
        (leftGazeY + rightGazeY) / 2;


    const gazeOnScreen =
        isGazeOnScreen(
            gazeX,
            gazeY,
            calibration,
        );


    // =====================================================
    // EYE OPEN RATIO
    // =====================================================


    const leftEyeWidth =
        distanceX(
            leftEyeOuter,
            leftEyeInner,
        );


    const rightEyeWidth =
        distanceX(
            rightEyeOuter,
            rightEyeInner,
        );


    const leftEyeOpenRatio =
        leftEyeWidth > 0.00001
            ? distanceY(
                    leftEyeTop,
                    leftEyeBottom,
                ) / leftEyeWidth
            : 1;


    const rightEyeOpenRatio =
        rightEyeWidth > 0.00001
            ? distanceY(
                    rightEyeTop,
                    rightEyeBottom,
                ) / rightEyeWidth
            : 1;


    const eyeOpenRatio =
        (leftEyeOpenRatio +
            rightEyeOpenRatio) /
        2;


    const closedEyeThreshold =
        getClosedEyeThreshold(
            calibration.eyeOpenRatio,
        );


    const eyesClosedByRatio =
        ATTENTION_CONFIG.eyes
            .useEyeOpenRatio &&
        eyeOpenRatio <
            closedEyeThreshold;


    // =====================================================
    // BLENDSHAPE BLINK
    // =====================================================


    const eyesClosedByBlendshape =
        ATTENTION_CONFIG.eyes
            .useBlinkBlendshape &&
        areEyesClosedByBlendshape(
            faceResult.faceBlendshapes?.[0],
        );


    const eyesClosed =
        eyesClosedByRatio ||
        eyesClosedByBlendshape;


    // =====================================================
    // HAND OVER EYES
    // =====================================================


    const handOverEyes =
        ATTENTION_CONFIG.hands
            .detectionEnabled &&
        isHandCoveringEyes(
            hands,
            {
                leftEyeOuter,
                leftEyeInner,
                leftEyeTop,
                leftEyeBottom,


                rightEyeOuter,
                rightEyeInner,
                rightEyeTop,
                rightEyeBottom,
            },
        );


    // =====================================================
    // FACE POSITION
    // =====================================================


    const faceOutsideFrame =
        ATTENTION_CONFIG.face
            .requireFaceInsideFrame &&
        (nose.x <
            ATTENTION_CONFIG.face
                .minCenterX ||
            nose.x >
                ATTENTION_CONFIG.face
                    .maxCenterX ||
            nose.y <
                ATTENTION_CONFIG.face
                    .minCenterY ||
            nose.y >
                ATTENTION_CONFIG.face
                    .maxCenterY);


    // =====================================================
    // RELIABILITY
    // =====================================================


    if (!distanceReliability.isReliable) {
        return {
            issue: "LOOKING",


            faceCount: 1,
            handCount: hands.length,


            isReliable: false,


            reliabilityReason:
                distanceReliability.reason,


            handOverEyes,


            eyeOpenRatio,
            headOffsetX,


            gazeX,
            gazeY,


            faceWidthRatio,


            note:
                distanceReliability.reason,
        };
    }


    // =====================================================
    // DECISION PRIORITY
    // =====================================================


    // -----------------------------------------------------
    // 1. HAND COVERING EYES
    // -----------------------------------------------------


    if (
        ATTENTION_CONFIG.hands
            .handOverEyesIsNegative &&
        handOverEyes
    ) {
        return createFullResult({
            issue: "SLEEPING",
            note: "Hand covering eyes",
        });
    }


    // -----------------------------------------------------
    // 2. EYES CLOSED
    // -----------------------------------------------------


    if (
        ATTENTION_CONFIG.eyes
            .detectionEnabled &&
        eyesClosed
    ) {
        return createFullResult({
            issue: "SLEEPING",
            note: "Eyes closed",
        });
    }


    // -----------------------------------------------------
    // 3. GAZE AWAY
    // -----------------------------------------------------


    const gazeFailed =
        ATTENTION_CONFIG.gaze
            .detectionEnabled &&
        ATTENTION_CONFIG.gaze
            .gazeAwayIsNegative &&
        !gazeOnScreen;


    // -----------------------------------------------------
    // 4. HEAD
    //
    // Head turning is supporting signal only by default.
    // -----------------------------------------------------


    const headFailed =
        ATTENTION_CONFIG.head
            .detectionEnabled &&
        ATTENTION_CONFIG.head
            .turningHeadIsNegative &&
        !headFacingScreen;


    // -----------------------------------------------------
    // 5. POSITION
    // -----------------------------------------------------


    if (
        gazeFailed ||
        headFailed ||
        faceOutsideFrame
    ) {
        return createFullResult({
            issue: "LOOKING_AWAY",


            note: gazeFailed
                ? "Eyes are away from screen"
                : faceOutsideFrame
                    ? "Face outside usable camera area"
                    : "Head position outside allowed range",
        });
    }


    // =====================================================
    // ATTENTIVE
    // =====================================================


    return createFullResult({
        issue: "LOOKING",
        note: "Eyes on screen",
    });


    // =====================================================
    // RESULT HELPER
    // =====================================================


    function createFullResult({
        issue,
        note,
    }: {
        issue: MonitorIssue;
        note: string;
    }): AnalysisResult {
        return {
            issue,


            faceCount: 1,
            handCount: hands.length,


            isReliable: true,


            handOverEyes,


            eyeOpenRatio,
            headOffsetX,


            gazeX,
            gazeY,


            faceWidthRatio,


            note,
        };
    }
}


// =========================================================
// DISTANCE RELIABILITY
// =========================================================


function checkDistanceReliability(
    currentFaceWidth: number,
    calibratedFaceWidth: number | null,
) {
    if (!ATTENTION_CONFIG.distance.enabled) {
        return {
            isReliable: true,
        };
    }


    let minimum =
        ATTENTION_CONFIG.distance
            .minFaceWidthRatio;


    let maximum =
        ATTENTION_CONFIG.distance
            .maxFaceWidthRatio;


    if (
        ATTENTION_CONFIG.distance
            .useCalibration &&
        calibratedFaceWidth !== null
    ) {
        const fartherTolerance =
            ATTENTION_CONFIG.distance
                .allowedFartherPercent / 100;


        const closerTolerance =
            ATTENTION_CONFIG.distance
                .allowedCloserPercent / 100;


        minimum =
            calibratedFaceWidth *
            (1 - fartherTolerance);


        maximum =
            calibratedFaceWidth *
            (1 + closerTolerance);
    }


    if (
        ATTENTION_CONFIG.distance
            .tooFarIsUnreliable &&
        currentFaceWidth < minimum
    ) {
        return {
            isReliable: false,
            reason:
                "Too far from camera",
        };
    }


    if (
        ATTENTION_CONFIG.distance
            .tooCloseIsUnreliable &&
        currentFaceWidth > maximum
    ) {
        return {
            isReliable: false,
            reason:
                "Too close to camera",
        };
    }


    return {
        isReliable: true,
    };
}


// =========================================================
// GAZE
// =========================================================


function isGazeOnScreen(
    gazeX: number,
    gazeY: number,
    calibration: CalibrationData,
) {
    // -----------------------------------------------------
    // CALIBRATED GAZE
    // -----------------------------------------------------


    if (
        ATTENTION_CONFIG.gaze.useCalibration &&
        calibration.gazeX !== null &&
        calibration.gazeY !== null
    ) {
        const minX =
            calibration.gazeX -
            ATTENTION_CONFIG.gaze
                .allowedHorizontalDeviation;


        const maxX =
            calibration.gazeX +
            ATTENTION_CONFIG.gaze
                .allowedHorizontalDeviation;


        const minY =
            calibration.gazeY -
            ATTENTION_CONFIG.gaze
                .allowedVerticalDeviation;


        const maxY =
            calibration.gazeY +
            ATTENTION_CONFIG.gaze
                .allowedVerticalDeviation;


        return (
            gazeX > minX &&
            gazeX < maxX &&
            gazeY > minY &&
            gazeY < maxY
        );
    }


    // -----------------------------------------------------
    // ORIGINAL FALLBACK
    // -----------------------------------------------------


    return (
        gazeX >
            ATTENTION_CONFIG.gaze.minX &&
        gazeX <
            ATTENTION_CONFIG.gaze.maxX &&
        gazeY >
            ATTENTION_CONFIG.gaze.minY &&
        gazeY <
            ATTENTION_CONFIG.gaze.maxY
    );
}


// =========================================================
// CLOSED EYE THRESHOLD
// =========================================================


function getClosedEyeThreshold(
    calibratedOpenRatio: number | null,
) {
    if (
        ATTENTION_CONFIG.eyes
            .useCalibratedEyeRatio &&
        calibratedOpenRatio !== null
    ) {
        return (
            calibratedOpenRatio *
            ATTENTION_CONFIG.eyes
                .calibratedClosedRatioFactor
        );
    }


    return ATTENTION_CONFIG.eyes
        .closedEyeRatio;
}


// =========================================================
// MEDIAPIPE BLENDSHAPES
// =========================================================


function areEyesClosedByBlendshape(
    blendshapes?: FaceBlendshapes,
) {
    if (!blendshapes?.categories) {
        return false;
    }


    const leftBlink =
        blendshapes.categories.find(
            (item) =>
                item.categoryName ===
                "eyeBlinkLeft",
        )?.score ?? 0;


    const rightBlink =
        blendshapes.categories.find(
            (item) =>
                item.categoryName ===
                "eyeBlinkRight",
        )?.score ?? 0;


    const leftClosed =
        leftBlink >=
        ATTENTION_CONFIG.eyes
            .leftBlinkThreshold;


    const rightClosed =
        rightBlink >=
        ATTENTION_CONFIG.eyes
            .rightBlinkThreshold;


    if (
        ATTENTION_CONFIG.eyes
            .requireBothEyesClosed
    ) {
        return leftClosed && rightClosed;
    }


    return leftClosed || rightClosed;
}


// =========================================================
// HAND OVER EYES
// =========================================================


function isHandCoveringEyes(
    hands: Landmark[][],
    eyes: {
        leftEyeOuter: Landmark;
        leftEyeInner: Landmark;
        leftEyeTop: Landmark;
        leftEyeBottom: Landmark;


        rightEyeOuter: Landmark;
        rightEyeInner: Landmark;
        rightEyeTop: Landmark;
        rightEyeBottom: Landmark;
    },
) {
    if (hands.length === 0) {
        return false;
    }


    const leftEyeBox =
        createExpandedBox(
            [
                eyes.leftEyeOuter,
                eyes.leftEyeInner,
                eyes.leftEyeTop,
                eyes.leftEyeBottom,
            ],
            ATTENTION_CONFIG.hands
                .eyeBoxExpandX,
            ATTENTION_CONFIG.hands
                .eyeBoxExpandY,
        );


    const rightEyeBox =
        createExpandedBox(
            [
                eyes.rightEyeOuter,
                eyes.rightEyeInner,
                eyes.rightEyeTop,
                eyes.rightEyeBottom,
            ],
            ATTENTION_CONFIG.hands
                .eyeBoxExpandX,
            ATTENTION_CONFIG.hands
                .eyeBoxExpandY,
        );


    let leftHits = 0;
    let rightHits = 0;


    for (const hand of hands) {
        for (
            const index of
            ATTENTION_CONFIG.hands
                .importantLandmarkIndexes
        ) {
            const point = hand[index];


            if (!point) continue;


            if (
                isPointInsideBox(
                    point,
                    leftEyeBox,
                )
            ) {
                leftHits++;
            }


            if (
                isPointInsideBox(
                    point,
                    rightEyeBox,
                )
            ) {
                rightHits++;
            }
        }
    }


    if (
        ATTENTION_CONFIG.hands
            .requireBothEyesCovered
    ) {
        return (
            leftHits >= 1 &&
            rightHits >= 1
        );
    }


    return (
        leftHits >= 1 ||
        rightHits >= 1
    );
}


// =========================================================
// HELPERS
// =========================================================


function createExpandedBox(
    points: Landmark[],
    expandX: number,
    expandY: number,
) {
    const xs = points.map(
        (point) => point.x,
    );


    const ys = points.map(
        (point) => point.y,
    );


    return {
        minX:
            Math.min(...xs) - expandX,


        maxX:
            Math.max(...xs) + expandX,


        minY:
            Math.min(...ys) - expandY,


        maxY:
            Math.max(...ys) + expandY,
    };
}


function isPointInsideBox(
    point: Landmark,
    box: {
        minX: number;
        maxX: number;


        minY: number;
        maxY: number;
    },
) {
    return (
        point.x >= box.minX &&
        point.x <= box.maxX &&
        point.y >= box.minY &&
        point.y <= box.maxY
    );
}


function normalizedPosition(
    value: number,
    pointA: number,
    pointB: number,
) {
    const minimum =
        Math.min(pointA, pointB);


    const maximum =
        Math.max(pointA, pointB);


    const size =
        maximum - minimum;


    if (size <= 0.00001) {
        return 0.5;
    }


    return (
        (value - minimum) / size
    );
}


function distanceX(
    a: Landmark,
    b: Landmark,
) {
    return Math.abs(a.x - b.x);
}


function distanceY(
    a: Landmark,
    b: Landmark,
) {
    return Math.abs(a.y - b.y);
}


function average(
    values: number[],
) {
    if (values.length === 0) {
        return null;
    }


    return (
        values.reduce(
            (total, value) =>
                total + value,
            0,
        ) / values.length
    );
}


function isNumber(
    value: number | undefined,
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value)
    );
}

