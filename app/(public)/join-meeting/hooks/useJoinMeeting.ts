// app/(public)/join-meeting/hooks/useJoinMeeting.ts

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface UseJoinMeetingParameters {
	initialMeetingValue?: string;
}

function extractMeetingIdentifier(value: string): string {
	const normalizedValue = value.trim();

	if (!normalizedValue) {
		return "";
	}

	const isFullUrl =
		normalizedValue.startsWith("http://") ||
		normalizedValue.startsWith("https://");

	if (isFullUrl) {
		try {
			const parsedUrl = new URL(normalizedValue);

			const pathSegments = parsedUrl.pathname
				.split("/")
				.filter(Boolean);

			const meetingSegmentIndex =
				pathSegments.lastIndexOf("meeting");

			if (
				meetingSegmentIndex >= 0 &&
				pathSegments[meetingSegmentIndex + 1]
			) {
				return pathSegments[meetingSegmentIndex + 1];
			}

			return pathSegments.at(-1) ?? "";
		} catch {
			return "";
		}
	}

	const valueWithoutQuery = normalizedValue
		.split("?")[0]
		.split("#")[0];

	const pathSegments = valueWithoutQuery
		.split("/")
		.filter(Boolean);

	return pathSegments.at(-1) ?? "";
}

function isValidMeetingIdentifier(value: string): boolean {
	return /^[a-zA-Z0-9_-]{3,100}$/.test(value);
}

export function useJoinMeeting({
	initialMeetingValue = "",
}: UseJoinMeetingParameters) {
	const router = useRouter();

	const [meetingValue, setMeetingValue] = useState(
		initialMeetingValue,
	);

	const [error, setError] = useState<string | null>(null);

	const handleMeetingValueChange = useCallback(
		(value: string) => {
			setMeetingValue(value);

			if (error) {
				setError(null);
			}
		},
		[error],
	);

	const joinMeeting = useCallback(() => {
		const meetingIdentifier =
			extractMeetingIdentifier(meetingValue);

		if (!meetingValue.trim()) {
			setError("Please enter a meeting code or link.");
			return;
		}

		if (!meetingIdentifier) {
			setError(
				"We could not find a valid meeting code in that link.",
			);
			return;
		}

		if (!isValidMeetingIdentifier(meetingIdentifier)) {
			setError(
				"Please enter a valid meeting code or meeting link.",
			);
			return;
		}

		const searchParameters = new URLSearchParams({
			role: "participant",
		});

		router.push(
			`/meeting/${encodeURIComponent(
				meetingIdentifier,
			)}?${searchParameters.toString()}`,
		);
	}, [meetingValue, router]);

	return {
		meetingValue,
		error,
		handleMeetingValueChange,
		joinMeeting,
	};
}