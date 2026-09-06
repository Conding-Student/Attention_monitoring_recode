
// app/(public)/attention-monitoring/components/DetectionStatesSection.tsx

import {
	Eye,
	Moon,
	ScanFace,
	VideoOff,
} from "lucide-react";

interface DetectionCardProps {
	icon: React.ReactNode;
	title: string;
	status: string;
	description: string;
}

function DetectionCard({
	icon,
	title,
	status,
	description,
}: DetectionCardProps) {
	return (
		<article className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
			<div className="flex items-start justify-between gap-4">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9fbf5] text-[#07594b] dark:bg-emerald-950/60 dark:text-emerald-400">
					{icon}
				</div>

				<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
					{status}
				</span>
			</div>

			<h3 className="mt-5 text-sm font-bold text-gray-800 dark:text-slate-100">
				{title}
			</h3>

			<p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
				{description}
			</p>
		</article>
	);
}

export default function DetectionStatesSection() {
	return (
		<section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
			<div className="mx-auto max-w-2xl text-center">
				<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0a8977] dark:text-emerald-400">
					Detection States
				</p>

				<h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#303234] sm:text-4xl dark:text-slate-100">
					Know what is happening
					<br className="hidden sm:block" />
					during the meeting
				</h2>

				<p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-500 dark:text-slate-400">
					The monitoring engine evaluates participant activity and
					converts it into simple attention states that can be
					understood immediately.
				</p>
			</div>

			<div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<DetectionCard
					icon={<Eye size={19} strokeWidth={1.8} />}
					title="Looking Away"
					status="LOOKING_AWAY"
					description="Detects when the participant appears to be looking away from the meeting for a period of time."
				/>

				<DetectionCard
					icon={<ScanFace size={19} strokeWidth={1.8} />}
					title="No Face"
					status="NO_FACE"
					description="Detects when no participant face is currently visible within the camera frame."
				/>

				<DetectionCard
					icon={<Moon size={19} strokeWidth={1.8} />}
					title="Sleeping"
					status="SLEEPING"
					description="Detects prolonged eye closure that may indicate the participant has fallen asleep."
				/>

				<DetectionCard
					icon={<VideoOff size={19} strokeWidth={1.8} />}
					title="Camera Off"
					status="CAMERA_OFF"
					description="Identifies when the participant disables or loses access to their camera."
				/>
			</div>
		</section>
	);
}