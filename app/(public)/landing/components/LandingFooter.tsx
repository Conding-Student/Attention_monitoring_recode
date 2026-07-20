// app/(public)/_landing/components/LandingFooter.tsx

import Link from "next/link";

export default function LandingFooter() {
	return (
		<footer
			id="about"
			className="mx-auto flex max-w-[1440px] flex-col gap-5 border-t border-gray-200 bg-white px-5 py-10 text-xs text-gray-500 transition-colors sm:px-8 md:flex-row md:items-center md:justify-between lg:px-14 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
		>
			<p>
				© 2026 Bakawan Data Analytics. All rights
				reserved.
			</p>

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
	);
}