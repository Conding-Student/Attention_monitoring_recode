// app/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
	ArrowRight,
	CirclePlus,
	Eye,
	MessageSquare,
	MicOff,
	Monitor,
	Moon,
	Settings,
	ShieldCheck,
	Sun,
	UserCheck,
	Users,
	Video,
	type LucideIcon,
} from "lucide-react";
import { useEffect } from "react";

interface Feature {
	title: string;
	description: string;
	icon: LucideIcon;
}

const heroFeatures: Feature[] = [
	{
		title: "Attention Monitoring",
		description:
			"Automatically pauses video when the user steps away from the camera, and resumes when they return.",
		icon: Eye,
	},
	{
		title: "Create & Join Meetings",
		description:
			"Instantly create or join a meeting with a shareable link or code.",
		icon: Video,
	},
	{
		title: "Screen Sharing",
		description:
			"Share your screen with all meeting participants in high definition.",
		icon: Monitor,
	},
];

const meetingFeatures: Feature[] = [
	{
		title: "Participant Approval",
		description:
			"Accept or reject participants before they enter the meeting.",
		icon: UserCheck,
	},
	{
		title: "Audio & Video Controls",
		description:
			"Toggle microphone and camera on or off for host and participants.",
		icon: Video,
	},
	{
		title: "Screen Sharing",
		description:
			"Share your screen with all meeting participants in high definition.",
		icon: Monitor,
	},
	{
		title: "Chat & Messaging",
		description:
			"Send messages and share files in real-time during the meeting.",
		icon: MessageSquare,
	},
	{
		title: "Mute Participants",
		description:
			"Keep order in large groups by muting individual or all participants.",
		icon: MicOff,
	},
	{
		title: "Granular Permissions",
		description:
			"Control who can use audio, video, chat, and screen sharing features.",
		icon: ShieldCheck,
	},
	{
		title: "Meeting Management",
		description:
			"Full host controls to remove participants and safely end sessions.",
		icon: Settings,
	},
	{
		title: "Create & Join Meetings",
		description:
			"Instantly create or join a meeting with a shareable link or code.",
		icon: CirclePlus,
	},
];

interface HeaderProps {
	onToggleTheme: () => void;
}

