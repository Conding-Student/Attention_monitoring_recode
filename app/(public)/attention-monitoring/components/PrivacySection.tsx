// app/(public)/attention-monitoring/components/PrivacySection.tsx

import { ShieldCheck } from "lucide-react";

export default function PrivacySection() {
	return (
		<section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-14">
			<div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(100deg,#0a5548_0%,#0d8977_52%,#17bfae_100%)] px-7 py-10 text-white shadow-xl shadow-emerald-950/10 sm:px-10 lg:px-14 lg:py-12 dark:bg-[linear-gradient(100deg,#042f2e_0%,#065f55_52%,#0f766e_100%)]">
				<div
					aria-hidden="true"
					className="absolute -right-14 -top-20 h-64 w-64 rotate-12 rounded-[48px] border border-white/20"
				/>

				<div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#07594b]">
						<ShieldCheck size={22} />
					</div>

					<div>
						<h2 className="text-xl font-bold">
							Privacy-focused monitoring
						</h2>

						<p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
							Attention analysis can be performed directly in the
							participant&apos;s browser. Instead of continuously
							uploading camera frames for analysis, the
							application can send only the resulting attention
							state when needed.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}