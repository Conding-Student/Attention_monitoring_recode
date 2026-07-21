// app/(public)/_landing/components/HeroSection.tsx

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { heroFeatures } from "../data/landing.data";
import type { LandingFeature } from "../types/landing.types";

interface HeroFeatureCardProps {
	feature: LandingFeature;
}

function HeroFeatureCard({
	feature,
}: HeroFeatureCardProps) {
	const Icon = feature.icon;

	return (
		<article className="flex min-h-[235px] flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0a6a59]/30 hover:shadow-lg hover:shadow-gray-200/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40 dark:hover:shadow-black/30">
			<div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9fbf5] text-[#07594b] transition-colors dark:bg-emerald-950/60 dark:text-emerald-400">
				<Icon size={20} strokeWidth={1.8} />
			</div>

			<h3 className="mb-3 text-base font-bold leading-tight text-gray-800 transition-colors dark:text-slate-100">
				{feature.title}
			</h3>

			<p className="text-sm leading-6 text-gray-500 transition-colors dark:text-slate-400">
				{feature.description}
			</p>

			<Link
				href="#documentation"
				className="mt-auto flex items-center gap-1.5 pt-6 text-xs font-semibold text-[#07594b] transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
			>
				Explore
				<ArrowRight size={13} />
			</Link>
		</article>
	);
}

export default function HeroSection() {
	return (
		<section
			id="home"
			className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-14 lg:pb-28 lg:pt-14"
		>
			<div className="relative z-20">
				<h1 className="max-w-[620px] text-[42px] font-black leading-[0.98] tracking-[-0.04em] text-[#303234] transition-colors sm:text-5xl lg:text-[58px] dark:text-slate-100">
					Attention Monitoring
					<br />
					Website Demonstration
				</h1>

				<p className="mt-7 max-w-[620px] text-sm leading-7 text-gray-500 transition-colors sm:text-base dark:text-slate-400">
					Deploy your analytics engine in seconds using our
					standardized, pre-configured Next.js template.
					Designed for scale and maximum visual impact.
				</p>

				<form
					action="/join-meeting"
					method="get"
					className="mt-7 flex max-w-[510px] flex-col gap-3 sm:flex-row sm:items-center"
				>
					<input
						type="text"
						name="code"
						placeholder="Example: viw-m4b81"
						className="h-11 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#0a6a59] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500"
					/>

					<button
						type="submit"
						className="flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#07594b] transition-colors hover:bg-[#e9fbf5] dark:text-emerald-400 dark:hover:bg-emerald-950/50"
					>
						Join Meeting
						<ArrowRight size={17} />
					</button>
				</form>

				<div
					id="features"
					className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3"
				>
					{heroFeatures.map((feature) => (
						<HeroFeatureCard
							key={feature.title}
							feature={feature}
						/>
					))}
				</div>
			</div>

			<div className="relative z-10 mx-auto min-h-[440px] w-full max-w-[800px] lg:-mt-28 lg:min-h-[720px] lg:translate-x-5">
				<div className="absolute inset-10 rounded-full bg-emerald-100/40 blur-3xl transition-colors dark:bg-emerald-900/10" />

				<Image
					src="/landingpage_sidepanel.png"
					alt="Attention monitoring meeting interface"
					fill
					priority
					sizes="(max-width: 1024px) 100vw, 55vw"
					className="object-contain object-top"
				/>
			</div>
		</section>
	);
}