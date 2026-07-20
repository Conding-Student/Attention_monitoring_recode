// app/(public)/_landing/data/landing.data.ts

import {
	CirclePlus,
	Eye,
	MessageSquare,
	MicOff,
	Monitor,
	Settings,
	ShieldCheck,
	UserCheck,
	Video,
} from "lucide-react";

import type {
	LandingFeature,
	NavigationItem,
} from "../types/landing.types";

export const navigationItems: NavigationItem[] = [
	{
		label: "Home",
		href: "#home",
	},
	{
		label: "Features",
		href: "#features",
	},
	{
		label: "Documentation",
		href: "#documentation",
	},
	{
		label: "About",
		href: "#about",
	},
];

export const heroFeatures: LandingFeature[] = [
	{
		title: "Attention Monitoring",
		description:
			"Automatically pauses video when the user steps away from the camera, and resumes when they return.",
		icon: Eye,
	},
	{
		title: "Create & Join Meetings",
		description:
			"Instantly create or join a meeting with a shareable link or code.",
		icon: Video,
	},
	{
		title: "Screen Sharing",
		description:
			"Share your screen with all meeting participants in high definition.",
		icon: Monitor,
	},
];

export const meetingFeatures: LandingFeature[] = [
	{
		title: "Participant Approval",
		description:
			"Accept or reject participants before they enter the meeting.",
		icon: UserCheck,
	},
	{
		title: "Audio & Video Controls",
		description:
			"Toggle microphone and camera on or off for host and participants.",
		icon: Video,
	},
	{
		title: "Screen Sharing",
		description:
			"Share your screen with all meeting participants in high definition.",
		icon: Monitor,
	},
	{
		title: "Chat & Messaging",
		description:
			"Send messages and share files in real-time during the meeting.",
		icon: MessageSquare,
	},
	{
		title: "Mute Participants",
		description:
			"Keep order in large groups by muting individual or all participants.",
		icon: MicOff,
	},
	{
		title: "Granular Permissions",
		description:
			"Control who can use audio, video, chat, and screen sharing features.",
		icon: ShieldCheck,
	},
	{
		title: "Meeting Management",
		description:
			"Full host controls to remove participants and safely end sessions.",
		icon: Settings,
	},
	{
		title: "Create & Join Meetings",
		description:
			"Instantly create or join a meeting with a shareable link or code.",
		icon: CirclePlus,
	},
];