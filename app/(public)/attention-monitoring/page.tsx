// app/(public)/attention-monitoring/page.tsx

import AttentionMonitoringWorkspace from "./components/AttentionMonitoringWorkspace";
import AttentionMonitoringCta from "./components/AttentionMonitoringCta";
import DetectionStatesSection from "./components/DetectionStatesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PrivacySection from "./components/PrivacySection";

export default function AttentionMonitoringPage() {
	return (
		<>
			<AttentionMonitoringWorkspace />

			<DetectionStatesSection />

			<HowItWorksSection />

			<PrivacySection />

			<AttentionMonitoringCta />
		</>
	);
}