function Header({ onToggleTheme }: HeaderProps) {
	const navigationItems = [
		{ label: "Home", href: "#home" },
		{ label: "Features", href: "#features" },
		{ label: "Documentation", href: "#documentation" },
		{ label: "About", href: "#about" },
	];

	return (
		<header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
			<div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
				<Link href="#home" className="flex items-center gap-2.5">
					<div className="relative h-8 w-8 overflow-hidden rounded-lg">
						<Image
							src="/Bakawan_Logo.png"
							alt="Bakawan Data Analytics logo"
							fill
							priority
							sizes="32px"
							className="object-contain"
						/>
					</div>

					<span className="text-sm font-bold text-gray-800 transition-colors dark:text-slate-100">
						Bakawan Data Analytics
					</span>
				</Link>

				<nav className="hidden items-center gap-9 md:flex">
					{navigationItems.map((item) => (
						<Link
							key={item.label}
							href={item.href}
							className="group relative px-1 py-2 text-xs font-medium text-gray-600 transition-colors duration-300 hover:text-[#07594b] dark:text-slate-400 dark:hover:text-emerald-400"
						>
							{item.label}

							<span className="absolute bottom-0 left-0 h-px w-0 bg-[#07594b] transition-all duration-300 group-hover:w-full dark:bg-emerald-400" />
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={onToggleTheme}
						aria-label="Toggle color theme"
						title="Toggle color theme"
						className="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-all duration-300 hover:bg-emerald-50 hover:text-[#07594b] active:scale-90 sm:flex dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
					>
						<Sun
							size={16}
							strokeWidth={2}
							className="block dark:hidden"
						/>

						<Moon
							size={16}
							strokeWidth={2}
							className="hidden dark:block"
						/>
					</button>

					<Link
						href="/dashboard"
						className="rounded-lg bg-[#07594b] px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-[#064c40] active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
					>
						Create Meeting
					</Link>
				</div>
			</div>
		</header>
	);
}

function HeroFeatureCard({ feature }: { feature: Feature }) {
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

function MeetingFeatureCard({ feature }: { feature: Feature }) {
	const Icon = feature.icon;

	return (
		<article className="flex min-h-[190px] flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0a6a59]/30 hover:shadow-lg hover:shadow-gray-200/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40 dark:hover:shadow-black/30">
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

function BackgroundDecorations() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<Eye className="absolute left-[4%] top-[12%] h-10 w-10 rotate-12 text-cyan-100 transition-colors dark:text-emerald-950" />

			<CirclePlus className="absolute right-[8%] top-[9%] h-12 w-12 text-cyan-100 transition-colors dark:text-emerald-950" />

			<Video className="absolute left-[9%] top-[46%] h-9 w-9 -rotate-12 text-cyan-100 transition-colors dark:text-emerald-950" />

			<Monitor className="absolute right-[6%] top-[55%] h-11 w-11 rotate-6 text-cyan-100 transition-colors dark:text-emerald-950" />

			<MessageSquare className="absolute bottom-[14%] left-[18%] h-10 w-10 text-cyan-100 transition-colors dark:text-emerald-950" />

			<Settings className="absolute bottom-[10%] right-[19%] h-10 w-10 text-cyan-100 transition-colors dark:text-emerald-950" />

			<Users className="absolute left-1/2 top-[5%] h-10 w-10 -translate-x-1/2 text-cyan-100 transition-colors dark:text-emerald-950" />
		</div>
	);
}

export default function HeroPage() {
	useEffect(() => {
		const savedTheme = window.localStorage.getItem("theme");

		const systemPrefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;

		const shouldUseDark =
			savedTheme === "dark" ||
			(savedTheme === null && systemPrefersDark);

		const rootElement = document.documentElement;

		rootElement.classList.toggle("dark", shouldUseDark);
		rootElement.style.colorScheme = shouldUseDark
			? "dark"
			: "light";
	}, []);

	const toggleTheme = () => {
		const rootElement = document.documentElement;

		const nextThemeIsDark =
			!rootElement.classList.contains("dark");

		rootElement.classList.toggle(
			"dark",
			nextThemeIsDark,
		);

		rootElement.style.colorScheme = nextThemeIsDark
			? "dark"
			: "light";

		window.localStorage.setItem(
			"theme",
			nextThemeIsDark ? "dark" : "light",
		);
	};

	return (
		<div className="min-h-screen scroll-smooth bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
			<Header onToggleTheme={toggleTheme} />

			<main>
				<section
					id="home"
					className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-14 lg:pb-28 lg:pt-14"
				>
					<div className="relative z-10">
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
							action="/dashboard"
							method="get"
							className="mt-7 flex max-w-[510px] flex-col gap-3 sm:flex-row sm:items-center"
						>
							<input
								type="text"
								name="room"
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

					<div className="relative z-10 mx-auto min-h-[440px] w-full max-w-[800px] lg:-mt-28 lg:min-h-[735px] lg:translate-x-5">
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

				<section
					id="documentation"
					className="relative overflow-hidden border-t border-gray-50 bg-white px-5 py-24 transition-colors sm:px-8 lg:px-14 lg:py-28 dark:border-slate-900 dark:bg-slate-950"
				>
					<BackgroundDecorations />

					<div className="relative z-10 mx-auto max-w-[1180px]">
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-[#303234] transition-colors sm:text-4xl dark:text-slate-100">
								Everything you need to run
								<br />
								seamless meetings
							</h2>

							<p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-500 transition-colors dark:text-slate-400">
								A complete suite of tools designed for
								professional collaboration. Deploy your virtual
								workspace with confidence and total control.
							</p>
						</div>

						<div className="relative mt-14 overflow-hidden rounded-2xl bg-[linear-gradient(100deg,#0a5548_0%,#0d8977_52%,#17bfae_100%)] px-7 py-10 text-white sm:px-10 lg:px-24 lg:py-14 dark:bg-[linear-gradient(100deg,#042f2e_0%,#065f55_52%,#0f766e_100%)]">
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
										Automatically pauses video when the user
										steps away from the camera, and resumes
										when they return.
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
			</main>

			<footer
				id="about"
				className="mx-auto flex max-w-[1440px] flex-col gap-5 border-t border-gray-200 bg-white px-5 py-10 text-xs text-gray-500 transition-colors sm:px-8 md:flex-row md:items-center md:justify-between lg:px-14 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
			>
				<p>© 2026 Bakawan Data Analytics. All rights reserved.</p>

				<div className="flex items-center gap-6">
					<Link
						href="#about"
						className="transition-colors hover:text-[#07594b] dark:hover:text-emerald-400"
					>
						Privacy Policy
					</Link>

					<Link
						href="#about"
						className="transition-colors hover:text-[#07594b] dark:hover:text-emerald-400"
					>
						Terms of Service
					</Link>
				</div>
			</footer>
		</div>
	);
}