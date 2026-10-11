// // app/(public)/attention-monitoring/lib/analyzeAttention.ts

// import { ATTENTION_CONFIG } from "../config/attentionConfig";

// import {
// 	clamp,
// 	createExpandedBox,
// 	distanceX,
// 	distanceY,
// 	getHeadPose,
// 	getStabilityScore,
// 	isPointInsideBox,
// 	normalizedPosition,
// 	roundScore,
// 	scoreAroundTarget,
// } from "./attentionMath";

// import type {
// 	AnalysisResult,
// 	CalibrationData,
// 	DetectionScores,
// 	FaceBlendshapes,
// 	FaceResult,
// 	HandResult,
// 	HeadPose,
// 	Landmark,
// 	PreviousFrameMetrics,
// } from "./attentionTypes";

// // =========================================================
// // EMPTY SCORES
// // =========================================================

// export const EMPTY_SCORES: DetectionScores =
// 	{
// 		face: 0,
// 		eyes: 0,
// 		gaze: 0,
// 		distance: 0,
// 		stability: 0,

// 		reliability: 0,
// 		attention: 0,
// 		overall: 0,
// 	};

// // =========================================================
// // ANALYZE FRAME
// // =========================================================

// export function analyzeAttentionFrame(
// 	faceResult: FaceResult,
// 	handResult: HandResult,
// 	calibration: CalibrationData,
// 	previousFrame: PreviousFrameMetrics | null,
// ): AnalysisResult {
// 	const faces =
// 		faceResult.faceLandmarks ?? [];

// 	const hands =
// 		handResult.landmarks ?? [];

// 	// =====================================================
// 	// NO FACE
// 	// =====================================================

// 	if (faces.length === 0) {
// 		return {
// 			issue:
// 				ATTENTION_CONFIG.face
// 					.noFaceIsNegative
// 					? "NO_FACE"
// 					: "LOOKING",

// 			faceCount: 0,
// 			handCount: hands.length,

// 			isReliable: true,

// 			handOverEyes: false,

// 			scores: {
// 				...EMPTY_SCORES,
// 				reliability: 100,
// 			},

// 			note: "No face detected",
// 		};
// 	}

// 	// =====================================================
// 	// MULTIPLE FACES
// 	// =====================================================

// 	if (
// 		faces.length > 1 &&
// 		ATTENTION_CONFIG.face
// 			.multipleFacesIsNegative
// 	) {
// 		return {
// 			issue: "MULTIPLE_FACES",

// 			faceCount: faces.length,
// 			handCount: hands.length,

// 			isReliable: true,

// 			handOverEyes: false,

// 			scores: {
// 				...EMPTY_SCORES,
// 				face: 100,
// 				reliability: 100,
// 			},

// 			note:
// 				"Multiple faces detected",
// 		};
// 	}

// 	const face = faces[0];

// 	if (!face) {
// 		return unreliable(
// 			"No usable face landmarks",
// 			hands.length,
// 		);
// 	}

// 	// =====================================================
// 	// LANDMARKS
// 	// =====================================================

// 	const nose = face[1];

// 	const leftFace = face[234];
// 	const rightFace = face[454];

// 	const leftEyeOuter = face[33];
// 	const leftEyeInner = face[133];

// 	const rightEyeOuter = face[263];
// 	const rightEyeInner = face[362];

// 	const leftEyeTop = face[159];
// 	const leftEyeBottom = face[145];

// 	const rightEyeTop = face[386];
// 	const rightEyeBottom = face[374];

// 	const leftIris = face[468];
// 	const rightIris = face[473];

// 	if (
// 		!nose ||
// 		!leftFace ||
// 		!rightFace ||
// 		!leftEyeOuter ||
// 		!leftEyeInner ||
// 		!rightEyeOuter ||
// 		!rightEyeInner ||
// 		!leftEyeTop ||
// 		!leftEyeBottom ||
// 		!rightEyeTop ||
// 		!rightEyeBottom
// 	) {
// 		return unreliable(
// 			"Face or eye landmarks are incomplete",
// 			hands.length,
// 		);
// 	}

