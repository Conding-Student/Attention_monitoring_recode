// app/(public)/create-meeting/components/CreateMeetingHeader.tsx

import Image from "next/image";
import Link from "next/link";

import ThemeToggle from "../../landing/components/ThemeToggle";

export default function CreateMeetingHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
			<div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
				<Link
					href="/"
					className="flex min-w-0 items-center gap-3"
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

					<span className="hidden text-sm font-bold text-gray-800 transition-colors sm:block dark:text-slate-100">
						Bakawan Data Analytics
					</span>
				</Link>

				<ThemeToggle />
			</div>
		</header>
	);
}