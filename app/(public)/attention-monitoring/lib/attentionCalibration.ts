// // app/(public)/attention-monitoring/lib/attentionCalibration.ts

// import { ATTENTION_CONFIG } from "../config/attentionConfig";

// import {
// 	isNumber,
// 	median,
// 	movingAverage,
// } from "./attentionMath";

// import type {
// 	AnalysisResult,
// 	CalibrationData,
// } from "./attentionTypes";

// export const EMPTY_CALIBRATION: CalibrationData =
// 	{
// 		eyeOpenRatio: null,

// 		gazeX: null,
// 		gazeY: null,

// 		faceWidthRatio: null,
// 	};

// // =========================================================
// // INITIAL CALIBRATION SAMPLE
// // =========================================================

// export function canUseCalibrationSample(
// 	analysis: AnalysisResult,
// ) {
// 	return (
// 		analysis.faceCount === 1 &&
// 		analysis.isReliable &&
// 		!analysis.handOverEyes &&
// 		analysis.eyeOpenRatio !==
// 			undefined &&
// 		analysis.eyeOpenRatio >=
// 			ATTENTION_CONFIG.calibration
// 				.minimumOpenEyeRatio &&
// 		analysis.gazeX !== undefined &&
// 		analysis.gazeY !== undefined &&
// 		analysis.faceWidthRatio !==
// 			undefined
// 	);
// }

// // =========================================================
// // BUILD INITIAL BASELINE
// // =========================================================

// export function buildCalibration(
// 	samples: AnalysisResult[],
// ): CalibrationData {
// 	return {
// 		eyeOpenRatio:
// 			ATTENTION_CONFIG.calibration
// 				.learnEyeOpenRatio
// 				? median(
// 						samples
// 							.map(
// 								(item) =>
// 									item.eyeOpenRatio,
// 							)
// 							.filter(isNumber),
// 					)
// 				: null,

// 		gazeX:
// 			ATTENTION_CONFIG.calibration
// 				.learnGazeCenter
// 				? median(
// 						samples
// 							.map(
// 								(item) =>
// 									item.gazeX,
// 							)
// 							.filter(isNumber),
// 					)
// 				: null,

// 		gazeY:
// 			ATTENTION_CONFIG.calibration
// 				.learnGazeCenter
// 				? median(
// 						samples
// 							.map(
// 								(item) =>
// 									item.gazeY,
// 							)
// 							.filter(isNumber),
// 					)
// 				: null,

// 		faceWidthRatio:
// 			ATTENTION_CONFIG.calibration
// 				.learnFaceDistance
// 				? median(
// 						samples
// 							.map(
// 								(item) =>
// 									item.faceWidthRatio,
// 							)
// 							.filter(isNumber),
// 					)
// 				: null,
// 	};
// }

// // =========================================================
// // SAFE CONTINUOUS LEARNING
// //
// // Only use this when the user is confidently attentive.
// // =========================================================

// export function adaptCalibration(
// 	current: CalibrationData,
// 	analysis: AnalysisResult,
// ): CalibrationData {
// 	const rate =
// 		ATTENTION_CONFIG
// 			.adaptiveCalibration
// 			.learningRate;

// 	return {
// 		eyeOpenRatio:
// 			updateValue(
// 				current.eyeOpenRatio,

// 				analysis.eyeOpenRatio,

// 				ATTENTION_CONFIG
// 					.adaptiveCalibration
// 					.updateEyeOpenRatio,

// 				rate,
// 			),

// 		gazeX:
// 			updateValue(
// 				current.gazeX,

// 				analysis.gazeX,

// 				ATTENTION_CONFIG
// 					.adaptiveCalibration
// 					.updateGazeCenter,

// 				rate,
// 			),

// 		gazeY:
// 			updateValue(
// 				current.gazeY,

// 				analysis.gazeY,

// 				ATTENTION_CONFIG
// 					.adaptiveCalibration
// 					.updateGazeCenter,

// 				rate,
// 			),

// 		faceWidthRatio:
// 			updateValue(
// 				current.faceWidthRatio,

// 				analysis.faceWidthRatio,

// 				ATTENTION_CONFIG
// 					.adaptiveCalibration
// 					.updateFaceDistance,

// 				rate,
// 			),
// 	};
// }

// function updateValue(
// 	current: number | null,
// 	next: number | undefined,
// 	enabled: boolean,
// 	rate: number,
// ) {
// 	if (
// 		!enabled ||
// 		next === undefined
// 	) {
// 		return current;
// 	}

// 	if (current === null) {
// 		return next;
// 	}

// 	return movingAverage(
// 		current,
// 		next,
// 		rate,
// 	);
// }