// 	// =====================================================
// 	// FACE POSITION / DISTANCE
// 	// =====================================================

// 	const faceWidthRatio =
// 		Math.abs(
// 			rightFace.x -
// 				leftFace.x,
// 		);

// 	const faceCenterX =
// 		(leftFace.x +
// 			rightFace.x) /
// 		2;

// 	const faceCenterY =
// 		nose.y;

// 	const faceInsideFrame =
// 		nose.x >=
// 			ATTENTION_CONFIG.face
// 				.minCenterX &&
// 		nose.x <=
// 			ATTENTION_CONFIG.face
// 				.maxCenterX &&
// 		nose.y >=
// 			ATTENTION_CONFIG.face
// 				.minCenterY &&
// 		nose.y <=
// 			ATTENTION_CONFIG.face
// 				.maxCenterY;

// 	const faceScore =
// 		faceInsideFrame
// 			? 100
// 			: 40;

// 	const distance =
// 		getDistanceResult(
// 			faceWidthRatio,
// 			calibration.faceWidthRatio,
// 		);

// 	// =====================================================
// 	// EYE OPEN RATIO
// 	// =====================================================

// 	const leftEyeWidth =
// 		distanceX(
// 			leftEyeOuter,
// 			leftEyeInner,
// 		);

// 	const rightEyeWidth =
// 		distanceX(
// 			rightEyeOuter,
// 			rightEyeInner,
// 		);

// 	const leftEyeOpenRatio =
// 		leftEyeWidth > 0.00001
// 			? distanceY(
// 					leftEyeTop,
// 					leftEyeBottom,
// 				) / leftEyeWidth
// 			: 1;

// 	const rightEyeOpenRatio =
// 		rightEyeWidth > 0.00001
// 			? distanceY(
// 					rightEyeTop,
// 					rightEyeBottom,
// 				) / rightEyeWidth
// 			: 1;

// 	const eyeOpenRatio =
// 		(leftEyeOpenRatio +
// 			rightEyeOpenRatio) /
// 		2;

// 	const closedEyeThreshold =
// 		getClosedEyeThreshold(
// 			calibration.eyeOpenRatio,
// 		);

// 	const closedByRatio =
// 		ATTENTION_CONFIG.eyes
// 			.useEyeOpenRatio &&
// 		eyeOpenRatio <
// 			closedEyeThreshold;

// 	// =====================================================
// 	// BLINK BLENDSHAPES
// 	// =====================================================

// 	const blink =
// 		getBlinkScores(
// 			faceResult
// 				.faceBlendshapes?.[0],
// 		);

// 	const leftClosed =
// 		blink.left >=
// 		ATTENTION_CONFIG.eyes
// 			.leftBlinkThreshold;

// 	const rightClosed =
// 		blink.right >=
// 		ATTENTION_CONFIG.eyes
// 			.rightBlinkThreshold;

// 	const closedByBlendshape =
// 		ATTENTION_CONFIG.eyes
// 			.useBlinkBlendshape &&
// 		(ATTENTION_CONFIG.eyes
// 			.requireBothEyesClosed
// 			? leftClosed &&
// 				rightClosed
// 			: leftClosed ||
// 				rightClosed);

// 	const eyesClosed =
// 		closedByRatio ||
// 		closedByBlendshape;

// 	const eyeScore =
// 		getEyeScore(
// 			eyeOpenRatio,
// 			closedEyeThreshold,
// 			blink.left,
// 			blink.right,
// 		);

// 	// =====================================================
// 	// HAND OVER EYES
// 	// =====================================================

// 	const handOverEyes =
// 		ATTENTION_CONFIG.hands
// 			.detectionEnabled &&
// 		isHandCoveringEyes(
// 			hands,
// 			{
// 				leftEyeOuter,
// 				leftEyeInner,
// 				leftEyeTop,
// 				leftEyeBottom,

// 				rightEyeOuter,
// 				rightEyeInner,
// 				rightEyeTop,
// 				rightEyeBottom,
// 			},
// 		);

// 	// =====================================================
// 	// HEAD
// 	// =====================================================

