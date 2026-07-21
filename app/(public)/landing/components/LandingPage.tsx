// app/(public)/landing/components/LandingPage.tsx

import PublicHeader from "@/shared/ui/PublicHeader";

import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
	return (
		<div className="min-h-dvh bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
			<PublicHeader />

			<main>
				<HeroSection />
				<FeaturesSection />
			</main>

			<LandingFooter />
		</div>
	);
}