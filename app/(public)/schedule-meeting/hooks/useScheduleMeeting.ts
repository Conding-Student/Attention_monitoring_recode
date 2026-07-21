// app/(public)/schedule-meeting/hooks/useScheduleMeeting.ts

"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface ScheduleMeetingForm {
	meetingName: string;
	date: string;
	time: string;
	duration: string;
	notes: string;
}

type ScheduleMeetingField = keyof ScheduleMeetingForm;

const initialForm: ScheduleMeetingForm = {
	meetingName: "",
	date: "",
	time: "",
	duration: "",
	notes: "",
};

function getLocalDateInputValue(date: Date): string {
	const timezoneOffset = date.getTimezoneOffset() * 60_000;
	const localDate = new Date(date.getTime() - timezoneOffset);

	return localDate.toISOString().slice(0, 10);
}

export function useScheduleMeeting() {
	const router = useRouter();

	const [form, setForm] =
		useState<ScheduleMeetingForm>(initialForm);

	const [error, setError] = useState<string | null>(null);

	const minimumDate = useMemo(
		() => getLocalDateInputValue(new Date()),
		[],
	);

	const updateField = useCallback(
		(field: ScheduleMeetingField, value: string) => {
			setForm((currentForm) => ({
				...currentForm,
				[field]: value,
			}));

			setError(null);
		},
		[],
	);

	const scheduleMeeting = useCallback(() => {
		const meetingName = form.meetingName.trim();

		if (!meetingName) {
			setError("Please provide a meeting name.");
			return;
		}

		if (!form.date) {
			setError("Please select a meeting date.");
			return;
		}

		if (!form.time) {
			setError("Please select a meeting time.");
			return;
		}

		if (!form.duration) {
			setError("Please select a meeting duration.");
			return;
		}

		const scheduledDateTime = new Date(
			`${form.date}T${form.time}:00`,
		);

		if (Number.isNaN(scheduledDateTime.getTime())) {
			setError("The selected date or time is invalid.");
			return;
		}

		if (scheduledDateTime.getTime() <= Date.now()) {
			setError(
				"Please schedule the meeting for a future date and time.",
			);
			return;
		}

		const searchParameters = new URLSearchParams({
			mode: "scheduled",
			meetingName,
			date: form.date,
			time: form.time,
			duration: form.duration,
		});

		const notes = form.notes.trim();

		if (notes) {
			searchParameters.set("notes", notes);
		}

		/*
		 * Temporary destination.
		 *
		 * Kapag mayroon nang scheduling API, dito papalitan
		 * ng API request bago mag-redirect sa confirmation page.
		 */
		router.push(
			`/dashboard?${searchParameters.toString()}`,
		);
	}, [form, router]);

	return {
		form,
		error,
		minimumDate,
		updateField,
		scheduleMeeting,
	};
}