// 	const eyeCenterX =
// 		(leftEyeOuter.x +
// 			rightEyeOuter.x) /
// 		2;

// 	const eyeDistance =
// 		Math.abs(
// 			rightEyeOuter.x -
// 				leftEyeOuter.x,
// 		);

// 	const headOffsetX =
// 		eyeDistance > 0.00001
// 			? Math.abs(
// 					nose.x -
// 						eyeCenterX,
// 				) / eyeDistance
// 			: 0;

// 	const headPose =
// 		ATTENTION_CONFIG.head
// 			.useActualDegrees
// 			? getHeadPose(
// 					faceResult
// 						.facialTransformationMatrixes?.[0],
// 				)
// 			: undefined;

// 	const headAllowed =
// 		isHeadPositionAllowed(
// 			headPose,
// 			headOffsetX,
// 		);

// 	// =====================================================
// 	// DISTANCE RELIABILITY
// 	// =====================================================

// 	if (
// 		ATTENTION_CONFIG.reliability
// 			.distanceAffectsReliability &&
// 		!distance.isReliable
// 	) {
// 		return makeUnreliableResult(
// 			distance.reason ??
// 				"Camera distance is unreliable",
// 		);
// 	}

// 	// =====================================================
// 	// IMPORTANT:
// 	// CLOSED EYE CHECK BEFORE IRIS.
// 	//
// 	// Closed eyes may weaken iris tracking.
// 	// =====================================================

// 	if (
// 		ATTENTION_CONFIG.hands
// 			.handOverEyesIsNegative &&
// 		handOverEyes
// 	) {
// 		return makeClosedResult(
// 			"Hand covering eyes",
// 		);
// 	}

// 	if (
// 		ATTENTION_CONFIG.eyes
// 			.detectionEnabled &&
// 		eyesClosed
// 	) {
// 		return makeClosedResult(
// 			"Eyes closed",
// 		);
// 	}

// 	// =====================================================
// 	// IRIS REQUIRED FOR GAZE
// 	// =====================================================

// 	if (!leftIris || !rightIris) {
// 		return makeUnreliableResult(
// 			"Iris tracking unavailable",
// 		);
// 	}

// 	// =====================================================
// 	// GAZE
// 	// =====================================================

// 	const leftGazeX =
// 		normalizedPosition(
// 			leftIris.x,
// 			leftEyeOuter.x,
// 			leftEyeInner.x,
// 		);

// 	const rightGazeX =
// 		normalizedPosition(
// 			rightIris.x,
// 			rightEyeInner.x,
// 			rightEyeOuter.x,
// 		);

// 	const gazeX =
// 		(leftGazeX +
// 			rightGazeX) /
// 		2;

// 	const leftGazeY =
// 		normalizedPosition(
// 			leftIris.y,
// 			leftEyeTop.y,
// 			leftEyeBottom.y,
// 		);

// 	const rightGazeY =
// 		normalizedPosition(
// 			rightIris.y,
// 			rightEyeTop.y,
// 			rightEyeBottom.y,
// 		);

// 	const gazeY =
// 		(leftGazeY +
// 			rightGazeY) /
// 		2;

// 	const gaze =
// 		getGazeResult(
// 			gazeX,
// 			gazeY,
// 			calibration,
// 		);

// 	// =====================================================
// 	// STABILITY
// 	// =====================================================

// 	const stability =
// 		getStabilityScore(
// 			{
// 				faceCenterX,
// 				faceCenterY,

// 				faceWidthRatio,

// 				gazeX,
// 				gazeY,
// 			},
// 			previousFrame,
// 		);

// 	// =====================================================
// 	// RELIABILITY SCORE
// 	// =====================================================

// 	const weights =
// 		ATTENTION_CONFIG.reliability
// 			.weights;

// 	const eyeDataQuality = 100;

// 	const reliabilityScore =
// 		roundScore(
// 			faceScore *
// 				weights.face +
// 				eyeDataQuality *
// 					weights.eyes +
// 				distance.score *
// 					weights.distance +
// 				stability *
// 					weights.stability,
// 		);

