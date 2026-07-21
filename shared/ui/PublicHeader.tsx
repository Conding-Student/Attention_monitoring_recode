// shared/ui/PublicHeader.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	ArrowRight,
	CalendarDays,
	Menu,
	X,
} from "lucide-react";

import ThemeToggle from "@/shared/ui/ThemeToggle";

interface NavigationItem {
	label: string;
	href: string;
}

const navigationItems: NavigationItem[] = [
	{
		label: "Home",
		href: "/#home",
	},
	{
		label: "Features",
		href: "/#features",
	},
	{
		label: "Documentation",
		href: "/#documentation",
	},
	{
		label: "About",
		href: "/#about",
	},
];

export default function PublicHeader() {
	const pathname = usePathname();

	const [isMobileMenuOpen, setIsMobileMenuOpen] =
		useState(false);

	const isMeetingActionPage =
		pathname === "/create-meeting" ||
		pathname.startsWith("/create-meeting/") ||
		pathname === "/join-meeting" ||
		pathname.startsWith("/join-meeting/") ||
		pathname === "/schedule-meeting" ||
		pathname.startsWith("/schedule-meeting/");

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen((currentValue) => !currentValue);
	};

	return (
		<header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
			<div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-8 lg:px-14">
				{/* Logo and permanent brand name */}
				<Link
					href="/"
					onClick={closeMobileMenu}
					className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
				>
					<div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
						<Image
							src="/Bakawan_Logo.png"
							alt="Bakawan Data Analytics logo"
							fill
							priority
							sizes="36px"
							className="object-contain"
						/>
					</div>

					<span className="whitespace-nowrap text-[10px] font-bold leading-tight text-gray-800 transition-colors min-[380px]:text-xs sm:text-sm dark:text-slate-100">
						Bakawan Data Analytics
					</span>
				</Link>

				{/* Desktop navigation */}
				<nav className="hidden items-center gap-9 lg:flex">
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

				{/* Header actions */}
				<div className="flex shrink-0 items-center gap-1 sm:gap-3">
					<ThemeToggle />

					{/* Desktop Create Meeting: landing page only */}
					{!isMeetingActionPage && (
						<Link
							href="/create-meeting"
							className="hidden items-center gap-2 rounded-lg bg-[#07594b] px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-[#064c40] active:scale-[0.98] lg:inline-flex dark:bg-emerald-600 dark:hover:bg-emerald-500"
						>
							Create Meeting
						</Link>
					)}

					<button
						type="button"
						onClick={toggleMobileMenu}
						aria-label={
							isMobileMenuOpen
								? "Close navigation menu"
								: "Open navigation menu"
						}
						aria-expanded={isMobileMenuOpen}
						aria-controls="public-mobile-navigation"
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-all duration-300 hover:bg-emerald-50 hover:text-[#07594b] active:scale-90 lg:hidden dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
					>
						{isMobileMenuOpen ? (
							<X size={21} strokeWidth={2} />
						) : (
							<Menu size={21} strokeWidth={2} />
						)}
					</button>
				</div>
			</div>

			{/* Mobile navigation */}
			{isMobileMenuOpen && (
				<div
					id="public-mobile-navigation"
					className="absolute left-0 right-0 top-full border-t border-gray-100 bg-white/95 shadow-xl shadow-gray-900/10 backdrop-blur-xl lg:hidden dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/30"
				>
					<nav className="mx-auto max-w-[1440px] px-4 py-4 sm:px-8">
						<div className="flex flex-col gap-1">
							{navigationItems.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									onClick={closeMobileMenu}
									className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-[#07594b] dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
								>
									{item.label}

									<ArrowRight
										size={16}
										className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
									/>
								</Link>
							))}
						</div>

						<div className="my-4 h-px bg-gray-100 dark:bg-slate-800" />

						{/* Meeting buttons: landing page only */}
						{!isMeetingActionPage && (
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
								<Link
									href="/schedule-meeting"
									onClick={closeMobileMenu}
									className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#07594b]/30 hover:bg-emerald-50 hover:text-[#07594b] dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
								>
									<CalendarDays size={17} />
									Schedule Meeting
								</Link>

								<Link
									href="/create-meeting"
									onClick={closeMobileMenu}
									className="flex items-center justify-center gap-2 rounded-xl bg-[#07594b] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#064c40] dark:bg-emerald-600 dark:hover:bg-emerald-500"
								>
									Create Meeting
									<ArrowRight size={17} />
								</Link>
							</div>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}