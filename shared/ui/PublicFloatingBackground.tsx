// shared/ui/PublicFloatingBackground.tsx

import type { CSSProperties } from "react";
import {
	CalendarDays,
	CirclePlus,
	Eye,
	Link2,
	MessageSquare,
	Mic,
	Monitor,
	Settings,
	Users,
	Video,
	type LucideIcon,
} from "lucide-react";

interface FloatingObject {
	icon: LucideIcon;
	position: string;
	size: string;
	visibility?: string;
	duration: string;
	delay: string;
	x: string;
	y: string;
	alternateX: string;
	alternateY: string;
	rotation: string;
	alternateRotation: string;
}

type FloatingObjectStyle = CSSProperties & {
	"--float-duration": string;
	"--float-delay": string;
	"--float-x": string;
	"--float-y": string;
	"--float-alt-x": string;
	"--float-alt-y": string;
	"--float-rotation": string;
	"--float-alt-rotation": string;
};

const floatingObjects: FloatingObject[] = [
	{
		icon: Eye,
		position: "left-[4%] top-[10%]",
		size: "h-9 w-9 sm:h-11 sm:w-11",
		duration: "19s",
		delay: "-4s",
		x: "72px",
		y: "46px",
		alternateX: "-32px",
		alternateY: "94px",
		rotation: "26deg",
		alternateRotation: "-16deg",
	},
	{
		icon: CirclePlus,
		position: "right-[7%] top-[8%]",
		size: "h-10 w-10 sm:h-12 sm:w-12",
		duration: "23s",
		delay: "-11s",
		x: "-86px",
		y: "70px",
		alternateX: "24px",
		alternateY: "132px",
		rotation: "-34deg",
		alternateRotation: "20deg",
	},
	{
		icon: Video,
		position: "left-[8%] top-[42%]",
		size: "h-8 w-8 sm:h-10 sm:w-10",
		duration: "21s",
		delay: "-7s",
		x: "96px",
		y: "-68px",
		alternateX: "34px",
		alternateY: "88px",
		rotation: "38deg",
		alternateRotation: "-24deg",
	},
	{
		icon: Monitor,
		position: "right-[5%] top-[48%]",
		size: "h-10 w-10 sm:h-12 sm:w-12",
		duration: "25s",
		delay: "-16s",
		x: "-106px",
		y: "-74px",
		alternateX: "-28px",
		alternateY: "92px",
		rotation: "-28deg",
		alternateRotation: "34deg",
	},
	{
		icon: MessageSquare,
		position: "bottom-[13%] left-[12%]",
		size: "h-9 w-9 sm:h-11 sm:w-11",
		duration: "22s",
		delay: "-13s",
		x: "68px",
		y: "-108px",
		alternateX: "124px",
		alternateY: "-34px",
		rotation: "32deg",
		alternateRotation: "-18deg",
	},
	{
		icon: Settings,
		position: "bottom-[9%] right-[14%]",
		size: "h-9 w-9 sm:h-11 sm:w-11",
		duration: "27s",
		delay: "-19s",
		x: "-82px",
		y: "-116px",
		alternateX: "30px",
		alternateY: "-52px",
		rotation: "64deg",
		alternateRotation: "-38deg",
	},
	{
		icon: Users,
		position: "left-[47%] top-[5%]",
		size: "h-8 w-8 sm:h-10 sm:w-10",
		duration: "24s",
		delay: "-9s",
		x: "62px",
		y: "116px",
		alternateX: "-78px",
		alternateY: "64px",
		rotation: "-20deg",
		alternateRotation: "28deg",
	},
	{
		icon: CalendarDays,
		position: "bottom-[30%] left-[44%]",
		size: "h-8 w-8 sm:h-10 sm:w-10",
		visibility: "hidden sm:block",
		duration: "28s",
		delay: "-21s",
		x: "-118px",
		y: "-76px",
		alternateX: "92px",
		alternateY: "-104px",
		rotation: "42deg",
		alternateRotation: "-30deg",
	},
	{
		icon: Link2,
		position: "right-[26%] top-[27%]",
		size: "h-7 w-7 sm:h-9 sm:w-9",
		visibility: "hidden md:block",
		duration: "20s",
		delay: "-15s",
		x: "88px",
		y: "84px",
		alternateX: "-56px",
		alternateY: "138px",
		rotation: "-32deg",
		alternateRotation: "18deg",
	},
	{
		icon: Mic,
		position: "bottom-[17%] right-[43%]",
		size: "h-7 w-7 sm:h-9 sm:w-9",
		visibility: "hidden md:block",
		duration: "26s",
		delay: "-18s",
		x: "104px",
		y: "-82px",
		alternateX: "-86px",
		alternateY: "-36px",
		rotation: "30deg",
		alternateRotation: "-36deg",
	},
];

export default function PublicFloatingBackground() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
		>
			{/* Soft background glows */}
			<div className="absolute -bottom-48 -left-48 h-[520px] w-[520px] rounded-full bg-emerald-100/55 blur-[140px] dark:bg-emerald-950/25" />

			<div className="absolute -right-56 -top-48 h-[580px] w-[580px] rounded-full bg-slate-200/65 blur-[150px] dark:bg-slate-800/35" />

			<div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-50/50 blur-[150px] dark:bg-emerald-900/10" />

			{/* Floating icons */}
			{floatingObjects.map((item, index) => {
				const Icon = item.icon;

				const floatingStyle: FloatingObjectStyle = {
					"--float-duration": item.duration,
					"--float-delay": item.delay,
					"--float-x": item.x,
					"--float-y": item.y,
					"--float-alt-x": item.alternateX,
					"--float-alt-y": item.alternateY,
					"--float-rotation": item.rotation,
					"--float-alt-rotation":
						item.alternateRotation,
				};

				return (
					<span
						key={`${item.position}-${index}`}
						style={floatingStyle}
						className={`
							public-floating-object
							absolute
							${item.position}
							${item.visibility ?? ""}
						`}
					>
						<Icon
							strokeWidth={1.35}
							className={`
								public-floating-object-icon
								${item.size}
								text-cyan-200/60
								drop-shadow-sm
								dark:text-emerald-800/35
							`}
						/>
					</span>
				);
			})}
		</div>
	);
}