// 	const isReliable =
// 		reliabilityScore >=
// 		ATTENTION_CONFIG.reliability
// 			.minimumScore;

// 	// =====================================================
// 	// ATTENTION SCORE
// 	// =====================================================

// 	const positionScore =
// 		faceInsideFrame &&
// 		headAllowed
// 			? 100
// 			: 0;

// 	const attentionScore =
// 		roundScore(
// 			eyeScore *
// 				ATTENTION_CONFIG.scores
// 					.eyeWeight +
// 				gaze.score *
// 					ATTENTION_CONFIG.scores
// 						.gazeWeight +
// 				positionScore *
// 					ATTENTION_CONFIG.scores
// 						.positionWeight,
// 		);

// 	const overallScore =
// 		roundScore(
// 			attentionScore *
// 				(reliabilityScore / 100),
// 		);

// 	const scores: DetectionScores =
// 		{
// 			face: faceScore,
// 			eyes: eyeScore,
// 			gaze: gaze.score,
// 			distance:
// 				distance.score,
// 			stability,

// 			reliability:
// 				reliabilityScore,

// 			attention:
// 				attentionScore,

// 			overall:
// 				overallScore,
// 		};

// 	if (!isReliable) {
// 		return {
// 			issue: "LOOKING",

// 			faceCount: 1,
// 			handCount: hands.length,

// 			isReliable: false,

// 			reliabilityReason:
// 				"Detection quality is too low",

// 			handOverEyes,

// 			eyeOpenRatio,

// 			leftBlinkScore:
// 				blink.left,

// 			rightBlinkScore:
// 				blink.right,

// 			gazeX,
// 			gazeY,

// 			headOffsetX,
// 			headPose,

// 			faceWidthRatio,
// 			faceCenterX,
// 			faceCenterY,

// 			scores,

// 			note:
// 				"Detection quality is too low",
// 		};
// 	}

// 	// =====================================================
// 	// FINAL ATTENTION DECISION
// 	// =====================================================

// 	const gazeFailed =
// 		ATTENTION_CONFIG.gaze
// 			.detectionEnabled &&
// 		ATTENTION_CONFIG.gaze
// 			.gazeAwayIsNegative &&
// 		!gaze.onScreen;

// 	const headFailed =
// 		ATTENTION_CONFIG.head
// 			.detectionEnabled &&
// 		ATTENTION_CONFIG.head
// 			.turningHeadIsNegative &&
// 		!headAllowed;

// 	const faceFailed =
// 		ATTENTION_CONFIG.face
// 			.requireInsideFrame &&
// 		!faceInsideFrame;

// 	if (
// 		gazeFailed ||
// 		headFailed ||
// 		faceFailed
// 	) {
// 		return {
// 			issue: "LOOKING_AWAY",

// 			faceCount: 1,
// 			handCount: hands.length,

// 			isReliable: true,

// 			handOverEyes,

// 			eyeOpenRatio,

// 			leftBlinkScore:
// 				blink.left,

// 			rightBlinkScore:
// 				blink.right,

// 			gazeX,
// 			gazeY,

// 			headOffsetX,
// 			headPose,

// 			faceWidthRatio,
// 			faceCenterX,
// 			faceCenterY,

// 			scores,

// 			note: gazeFailed
// 				? "Eyes away from screen"
// 				: headFailed
// 					? "Head outside allowed range"
// 					: "Face outside usable camera area",
// 		};
// 	}

// 	return {
// 		issue: "LOOKING",

// 		faceCount: 1,
// 		handCount: hands.length,

// 		isReliable: true,

// 		handOverEyes,

// 		eyeOpenRatio,

// 		leftBlinkScore:
// 			blink.left,

// 		rightBlinkScore:
// 			blink.right,

// 		gazeX,
// 		gazeY,

// 		headOffsetX,
// 		headPose,

// 		faceWidthRatio,
// 		faceCenterX,
// 		faceCenterY,

// 		scores,

// 		note: "Eyes on screen",
// 	};

// 	// =====================================================
// 	// LOCAL RESULT HELPERS
// 	// =====================================================

