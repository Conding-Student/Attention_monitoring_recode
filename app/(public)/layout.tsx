// app/(public)/layout.tsx

import type { ReactNode } from "react";

import PublicHeader from "@/shared/ui/PublicHeader";

interface PublicLayoutProps {
	children: ReactNode;
}

export default function PublicLayout({
	children,
}: PublicLayoutProps) {
	return (
		<div className="min-h-dvh bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
			<PublicHeader />

			{children}
		</div>
	);
}