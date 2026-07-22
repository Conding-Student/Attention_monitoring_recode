// shared/ui/PublicFooter.tsx

import Link from "next/link";

export default function PublicFooter() {
	return (
		<footer className="mt-auto border-t border-gray-100 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
			<div className="pb-[env(safe-area-inset-bottom)]">
				<div className="mx-auto flex min-h-14 max-w-[1440px] flex-col items-center justify-center gap-2 px-4 py-3 sm:flex-row sm:justify-between sm:px-8 lg:px-14">
					<p className="text-center text-[10px] font-medium text-gray-400 sm:text-left sm:text-xs dark:text-slate-500">
						© 2026 Bakawan Data Analytics
					</p>

					<div className="flex items-center gap-5">
						<Link
							href="/#about"
							className="text-[10px] text-gray-400 transition-colors hover:text-[#07594b] sm:text-xs dark:text-slate-500 dark:hover:text-emerald-400"
						>
							Privacy Policy
						</Link>

						<Link
							href="/#about"
							className="text-[10px] text-gray-400 transition-colors hover:text-[#07594b] sm:text-xs dark:text-slate-500 dark:hover:text-emerald-400"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}