// 	function makeClosedResult(
// 		note: string,
// 	): AnalysisResult {
// 		const stability =
// 			getStabilityScore(
// 				{
// 					faceCenterX,
// 					faceCenterY,
// 					faceWidthRatio,
// 				},
// 				previousFrame,
// 			);

// 		const reliability =
// 			getBasicReliability(
// 				faceScore,
// 				distance.score,
// 				stability,
// 			);

// 		const attention =
// 			roundScore(
// 				eyeScore *
// 					ATTENTION_CONFIG.scores
// 						.eyeWeight,
// 			);

// 		return {
// 			issue: "SLEEPING",

// 			faceCount: 1,
// 			handCount: hands.length,

// 			isReliable: true,

// 			handOverEyes,

// 			eyeOpenRatio,

// 			leftBlinkScore:
// 				blink.left,

// 			rightBlinkScore:
// 				blink.right,

// 			headOffsetX,
// 			headPose,

// 			faceWidthRatio,
// 			faceCenterX,
// 			faceCenterY,

// 			scores: {
// 				face: faceScore,
// 				eyes: eyeScore,
// 				gaze: 0,
// 				distance:
// 					distance.score,

// 				stability,

// 				reliability,

// 				attention,

// 				overall:
// 					roundScore(
// 						attention *
// 							(reliability /
// 								100),
// 					),
// 			},

// 			note,
// 		};
// 	}

// 	function makeUnreliableResult(
// 		reason: string,
// 	): AnalysisResult {
// 		const stability =
// 			getStabilityScore(
// 				{
// 					faceCenterX,
// 					faceCenterY,

// 					faceWidthRatio,
// 				},
// 				previousFrame,
// 			);

// 		const reliability =
// 			getBasicReliability(
// 				faceScore,
// 				distance.score,
// 				stability,
// 			);

// 		return {
// 			issue: "LOOKING",

// 			faceCount: 1,
// 			handCount: hands.length,

// 			isReliable: false,

// 			reliabilityReason:
// 				reason,

// 			handOverEyes,

// 			eyeOpenRatio,

// 			leftBlinkScore:
// 				blink.left,

// 			rightBlinkScore:
// 				blink.right,

// 			headOffsetX,
// 			headPose,

// 			faceWidthRatio,
// 			faceCenterX,
// 			faceCenterY,

// 			scores: {
// 				face: faceScore,
// 				eyes: eyeScore,
// 				gaze: 0,
// 				distance:
// 					distance.score,

// 				stability,

// 				reliability,

// 				attention: 0,

// 				overall: 0,
// 			},

// 			note: reason,
// 		};
// 	}
// }

// // =========================================================
// // DISTANCE
// // =========================================================

// function getDistanceResult(
// 	currentFaceWidth: number,
// 	calibratedFaceWidth: number | null,
// ) {
// 	if (
// 		!ATTENTION_CONFIG.distance.enabled
// 	) {
// 		return {
// 			isReliable: true,
// 			score: 100,
// 		};
// 	}

// 	let minimum =
// 		ATTENTION_CONFIG.distance
// 			.minFaceWidthRatio;

// 	let maximum =
// 		ATTENTION_CONFIG.distance
// 			.maxFaceWidthRatio;

// 	let target =
// 		(minimum + maximum) /
// 		2;

// 	if (
// 		ATTENTION_CONFIG.distance
// 			.useCalibration &&
// 		calibratedFaceWidth !== null
// 	) {
// 		target =
// 			calibratedFaceWidth;

// 		minimum =
// 			target *
// 			(1 -
// 				ATTENTION_CONFIG.distance
// 					.allowedFartherPercent /
// 					100);

// 		maximum =
// 			target *
// 			(1 +
// 				ATTENTION_CONFIG.distance
// 					.allowedCloserPercent /
// 					100);
// 	}

// 	const score =
// 		scoreAroundTarget(
// 			currentFaceWidth,
// 			target,
// 			minimum,
// 			maximum,
// 		);

// 	if (
// 		ATTENTION_CONFIG.distance
// 			.tooFarIsUnreliable &&
// 		currentFaceWidth < minimum
// 	) {
// 		return {
// 			isReliable: false,
// 			score,

