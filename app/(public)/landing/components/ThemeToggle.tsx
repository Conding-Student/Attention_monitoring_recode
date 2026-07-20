// app/(public)/landing/components/ThemeToggle.tsx

"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
	const { toggleTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label="Toggle color theme"
			title="Toggle color theme"
			className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-all duration-300 hover:bg-emerald-50 hover:text-[#07594b] active:scale-90 dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
		>
			<Sun
				size={17}
				strokeWidth={2}
				className="block dark:hidden"
			/>

			<Moon
				size={17}
				strokeWidth={2}
				className="hidden dark:block"
			/>
		</button>
	);
}