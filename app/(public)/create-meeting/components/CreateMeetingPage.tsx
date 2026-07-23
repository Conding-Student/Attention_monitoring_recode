// app/(public)/create-meeting/components/CreateMeetingPage.tsx

"use client";

import Link from "next/link";
import {
	ArrowRight,
	Check,
	Copy,
	Link2,
} from "lucide-react";

import { useCreateMeeting } from "../hooks/useCreateMeeting";

interface CreateMeetingPageProps {
	initialMeetingCode: string;
}

export default function CreateMeetingPage({
	initialMeetingCode,
}: CreateMeetingPageProps) {
	const {
		meetingName,
		meetingCode,
		displayShareLink,
		copiedField,
		error,
		handleMeetingNameChange,
		copyMeetingCode,
		copyShareLink,
		startMeeting,
	} = useCreateMeeting({
		initialMeetingCode,
	});

	return (
		<main className="relative min-h-[calc(100dvh-72px)] bg-transparent">
			<section className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] max-w-[940px] flex-col items-center justify-center px-4 py-5 sm:px-6 sm:py-7">
				{/* Highlighted glass card */}
				<div className="w-full max-w-[760px] rounded-[24px] border border-white/70 bg-white/75 px-5 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-colors sm:px-8 sm:py-7 dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
					<header className="mb-6 text-center">
						<h1 className="text-2xl font-black tracking-[-0.03em] text-[#303234] sm:text-3xl dark:text-slate-100">
							Create a Meeting
						</h1>

						<p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">
							Set up your meeting space and invite your team
						</p>
					</header>

					<form
						onSubmit={(event) => {
							event.preventDefault();
							startMeeting();
						}}
						className="space-y-4"
					>
						<div>
							<label
								htmlFor="meetingName"
								className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300"
							>
								Meeting Name
							</label>

							<input
								id="meetingName"
								name="meetingName"
								type="text"
								value={meetingName}
								onChange={(event) =>
									handleMeetingNameChange(
										event.target.value,
									)
								}
								placeholder="e.g. Q1 Product Roadmap Sync"
								autoComplete="off"
								className="h-12 w-full rounded-xl border border-gray-200 bg-white/85 px-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[#07594b] focus:ring-4 focus:ring-emerald-100/70 dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
							/>
						</div>

						<div>
							<span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300">
								Meeting Code
							</span>

							<div className="flex min-h-[78px] flex-col gap-3 rounded-xl border border-gray-200 bg-white/65 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-700 dark:bg-slate-950/45">
								<span className="break-all font-mono text-2xl font-black tracking-[0.05em] text-[#303234] sm:text-3xl dark:text-slate-100">
									{meetingCode}
								</span>

								<button
									type="button"
									onClick={copyMeetingCode}
									className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white/85 px-4 text-xs font-semibold text-[#07594b] shadow-sm transition-all hover:border-[#07594b]/30 hover:bg-emerald-50 active:scale-[0.98] sm:text-sm dark:border-slate-700 dark:bg-slate-900/85 dark:text-emerald-400 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-950/50"
								>
									{copiedField === "code" ? (
										<Check size={16} />
									) : (
										<Copy size={16} />
									)}

									{copiedField === "code"
										? "Copied"
										: "Copy Code"}
								</button>
							</div>
						</div>

						<div>
							<span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300">
								Share Link
							</span>

							<div className="flex h-12 items-center overflow-hidden rounded-xl border border-gray-200 bg-white/85 transition-all hover:border-gray-300 focus-within:border-[#07594b] focus-within:ring-4 focus-within:ring-emerald-100/70 dark:border-slate-700 dark:bg-slate-950/65 dark:hover:border-slate-600 dark:focus-within:border-emerald-500 dark:focus-within:ring-emerald-950">
								<div className="min-w-0 flex-1 px-4">
									<p className="truncate text-sm text-gray-600 dark:text-slate-300">
										{displayShareLink}
									</p>
								</div>

								<button
									type="button"
									onClick={copyShareLink}
									className="mr-1.5 inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#07594b] px-3 text-xs font-semibold text-white transition-all hover:bg-[#064c40] active:scale-[0.98] sm:px-4 dark:bg-emerald-600 dark:hover:bg-emerald-500"
								>
									{copiedField === "link" ? (
										<Check size={16} />
									) : (
										<Link2 size={16} />
									)}

									<span className="hidden sm:inline">
										{copiedField === "link"
											? "Copied"
											: "Copy Link"}
									</span>
								</button>
							</div>
						</div>

						{error && (
							<p
								role="alert"
								className="rounded-lg border border-red-200 bg-red-50/90 px-4 py-2.5 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
							>
								{error}
							</p>
						)}

						<button
							type="submit"
							className="group flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#07594b] px-6 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition-all hover:-translate-y-0.5 hover:bg-[#064c40] hover:shadow-xl hover:shadow-emerald-950/20 active:translate-y-0 active:scale-[0.99] dark:bg-emerald-600 dark:hover:bg-emerald-500"
						>
							Start Meeting

							<ArrowRight
								size={18}
								className="transition-transform duration-300 group-hover:translate-x-1"
							/>
						</button>
					</form>

					<div className="mt-5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs text-gray-500 sm:text-sm dark:text-slate-400">
						<span>Have a code?</span>

						<Link
							href="/join-meeting"
							className="font-semibold text-[#07594b] underline decoration-[#07594b]/50 underline-offset-4 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:decoration-emerald-400/50 dark:hover:text-emerald-300"
						>
							Join an existing meeting
						</Link>

						<span>or</span>

						<Link
							href="/schedule-meeting"
							className="font-semibold text-[#07594b] underline decoration-[#07594b]/50 underline-offset-4 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:decoration-emerald-400/50 dark:hover:text-emerald-300"
						>
							schedule meeting
						</Link>
					</div>
				</div>

				<footer className="mt-5 text-center text-[11px] text-gray-400 sm:text-xs dark:text-slate-500">
					© 2026 Bakawan Data Analytics · Professional Video
					Communication
				</footer>
			</section>
		</main>
	);
}