// 			reason:
// 				"Too far from camera",
// 		};
// 	}

// 	if (
// 		ATTENTION_CONFIG.distance
// 			.tooCloseIsUnreliable &&
// 		currentFaceWidth > maximum
// 	) {
// 		return {
// 			isReliable: false,
// 			score,

// 			reason:
// 				"Too close to camera",
// 		};
// 	}

// 	return {
// 		isReliable: true,
// 		score,
// 	};
// }

// // =========================================================
// // CLOSED-EYE THRESHOLD
// // =========================================================

// function getClosedEyeThreshold(
// 	calibratedEyeRatio: number | null,
// ) {
// 	if (
// 		ATTENTION_CONFIG.eyes
// 			.useCalibration &&
// 		calibratedEyeRatio !== null
// 	) {
// 		return (
// 			calibratedEyeRatio *
// 			ATTENTION_CONFIG.eyes
// 				.calibratedClosedRatioFactor
// 		);
// 	}

// 	return ATTENTION_CONFIG.eyes
// 		.closedEyeRatio;
// }

// // =========================================================
// // BLINK
// // =========================================================

// function getBlinkScores(
// 	blendshapes?: FaceBlendshapes,
// ) {
// 	if (!blendshapes?.categories) {
// 		return {
// 			left: 0,
// 			right: 0,
// 		};
// 	}

// 	return {
// 		left:
// 			blendshapes.categories.find(
// 				(item) =>
// 					item.categoryName ===
// 					"eyeBlinkLeft",
// 			)?.score ?? 0,

// 		right:
// 			blendshapes.categories.find(
// 				(item) =>
// 					item.categoryName ===
// 					"eyeBlinkRight",
// 			)?.score ?? 0,
// 	};
// }

// // =========================================================
// // EYE SCORE
// // =========================================================

// function getEyeScore(
// 	eyeRatio: number,
// 	closedThreshold: number,
// 	leftBlink: number,
// 	rightBlink: number,
// ) {
// 	const blinkAverage =
// 		(leftBlink +
// 			rightBlink) /
// 		2;

// 	const blinkOpenScore =
// 		100 -
// 		blinkAverage * 100;

// 	const ratioScore =
// 		closedThreshold > 0
// 			? clamp(
// 					(eyeRatio /
// 						(closedThreshold *
// 							2)) *
// 						100,
// 					0,
// 					100,
// 				)
// 			: 100;

// 	if (
// 		ATTENTION_CONFIG.eyes
// 			.useEyeOpenRatio &&
// 		ATTENTION_CONFIG.eyes
// 			.useBlinkBlendshape
// 	) {
// 		return roundScore(
// 			(ratioScore +
// 				blinkOpenScore) /
// 				2,
// 		);
// 	}

// 	if (
// 		ATTENTION_CONFIG.eyes
// 			.useBlinkBlendshape
// 	) {
// 		return roundScore(
// 			blinkOpenScore,
// 		);
// 	}

// 	return roundScore(ratioScore);
// }

// // =========================================================
// // GAZE
// // =========================================================

// function getGazeResult(
// 	gazeX: number,
// 	gazeY: number,
// 	calibration: CalibrationData,
// ) {
// 	let centerX =
// 		(ATTENTION_CONFIG.gaze.minX +
// 			ATTENTION_CONFIG.gaze.maxX) /
// 		2;

// 	let centerY =
// 		(ATTENTION_CONFIG.gaze.minY +
// 			ATTENTION_CONFIG.gaze.maxY) /
// 		2;

// 	let allowedX =
// 		(ATTENTION_CONFIG.gaze.maxX -
// 			ATTENTION_CONFIG.gaze.minX) /
// 		2;

// 	let allowedY =
// 		(ATTENTION_CONFIG.gaze.maxY -
// 			ATTENTION_CONFIG.gaze.minY) /
// 		2;

// 	if (
// 		ATTENTION_CONFIG.gaze
// 			.useCalibration &&
// 		calibration.gazeX !== null &&
// 		calibration.gazeY !== null
// 	) {
// 		centerX =
// 			calibration.gazeX;

