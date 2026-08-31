// app/(public)/create-meeting/page.tsx

import CreateMeetingPage from "./components/CreateMeetingPage";
import { generateMeetingCode } from "@/shared/utils/generateMeetingCode";

export const dynamic = "force-dynamic";

export default function CreateMeetingRoute() {
	const initialMeetingCode = generateMeetingCode();

	return (
		<CreateMeetingPage
			initialMeetingCode={initialMeetingCode}
		/>
	);
}