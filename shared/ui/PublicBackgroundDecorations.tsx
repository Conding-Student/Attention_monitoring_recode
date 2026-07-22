// shared/ui/PublicBackgroundDecorations.tsx

import {
	CirclePlus,
	Eye,
	MessageSquare,
	Monitor,
	Settings,
	Users,
	Video,
} from "lucide-react";

export default function PublicBackgroundDecorations() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
		>
			<div className="absolute left-[4%] top-[12%]">
				<div
					className="float-drift-a"
					style={{ animationDelay: "-1.3s" }}
				>
					<Eye className="h-7 w-7 rotate-12 text-cyan-100/80 transition-colors sm:h-10 sm:w-10 dark:text-emerald-950/80" />
				</div>
			</div>

			<div className="absolute right-[8%] top-[9%]">
				<div
					className="float-drift-c"
					style={{ animationDelay: "-2.8s" }}
				>
					<CirclePlus className="h-8 w-8 -rotate-6 text-cyan-100/70 transition-colors sm:h-12 sm:w-12 dark:text-emerald-950/80" />
				</div>
			</div>

			<div className="absolute left-[9%] top-[46%]">
				<div
					className="float-drift-b"
					style={{ animationDelay: "-1.9s" }}
				>
					<Video className="h-7 w-7 -rotate-12 text-cyan-100/75 transition-colors sm:h-9 sm:w-9 dark:text-emerald-950/80" />
				</div>
			</div>

			<div className="absolute right-[6%] top-[55%]">
				<div
					className="float-drift-d"
					style={{ animationDelay: "-3.7s" }}
				>
					<Monitor className="h-8 w-8 rotate-6 text-cyan-100/75 transition-colors sm:h-11 sm:w-11 dark:text-emerald-950/80" />
				</div>
			</div>

			<div className="absolute bottom-[14%] left-[18%]">
				<div
					className="float-drift-c"
					style={{ animationDelay: "-0.9s" }}
				>
					<MessageSquare className="h-7 w-7 rotate-3 text-cyan-100/70 transition-colors sm:h-10 sm:w-10 dark:text-emerald-950/80" />
				</div>
			</div>

			<div className="absolute bottom-[10%] right-[19%]">
				<div
					className="float-drift-a"
					style={{ animationDelay: "-4.1s" }}
				>
					<Settings className="h-7 w-7 -rotate-6 text-cyan-100/75 transition-colors sm:h-10 sm:w-10 dark:text-emerald-950/80" />
				</div>
			</div>

			<div className="absolute left-1/2 top-[5%] -translate-x-1/2">
				<div
					className="float-drift-b"
					style={{ animationDelay: "-2.4s" }}
				>
					<Users className="h-7 w-7 text-cyan-100/70 transition-colors sm:h-10 sm:w-10 dark:text-emerald-950/80" />
				</div>
			</div>

			{/* Ambient background glows */}
			<div className="absolute -left-48 top-[22%] h-[440px] w-[440px] rounded-full bg-emerald-100/55 blur-[140px] dark:bg-emerald-950/20" />

			<div className="absolute -right-52 top-[55%] h-[500px] w-[500px] rounded-full bg-cyan-100/50 blur-[150px] dark:bg-cyan-950/15" />

			<div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-50/40 blur-[150px] dark:bg-emerald-900/10" />
		</div>
	);
}