// 		centerY =
// 			calibration.gazeY;

// 		allowedX =
// 			ATTENTION_CONFIG.gaze
// 				.allowedHorizontalDeviation;

// 		allowedY =
// 			ATTENTION_CONFIG.gaze
// 				.allowedVerticalDeviation;
// 	}

// 	const differenceX =
// 		Math.abs(
// 			gazeX - centerX,
// 		);

// 	const differenceY =
// 		Math.abs(
// 			gazeY - centerY,
// 		);

// 	const normalizedX =
// 		allowedX > 0
// 			? differenceX /
// 				allowedX
// 			: 1;

// 	const normalizedY =
// 		allowedY > 0
// 			? differenceY /
// 				allowedY
// 			: 1;

// 	const deviation =
// 		Math.max(
// 			normalizedX,
// 			normalizedY,
// 		);

// 	return {
// 		onScreen:
// 			differenceX <=
// 				allowedX &&
// 			differenceY <=
// 				allowedY,

// 		score: roundScore(
// 			100 -
// 				deviation *
// 					60,
// 		),
// 	};
// }

// // =========================================================
// // HEAD RULES
// // =========================================================

// function isHeadPositionAllowed(
// 	pose: HeadPose | undefined,
// 	headOffsetX: number,
// ) {
// 	if (
// 		!ATTENTION_CONFIG.head
// 			.turningHeadIsNegative
// 	) {
// 		return true;
// 	}

// 	if (
// 		ATTENTION_CONFIG.head
// 			.useActualDegrees &&
// 		pose
// 	) {
// 		const min =
// 			ATTENTION_CONFIG.head
// 				.minimumTurnDegrees;

// 		// Negative yaw = left.
// 		if (pose.yaw < -min) {
// 			if (
// 				ATTENTION_CONFIG.head
// 					.left.detectionEnabled
// 			) {
// 				if (
// 					!ATTENTION_CONFIG.head
// 						.left.allowed
// 				) {
// 					return false;
// 				}

// 				if (
// 					Math.abs(pose.yaw) >
// 					ATTENTION_CONFIG.head
// 						.left.maxDegrees
// 				) {
// 					return false;
// 				}
// 			}
// 		}

// 		if (pose.yaw > min) {
// 			if (
// 				ATTENTION_CONFIG.head
// 					.right.detectionEnabled
// 			) {
// 				if (
// 					!ATTENTION_CONFIG.head
// 						.right.allowed
// 				) {
// 					return false;
// 				}

// 				if (
// 					pose.yaw >
// 					ATTENTION_CONFIG.head
// 						.right.maxDegrees
// 				) {
// 					return false;
// 				}
// 			}
// 		}

// 		// Negative pitch = up.
// 		if (pose.pitch < -min) {
// 			if (
// 				ATTENTION_CONFIG.head
// 					.up.detectionEnabled &&
// 				(!ATTENTION_CONFIG.head
// 					.up.allowed ||
// 					Math.abs(
// 						pose.pitch,
// 					) >
// 						ATTENTION_CONFIG
// 							.head.up
// 							.maxDegrees)
// 			) {
// 				return false;
// 			}
// 		}

// 		if (pose.pitch > min) {
// 			if (
// 				ATTENTION_CONFIG.head
// 					.down.detectionEnabled &&
// 				(!ATTENTION_CONFIG.head
// 					.down.allowed ||
// 					pose.pitch >
// 						ATTENTION_CONFIG
// 							.head.down
// 							.maxDegrees)
// 			) {
// 				return false;
// 			}
// 		}

// 		if (pose.roll < -min) {
// 			if (
// 				ATTENTION_CONFIG.head
// 					.tiltLeft
// 					.detectionEnabled &&
// 				(!ATTENTION_CONFIG.head
// 					.tiltLeft.allowed ||
// 					Math.abs(
// 						pose.roll,
// 					) >
// 						ATTENTION_CONFIG
// 							.head
// 							.tiltLeft
// 							.maxDegrees)
// 			) {
// 				return false;
// 			}
// 		}

