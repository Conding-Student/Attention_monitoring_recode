// app/(public)/create-meeting/page.tsx

import { randomInt } from "node:crypto";

import CreateMeetingPage from "./components/CreateMeetingPage";

// Gumawa ng bagong meeting code sa bawat pag-open ng page.
export const dynamic = "force-dynamic";

const ALLOWED_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function getRandomLetter(): string {
	const randomIndex = randomInt(0, ALLOWED_LETTERS.length);

	return ALLOWED_LETTERS[randomIndex];
}

function generateMeetingCode(): string {
	const prefix = Array.from(
		{ length: 3 },
		() => getRandomLetter(),
	).join("");

	const number = randomInt(1000, 10000);
	const suffix = getRandomLetter();

	return `${prefix}-${number}-${suffix}`;
}

export default function CreateMeetingRoute() {
	const initialMeetingCode = generateMeetingCode();

	return (
		<CreateMeetingPage
			initialMeetingCode={initialMeetingCode}
		/>
	);
}