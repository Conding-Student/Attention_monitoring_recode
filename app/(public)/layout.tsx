// app/(public)/layout.tsx

import type { ReactNode } from "react";

import PublicBackgroundDecorations from "@/shared/ui/PublicBackgroundDecorations";
import PublicHeader from "@/shared/ui/PublicHeader";
import "@livekit/components-styles";

interface PublicLayoutProps {
	children: ReactNode;
}

export default function PublicLayout({
	children,
}: PublicLayoutProps) {
	return (
		<div className="relative isolate min-h-dvh overflow-x-clip bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
			<PublicBackgroundDecorations />

			<div className="relative z-10 flex min-h-dvh flex-col">
				<PublicHeader />

				<div className="relative flex-1">
					{children}
				</div>
			</div>
		</div>
	);
}