// 		if (pose.roll > min) {
// 			if (
// 				ATTENTION_CONFIG.head
// 					.tiltRight
// 					.detectionEnabled &&
// 				(!ATTENTION_CONFIG.head
// 					.tiltRight.allowed ||
// 					pose.roll >
// 						ATTENTION_CONFIG
// 							.head
// 							.tiltRight
// 							.maxDegrees)
// 			) {
// 				return false;
// 			}
// 		}

// 		return true;
// 	}

// 	return (
// 		headOffsetX <
// 		ATTENTION_CONFIG.head
// 			.maxHorizontalOffset
// 	);
// }

// // =========================================================
// // HANDS
// // =========================================================

// function isHandCoveringEyes(
// 	hands: Landmark[][],
// 	eyes: {
// 		leftEyeOuter: Landmark;
// 		leftEyeInner: Landmark;
// 		leftEyeTop: Landmark;
// 		leftEyeBottom: Landmark;

// 		rightEyeOuter: Landmark;
// 		rightEyeInner: Landmark;
// 		rightEyeTop: Landmark;
// 		rightEyeBottom: Landmark;
// 	},
// ) {
// 	if (hands.length === 0) {
// 		return false;
// 	}

// 	const leftEyeBox =
// 		createExpandedBox(
// 			[
// 				eyes.leftEyeOuter,
// 				eyes.leftEyeInner,
// 				eyes.leftEyeTop,
// 				eyes.leftEyeBottom,
// 			],

// 			ATTENTION_CONFIG.hands
// 				.eyeBoxExpandX,

// 			ATTENTION_CONFIG.hands
// 				.eyeBoxExpandY,
// 		);

// 	const rightEyeBox =
// 		createExpandedBox(
// 			[
// 				eyes.rightEyeOuter,
// 				eyes.rightEyeInner,
// 				eyes.rightEyeTop,
// 				eyes.rightEyeBottom,
// 			],

// 			ATTENTION_CONFIG.hands
// 				.eyeBoxExpandX,

// 			ATTENTION_CONFIG.hands
// 				.eyeBoxExpandY,
// 		);

// 	let leftHits = 0;
// 	let rightHits = 0;

// 	for (const hand of hands) {
// 		for (
// 			const index of
// 			ATTENTION_CONFIG.hands
// 				.importantLandmarkIndexes
// 		) {
// 			const point = hand[index];

// 			if (!point) continue;

// 			if (
// 				isPointInsideBox(
// 					point,
// 					leftEyeBox,
// 				)
// 			) {
// 				leftHits += 1;
// 			}

// 			if (
// 				isPointInsideBox(
// 					point,
// 					rightEyeBox,
// 				)
// 			) {
// 				rightHits += 1;
// 			}
// 		}
// 	}

// 	if (
// 		ATTENTION_CONFIG.hands
// 			.requireBothEyesCovered
// 	) {
// 		return (
// 			leftHits >= 1 &&
// 			rightHits >= 1
// 		);
// 	}

// 	return (
// 		leftHits >= 1 ||
// 		rightHits >= 1
// 	);
// }

// // =========================================================
// // BASIC RELIABILITY
// // =========================================================

// function getBasicReliability(
// 	faceScore: number,
// 	distanceScore: number,
// 	stabilityScore: number,
// ) {
// 	const weights =
// 		ATTENTION_CONFIG.reliability
// 			.weights;

// 	return roundScore(
// 		faceScore *
// 			weights.face +
// 			100 *
// 				weights.eyes +
// 			distanceScore *
// 				weights.distance +
// 			stabilityScore *
// 				weights.stability,
// 	);
// }

// // =========================================================
// // GENERIC UNRELIABLE
// // =========================================================

// function unreliable(
// 	reason: string,
// 	handCount: number,
// ): AnalysisResult {
// 	return {
// 		issue: "LOOKING",

// 		faceCount: 1,
// 		handCount,

// 		isReliable: false,

// 		reliabilityReason: reason,

// 		handOverEyes: false,

// 		scores: EMPTY_SCORES,

// 		note: reason,
// 	};
// }