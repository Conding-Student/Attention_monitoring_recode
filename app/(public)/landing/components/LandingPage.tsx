// app/(public)/_landing/components/LandingPage.tsx

import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
			<LandingHeader />

			<main>
				<HeroSection />
				<FeaturesSection />
			</main>

			<LandingFooter />
		</div>
	);
}