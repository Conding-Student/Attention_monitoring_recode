// app/(public)/create-meeting/hooks/useCreateMeeting.ts

"use client";

import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useRouter } from "next/navigation";

type CopiedField = "code" | "link" | null;

interface UseCreateMeetingParameters {
	initialMeetingCode: string;
}

const APP_BASE_URL = (
	process.env.NEXT_PUBLIC_APP_URL ??
	"http://localhost:3000"
).replace(/\/$/, "");

export function useCreateMeeting({
	initialMeetingCode,
}: UseCreateMeetingParameters) {
	const router = useRouter();

	const copiedTimeoutReference =
		useRef<ReturnType<typeof setTimeout> | null>(null);

	const [meetingName, setMeetingName] = useState("");
	const [copiedField, setCopiedField] =
		useState<CopiedField>(null);
	const [error, setError] = useState<string | null>(null);

	const meetingSlug = useMemo(
		() => initialMeetingCode.toLowerCase(),
		[initialMeetingCode],
	);

	const shareLink = useMemo(
		() => `${APP_BASE_URL}/meeting/${meetingSlug}`,
		[meetingSlug],
	);

	const displayShareLink = useMemo(
		() => shareLink.replace(/^https?:\/\//, ""),
		[shareLink],
	);

	useEffect(() => {
		return () => {
			if (copiedTimeoutReference.current) {
				clearTimeout(copiedTimeoutReference.current);
			}
		};
	}, []);

	const markAsCopied = useCallback(
		(field: Exclude<CopiedField, null>) => {
			if (copiedTimeoutReference.current) {
				clearTimeout(copiedTimeoutReference.current);
			}

			setCopiedField(field);

			copiedTimeoutReference.current = setTimeout(() => {
				setCopiedField(null);
			}, 1800);
		},
		[],
	);

	const copyValue = useCallback(
		async (
			value: string,
			field: Exclude<CopiedField, null>,
		) => {
			setError(null);

			try {
				await navigator.clipboard.writeText(value);
				markAsCopied(field);
			} catch {
				setError(
					"Unable to copy automatically. Please copy it manually.",
				);
			}
		},
		[markAsCopied],
	);

	const copyMeetingCode = useCallback(async () => {
		await copyValue(initialMeetingCode, "code");
	}, [copyValue, initialMeetingCode]);

	const copyShareLink = useCallback(async () => {
		await copyValue(shareLink, "link");
	}, [copyValue, shareLink]);

	const handleMeetingNameChange = useCallback(
		(value: string) => {
			setMeetingName(value);

			if (error) {
				setError(null);
			}
		},
		[error],
	);

	const startMeeting = useCallback(() => {
		const normalizedMeetingName = meetingName.trim();

		if (!normalizedMeetingName) {
			setError("Please provide a meeting name.");
			return;
		}

		const searchParameters = new URLSearchParams({
			meetingCode: initialMeetingCode,
			meetingName: normalizedMeetingName,
			role: "host",
		});

		/*
		 * Temporary destination while the actual
		 * /meeting/[roomname] page is not yet available.
		 *
		 * Later, this may be changed to:
		 * router.push(`/meeting/${meetingSlug}?${searchParameters}`)
		 */
		router.push(`/dashboard?${searchParameters.toString()}`);
	}, [
		initialMeetingCode,
		meetingName,
		router,
	]);

	return {
		meetingName,
		meetingCode: initialMeetingCode,
		shareLink,
		displayShareLink,
		copiedField,
		error,
		handleMeetingNameChange,
		copyMeetingCode,
		copyShareLink,
		startMeeting,
	};
}