// app/(public)/landing/components/LandingPage.tsx

import PublicBackgroundDecorations from "@/shared/ui/PublicBackgroundDecorations";
import PublicFooter from "@/shared/ui/PublicFooter";
import PublicHeader from "@/shared/ui/PublicHeader";

import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";

export default function LandingPage() {
	return (
		<div className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
			<PublicBackgroundDecorations />

			<div className="relative z-10 flex min-h-dvh flex-col">
				<PublicHeader />

				<main className="relative flex-1">
					<HeroSection />
					<FeaturesSection />
				</main>

				<PublicFooter />
			</div>
		</div>
	);
}