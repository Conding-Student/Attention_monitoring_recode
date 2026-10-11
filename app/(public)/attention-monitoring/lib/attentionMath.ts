// // app/(public)/attention-monitoring/lib/attentionMath.ts

// import { ATTENTION_CONFIG } from "../config/attentionConfig";

// import type {
// 	HeadPose,
// 	Landmark,
// 	MonitorIssue,
// 	PreviousFrameMetrics,
// 	TemporalEvidence,
// 	TemporalSample,
// 	TransformationMatrix,
// } from "./attentionTypes";

// // =========================================================
// // BASIC MATH
// // =========================================================

// export function clamp(
// 	value: number,
// 	minimum: number,
// 	maximum: number,
// ) {
// 	return Math.min(
// 		Math.max(value, minimum),
// 		maximum,
// 	);
// }

// export function roundScore(value: number) {
// 	return Math.round(
// 		clamp(value, 0, 100),
// 	);
// }

// export function distanceX(
// 	a: Landmark,
// 	b: Landmark,
// ) {
// 	return Math.abs(a.x - b.x);
// }

// export function distanceY(
// 	a: Landmark,
// 	b: Landmark,
// ) {
// 	return Math.abs(a.y - b.y);
// }

// export function normalizedPosition(
// 	value: number,
// 	pointA: number,
// 	pointB: number,
// ) {
// 	const minimum = Math.min(
// 		pointA,
// 		pointB,
// 	);

// 	const maximum = Math.max(
// 		pointA,
// 		pointB,
// 	);

// 	const size = maximum - minimum;

// 	if (size <= 0.00001) {
// 		return 0.5;
// 	}

// 	return (
// 		(value - minimum) / size
// 	);
// }

// // =========================================================
// // MEDIAN
// // =========================================================

// export function median(values: number[]) {
// 	if (values.length === 0) {
// 		return null;
// 	}

// 	const sorted = [...values].sort(
// 		(a, b) => a - b,
// 	);

// 	const middle = Math.floor(
// 		sorted.length / 2,
// 	);

// 	if (sorted.length % 2 === 0) {
// 		return (
// 			(sorted[middle - 1] +
// 				sorted[middle]) /
// 			2
// 		);
// 	}

// 	return sorted[middle];
// }

// export function isNumber(
// 	value: number | undefined,
// ): value is number {
// 	return (
// 		typeof value === "number" &&
// 		Number.isFinite(value)
// 	);
// }

// // =========================================================
// // EMA
// // =========================================================

// export function movingAverage(
// 	current: number,
// 	next: number,
// 	rate: number,
// ) {
// 	return (
// 		current * (1 - rate) +
// 		next * rate
// 	);
// }

// // =========================================================
// // TARGET SCORE
// // =========================================================

// export function scoreAroundTarget(
// 	value: number,
// 	target: number,
// 	minimum: number,
// 	maximum: number,
// ) {
// 	if (value === target) {
// 		return 100;
// 	}

// 	if (value < target) {
// 		const range =
// 			target - minimum;

// 		if (range <= 0) {
// 			return 100;
// 		}

// 		const difference =
// 			(target - value) /
// 			range;

// 		return roundScore(
// 			100 - difference * 50,
// 		);
// 	}

// 	const range =
// 		maximum - target;

// 	if (range <= 0) {
// 		return 100;
// 	}

// 	const difference =
// 		(value - target) /
// 		range;

// 	return roundScore(
// 		100 - difference * 50,
// 	);
// }

// // =========================================================
// // FRAME STABILITY
// // =========================================================

// export function getStabilityScore(
// 	current: PreviousFrameMetrics,
// 	previous: PreviousFrameMetrics | null,
// ) {
// 	if (
// 		!ATTENTION_CONFIG.reliability
// 			.useTemporalStability ||
// 		!previous
// 	) {
// 		return 100;
// 	}

// 	const scores: number[] = [];

// 	addDifferenceScore(
// 		current.faceCenterX,
// 		previous.faceCenterX,
// 		ATTENTION_CONFIG.reliability
// 			.facePositionTolerance,
// 	);

// 	addDifferenceScore(
// 		current.faceCenterY,
// 		previous.faceCenterY,
// 		ATTENTION_CONFIG.reliability
// 			.facePositionTolerance,
// 	);

// 	addDifferenceScore(
// 		current.faceWidthRatio,
// 		previous.faceWidthRatio,
// 		ATTENTION_CONFIG.reliability
// 			.faceWidthTolerance,
// 	);

// 	addDifferenceScore(
// 		current.gazeX,
// 		previous.gazeX,
// 		ATTENTION_CONFIG.reliability
// 			.gazeTolerance,
// 	);

// 	addDifferenceScore(
// 		current.gazeY,
// 		previous.gazeY,
// 		ATTENTION_CONFIG.reliability
// 			.gazeTolerance,
// 	);

// 	if (scores.length === 0) {
// 		return 100;
// 	}

// 	return roundScore(
// 		scores.reduce(
// 			(total, score) =>
// 				total + score,
// 			0,
// 		) / scores.length,
// 	);

// 	function addDifferenceScore(
// 		currentValue: number | undefined,
// 		previousValue: number | undefined,
// 		tolerance: number,
// 	) {
// 		if (
// 			currentValue === undefined ||
// 			previousValue === undefined
// 		) {
// 			return;
// 		}

// 		const difference =
// 			Math.abs(
// 				currentValue -
// 					previousValue,
// 			);

// 		const score =
// 			100 -
// 			(difference / tolerance) *
// 				100;

