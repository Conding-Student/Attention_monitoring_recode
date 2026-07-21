// app/(public)/landing/components/LandingHeader.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { navigationItems } from "../data/landing.data";
import ThemeToggle from "./ThemeToggle";

export default function LandingHeader() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen((currentState) => !currentState);
	};

	return (
		<header className="sticky top-0 z-50 border-b border-gray-100 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
			<div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
				{/* Logo and brand */}
				<Link
					href="#home"
					onClick={closeMobileMenu}
					className="flex min-w-0 items-center gap-2.5"
				>
					<div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
						<Image
							src="/Bakawan_Logo.png"
							alt="Bakawan Data Analytics logo"
							fill
							priority
							sizes="32px"
							className="object-contain"
						/>
					</div>

					<span className="hidden text-sm font-bold text-gray-800 transition-colors lg:block dark:text-slate-100">
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
				<div className="flex items-center gap-2 sm:gap-3">
					<ThemeToggle />

					<Link
						href="/create-meeting"
						className="hidden rounded-lg bg-[#07594b] px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-[#064c40] active:scale-[0.98] lg:inline-flex dark:bg-emerald-600 dark:hover:bg-emerald-500"
					>
						Create Meeting
					</Link>

					<button
						type="button"
						onClick={toggleMobileMenu}
						aria-label={
							isMobileMenuOpen
								? "Close navigation menu"
								: "Open navigation menu"
						}
						aria-expanded={isMobileMenuOpen}
						aria-controls="mobile-navigation"
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-all hover:bg-emerald-50 hover:text-[#07594b] active:scale-90 lg:hidden dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
					>
						{isMobileMenuOpen ? (
							<X size={20} strokeWidth={2} />
						) : (
							<Menu size={20} strokeWidth={2} />
						)}
					</button>
				</div>
			</div>

			{/* Mobile navigation */}
			{isMobileMenuOpen && (
				<div
					id="mobile-navigation"
					className="border-t border-gray-100 bg-white px-5 pb-6 pt-4 lg:hidden dark:border-slate-800 dark:bg-slate-950"
				>
					<nav className="mx-auto flex max-w-[1440px] flex-col gap-1">
						{navigationItems.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								onClick={closeMobileMenu}
								className="group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-[#07594b] dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
							>
								{item.label}

								<span className="h-1.5 w-1.5 rounded-full bg-[#07594b] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-emerald-400" />
							</Link>
						))}

						<Link
							href="/dashboard"
							onClick={closeMobileMenu}
							className="mt-3 flex items-center justify-center rounded-lg bg-[#07594b] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#064c40] active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
						>
							Create Meeting
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
}