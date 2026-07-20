// app/(public)/_landing/types/landing.types.ts

import type { LucideIcon } from "lucide-react";

export interface LandingFeature {
	title: string;
	description: string;
	icon: LucideIcon;
}

export interface NavigationItem {
	label: string;
	href: string;
}