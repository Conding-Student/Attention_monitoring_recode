// app/(public)/layout.tsx

import type { ReactNode } from "react";

import PublicFloatingBackground from "@/shared/ui/PublicFloatingBackground";
import PublicHeader from "@/shared/ui/PublicHeader";

interface PublicLayoutProps {
	children: ReactNode;
}

export default function PublicLayout({
	children,
}: PublicLayoutProps) {
	return (
		<div className="relative isolate min-h-dvh overflow-x-clip bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
			<PublicFloatingBackground />

			<PublicHeader />


				{children}

		</div>
	);
}