// app/(public)/attention-monitoring/page.tsx

import AttentionMonitoringWorkspace from "./components/AttentionMonitoringWorkspace";
import AttentionMonitoringCta from "./components/AttentionMonitoringCta";
import DetectionStatesSection from "./components/DetectionStatesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PrivacySection from "./components/PrivacySection";

export default async function AttentionMonitoringPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string | string[] }>;
}) {
	const { token: tokenParam } = await searchParams;
	const token = typeof tokenParam === "string" ? tokenParam.trim() : "";

	if (!token) {
		return (
			<main className="mx-auto max-w-xl px-6 py-20 text-center">
				<h1 className="text-2xl font-bold">Token required</h1>
				<p className="mt-3 text-gray-500">
					Open attention monitoring using the link with a token provided by your website.
				</p>
			</main>
		);
	}

	return (
		<>
			<AttentionMonitoringWorkspace key={token} token={token} />

			<DetectionStatesSection />

			<HowItWorksSection />

			<PrivacySection />

			<AttentionMonitoringCta />
		</>
	);
}
