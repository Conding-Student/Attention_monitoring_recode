// app/(public)/attention-monitoring/components/AttentionMonitoringCta.tsx

import Link from "next/link";
import {
	ArrowRight,
	TriangleAlert,
} from "lucide-react";

export default function AttentionMonitoringCta() {
	return (
		<section className="mx-auto max-w-[1180px] px-5 pb-24 sm:px-8 lg:px-14">
			<div className="rounded-3xl border border-gray-200 bg-white/80 px-6 py-12 text-center shadow-sm backdrop-blur-sm sm:px-10 dark:border-slate-800 dark:bg-slate-900/70">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9fbf5] text-[#07594b] dark:bg-emerald-950/60 dark:text-emerald-400">
					<TriangleAlert size={21} />
				</div>

				<h2 className="mt-6 text-2xl font-black tracking-[-0.02em] text-[#303234] sm:text-3xl dark:text-slate-100">
					Experience attention-aware meetings
				</h2>

				<p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 dark:text-slate-400">
					Start a meeting or join an existing room to experience the
					attention monitoring system in action.
				</p>

				<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
					<Link
						href="/create-meeting"
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#07594b] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#064c40] active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
					>
						Create Meeting
						<ArrowRight size={16} />
					</Link>

					<Link
						href="/join-meeting"
						className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
					>
						Join Meeting
					</Link>
				</div>
			</div>
		</section>
	);
}