// 		scores.push(
// 			roundScore(score),
// 		);
// 	}
// }

// // =========================================================
// // HEAD POSE
// //
// // Estimated yaw / pitch / roll from MediaPipe's
// // facial transformation matrix.
// // =========================================================

// export function getHeadPose(
// 	matrix?: TransformationMatrix,
// ): HeadPose | undefined {
// 	const data = matrix?.data;

// 	if (!data || data.length < 11) {
// 		return undefined;
// 	}

// 	// Rotation matrix.
// 	const r00 = data[0];
// 	const r10 = data[4];

// 	const r20 = data[8];
// 	const r21 = data[9];
// 	const r22 = data[10];

// 	const sy = Math.sqrt(
// 		r00 * r00 +
// 			r10 * r10,
// 	);

// 	const singular =
// 		sy < 0.000001;

// 	let rotationX = 0;
// 	let rotationY = 0;
// 	let rotationZ = 0;

// 	if (!singular) {
// 		rotationX =
// 			Math.atan2(
// 				r21,
// 				r22,
// 			);

// 		rotationY =
// 			Math.atan2(
// 				-r20,
// 				sy,
// 			);

// 		rotationZ =
// 			Math.atan2(
// 				r10,
// 				r00,
// 			);
// 	} else {
// 		rotationX = 0;

// 		rotationY =
// 			Math.atan2(
// 				-r20,
// 				sy,
// 			);

// 		rotationZ = 0;
// 	}

// 	let pitch =
// 		toDegrees(rotationX);

// 	let yaw =
// 		toDegrees(rotationY);

// 	let roll =
// 		toDegrees(rotationZ);

// 	if (
// 		ATTENTION_CONFIG.head.invertYaw
// 	) {
// 		yaw *= -1;
// 	}

// 	if (
// 		ATTENTION_CONFIG.head.invertPitch
// 	) {
// 		pitch *= -1;
// 	}

// 	if (
// 		ATTENTION_CONFIG.head.invertRoll
// 	) {
// 		roll *= -1;
// 	}

// 	return {
// 		yaw,
// 		pitch,
// 		roll,
// 	};
// }

// function toDegrees(radians: number) {
// 	return (
// 		radians *
// 		(180 / Math.PI)
// 	);
// }

// // =========================================================
// // TEMPORAL EVIDENCE
// // =========================================================

// export function addTemporalSample(
// 	samples: TemporalSample[],
// 	issue: MonitorIssue,
// 	now: number,
// ) {
// 	samples.push({
// 		timestamp: now,
// 		issue,
// 	});

// 	const oldestAllowed =
// 		now -
// 		ATTENTION_CONFIG.temporal
// 			.windowMs;

// 	while (
// 		samples.length > 0 &&
// 		samples[0].timestamp <
// 			oldestAllowed
// 	) {
// 		samples.shift();
// 	}

// 	while (
// 		samples.length >
// 		ATTENTION_CONFIG.temporal
// 			.maxSamples
// 	) {
// 		samples.shift();
// 	}
// }

// export function getTemporalEvidence(
// 	samples: TemporalSample[],
// ): TemporalEvidence {
// 	if (samples.length === 0) {
// 		return {
// 			negativePercent: 0,
// 			lookingPercent: 0,
// 			dominantNegativeIssue: null,
// 		};
// 	}

// 	let lookingCount = 0;
// 	let negativeCount = 0;

// 	const issueCounts =
// 		new Map<MonitorIssue, number>();

// 	for (const sample of samples) {
// 		if (
// 			sample.issue === "LOOKING"
// 		) {
// 			lookingCount += 1;

// 			continue;
// 		}

// 		negativeCount += 1;

// 		issueCounts.set(
// 			sample.issue,
// 			(issueCounts.get(
// 				sample.issue,
// 			) ?? 0) + 1,
// 		);
// 	}

// 	let dominantNegativeIssue:
// 		| MonitorIssue
// 		| null = null;

// 	let dominantCount = 0;

// 	for (const [
// 		issue,
// 		count,
// 	] of issueCounts.entries()) {
// 		if (count > dominantCount) {
// 			dominantNegativeIssue =
// 				issue;

// 			dominantCount = count;
// 		}
// 	}

// 	return {
// 		negativePercent:
// 			(negativeCount /
// 				samples.length) *
// 			100,

// 		lookingPercent:
// 			(lookingCount /
// 				samples.length) *
// 			100,

// 		dominantNegativeIssue,
// 	};
// }

// // =========================================================
// // HAND BOX
// // =========================================================

// export function createExpandedBox(
// 	points: Landmark[],
// 	expandX: number,
// 	expandY: number,
// ) {
// 	const xs = points.map(
// 		(point) => point.x,
// 	);

// 	const ys = points.map(
// 		(point) => point.y,
// 	);

// 	return {
// 		minX:
// 			Math.min(...xs) -
// 			expandX,

// 		maxX:
// 			Math.max(...xs) +
// 			expandX,

// 		minY:
// 			Math.min(...ys) -
// 			expandY,

// 		maxY:
// 			Math.max(...ys) +
// 			expandY,
// 	};
// }

// export function isPointInsideBox(
// 	point: Landmark,
// 	box: {
// 		minX: number;
// 		maxX: number;

// 		minY: number;
// 		maxY: number;
// 	},
// ) {
// 	return (
// 		point.x >= box.minX &&
// 		point.x <= box.maxX &&
// 		point.y >= box.minY &&
// 		point.y <= box.maxY
// 	);
// }