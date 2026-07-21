// app/(public)/join-meeting/page.tsx

import JoinMeetingPage from "./components/JoinMeetingPage";

interface JoinMeetingRouteProps {
	searchParams: Promise<{
		code?: string | string[];
	}>;
}

export default async function JoinMeetingRoute({
	searchParams,
}: JoinMeetingRouteProps) {
	const resolvedSearchParameters = await searchParams;

	const initialMeetingValue =
		typeof resolvedSearchParameters.code === "string"
			? resolvedSearchParameters.code
			: "";

	return (
		<JoinMeetingPage
			initialMeetingValue={initialMeetingValue}
		/>
	);
}