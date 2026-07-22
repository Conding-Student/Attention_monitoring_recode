// app/(public)/landing/components/FeaturesSection.tsx

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

import { meetingFeatures } from "../data/landing.data";
import type { LandingFeature } from "../types/landing.types";

interface MeetingFeatureCardProps {
	feature: LandingFeature;
}

function MeetingFeatureCard({
	feature,
}: MeetingFeatureCardProps) {
	const Icon = feature.icon;

	return (
		<article className="flex min-h-[190px] flex-col rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0a6a59]/30 hover:shadow-lg hover:shadow-gray-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/40 dark:hover:shadow-black/30">
			<div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9fbf5] text-[#07594b] transition-colors dark:bg-emerald-950/60 dark:text-emerald-400">
				<Icon size={19} strokeWidth={1.8} />
			</div>

			<h3 className="mb-2 text-base font-bold text-gray-800 transition-colors dark:text-slate-100">
				{feature.title}
			</h3>

			<p className="text-sm leading-6 text-gray-500 transition-colors dark:text-slate-400">
				{feature.description}
			</p>

			<Link
				href="/dashboard"
				className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-semibold text-[#07594b] transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
			>
				Learn more
				<ArrowRight size={13} />
			</Link>
		</article>
	);
}

export default function FeaturesSection() {
	return (
		<section
			id="documentation"
			className="relative border-t border-gray-100/70 bg-transparent px-5 py-24 sm:px-8 lg:px-14 lg:py-28 dark:border-slate-900/70"
		>
			<div className="relative z-10 mx-auto max-w-[1180px]">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-[#303234] transition-colors sm:text-4xl dark:text-slate-100">
						Everything you need to run
						<br />
						seamless meetings
					</h2>

					<p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-500 transition-colors dark:text-slate-400">
						A complete suite of tools designed for professional
						collaboration. Deploy your virtual workspace with
						confidence and total control.
					</p>
				</div>

				<div className="relative mt-14 overflow-hidden rounded-2xl bg-[linear-gradient(100deg,#0a5548_0%,#0d8977_52%,#17bfae_100%)] px-7 py-10 text-white shadow-xl shadow-emerald-950/10 sm:px-10 lg:px-24 lg:py-14 dark:bg-[linear-gradient(100deg,#042f2e_0%,#065f55_52%,#0f766e_100%)]">
					<div
						aria-hidden="true"
						className="absolute -right-14 -top-20 h-64 w-64 rotate-12 rounded-[48px] border border-white/30"
					/>

					<div
						aria-hidden="true"
						className="absolute -bottom-24 right-9 h-52 w-52 rotate-45 rounded-3xl border border-white/40 bg-white/5"
					/>

					<div className="relative z-10 flex max-w-3xl items-start gap-5">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-gray-800 dark:bg-slate-100">
							<Eye size={21} strokeWidth={1.8} />
						</div>

						<div>
							<h3 className="text-base font-bold">
								Attention Monitoring
							</h3>

							<p className="mt-2 text-sm leading-6 text-white/80">
								Automatically pauses video when the user steps
								away from the camera, and resumes when they
								return.
							</p>

							<Link
								href="/dashboard"
								className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#07594b] transition-transform hover:scale-[1.03]"
							>
								Learn more
								<ArrowRight size={14} />
							</Link>
						</div>
					</div>
				</div>

				<div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{meetingFeatures.map((feature) => (
						<MeetingFeatureCard
							key={feature.title}
							feature={feature}
						/>
					))}
				</div>

				<div className="mt-14 flex justify-center">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-2 rounded-lg bg-[#07594b] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#064c40] active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
					>
						Get Started for Free
						<ArrowRight size={16} />
					</Link>
				</div>
			</div>
		</section>
	);
}