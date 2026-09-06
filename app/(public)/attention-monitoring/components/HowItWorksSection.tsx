// app/(public)/attention-monitoring/components/HowItWorksSection.tsx

import {
	BellRing,
	Camera,
	Eye,
	ScanFace,
} from "lucide-react";

interface ProcessStepProps {
	number: string;
	title: string;
	description: string;
}

function ProcessStep({
	number,
	title,
	description,
}: ProcessStepProps) {
	return (
		<div className="flex gap-4">
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#07594b] text-xs font-bold text-white dark:bg-emerald-600">
				{number}
			</div>

			<div>
				<h3 className="text-sm font-bold text-gray-800 dark:text-slate-100">
					{title}
				</h3>

				<p className="mt-1.5 text-sm leading-6 text-gray-500 dark:text-slate-400">
					{description}
				</p>
			</div>
		</div>
	);
}

interface FlowItemProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function FlowItem({
	icon,
	title,
	description,
}: FlowItemProps) {
	return (
		<div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
			<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9fbf5] text-[#07594b] dark:bg-emerald-950/60 dark:text-emerald-400">
				{icon}
			</div>

			<div>
				<p className="text-sm font-bold text-gray-800 dark:text-slate-100">
					{title}
				</p>

				<p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
					{description}
				</p>
			</div>
		</div>
	);
}

export default function HowItWorksSection() {
	return (
		<section className="border-y border-gray-100 bg-gray-50/70 dark:border-slate-900 dark:bg-slate-900/30">
			<div className="mx-auto grid max-w-[1180px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-14 lg:py-24">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0a8977] dark:text-emerald-400">
						How it works
					</p>

					<h2 className="mt-3 max-w-lg text-3xl font-black tracking-[-0.03em] text-[#303234] sm:text-4xl dark:text-slate-100">
						From camera input to meaningful attention signals
					</h2>

					<p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 dark:text-slate-400">
						The system analyzes visual signals from the
						participant&apos;s camera and turns them into attention
						states that can be used during an active meeting.
					</p>

					<div className="mt-9 space-y-7">
						<ProcessStep
							number="1"
							title="Camera Input"
							description="The participant's camera provides the video stream used for monitoring."
						/>

						<ProcessStep
							number="2"
							title="Face and Eye Analysis"
							description="Visual landmarks are analyzed to understand face presence, head direction, and eye activity."
						/>

						<ProcessStep
							number="3"
							title="Attention State"
							description="Detected signals are converted into states such as attentive, looking away, or sleeping."
						/>

						<ProcessStep
							number="4"
							title="Meeting Alert"
							description="Important attention changes can be surfaced to the meeting host."
						/>
					</div>
				</div>

				<div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
					<div className="grid gap-3">
						<FlowItem
							icon={<Camera size={20} />}
							title="Camera"
							description="Participant video input"
						/>

						<div className="text-center text-gray-300 dark:text-slate-700">
							↓
						</div>

						<FlowItem
							icon={<ScanFace size={20} />}
							title="Visual Analysis"
							description="Face, eyes and head position"
						/>

						<div className="text-center text-gray-300 dark:text-slate-700">
							↓
						</div>

						<FlowItem
							icon={<Eye size={20} />}
							title="Attention State"
							description="Interpret participant behavior"
						/>

						<div className="text-center text-gray-300 dark:text-slate-700">
							↓
						</div>

						<FlowItem
							icon={<BellRing size={20} />}
							title="Host Alert"
							description="Surface meaningful changes"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}