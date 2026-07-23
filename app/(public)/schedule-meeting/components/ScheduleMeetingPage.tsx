// app/(public)/schedule-meeting/components/ScheduleMeetingPage.tsx

"use client";

import Link from "next/link";
import {
	ArrowRight,
	CalendarDays,
	ChevronDown,
	Clock3,
} from "lucide-react";

import { durationOptions } from "../data/scheduleMeeting.data";
import { useScheduleMeeting } from "../hooks/useScheduleMeeting";

export default function ScheduleMeetingPage() {
	const {
		form,
		error,
		minimumDate,
		updateField,
		scheduleMeeting,
	} = useScheduleMeeting();

	return (
		<main className="relative min-h-[calc(100dvh-72px)] bg-transparent">
			<section className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] max-w-[940px] flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-5">
				{/* Highlighted glass card */}
				<div className="w-full max-w-[760px] rounded-[24px] border border-white/70 bg-white/75 px-5 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-colors sm:px-8 sm:py-7 dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
					<header className="mb-5 text-center">
						<h1 className="text-2xl font-black tracking-[-0.03em] text-[#303234] sm:text-3xl dark:text-slate-100">
							Schedule a Meeting
						</h1>

						<p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">
							Set up your meeting details and pick a time
						</p>
					</header>

					<form
						onSubmit={(event) => {
							event.preventDefault();
							scheduleMeeting();
						}}
						className="space-y-3.5"
					>
						{/* Meeting name */}
						<div>
							<label
								htmlFor="scheduleMeetingName"
								className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300"
							>
								Meeting Name
							</label>

							<input
								id="scheduleMeetingName"
								name="meetingName"
								type="text"
								value={form.meetingName}
								onChange={(event) =>
									updateField(
										"meetingName",
										event.target.value,
									)
								}
								placeholder="e.g. Q1 Product Roadmap Sync"
								autoComplete="off"
								className="h-12 w-full rounded-xl border border-gray-200 bg-white/85 px-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[#07594b] focus:ring-4 focus:ring-emerald-100/70 dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
							/>
						</div>

						{/* Date and time */}
						<div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
							<div>
								<label
									htmlFor="scheduleDate"
									className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300"
								>
									Date
								</label>

								<div className="relative">
									<input
										id="scheduleDate"
										name="date"
										type="date"
										min={minimumDate}
										value={form.date}
										onChange={(event) =>
											updateField(
												"date",
												event.target.value,
											)
										}
										className="h-12 w-full rounded-xl border border-gray-200 bg-white/85 px-4 pr-11 text-sm text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-[#07594b] focus:ring-4 focus:ring-emerald-100/70 dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-200 dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
									/>

									<CalendarDays
										aria-hidden="true"
										size={18}
										className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="scheduleTime"
									className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300"
								>
									Time
								</label>

								<div className="relative">
									<input
										id="scheduleTime"
										name="time"
										type="time"
										value={form.time}
										onChange={(event) =>
											updateField(
												"time",
												event.target.value,
											)
										}
										className="h-12 w-full rounded-xl border border-gray-200 bg-white/85 px-4 pr-11 text-sm text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-[#07594b] focus:ring-4 focus:ring-emerald-100/70 dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-200 dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
									/>

									<Clock3
										aria-hidden="true"
										size={18}
										className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
									/>
								</div>
							</div>
						</div>

						{/* Duration */}
						<div>
							<label
								htmlFor="scheduleDuration"
								className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300"
							>
								Duration
							</label>

							<div className="relative">
								<select
									id="scheduleDuration"
									name="duration"
									value={form.duration}
									onChange={(event) =>
										updateField(
											"duration",
											event.target.value,
										)
									}
									className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white/85 px-4 pr-11 text-sm text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-[#07594b] focus:ring-4 focus:ring-emerald-100/70 dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-200 dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
								>
									<option value="">
										Select meeting duration
									</option>

									{durationOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</select>

								<ChevronDown
									aria-hidden="true"
									size={18}
									className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
								/>
							</div>
						</div>

						{/* Notes */}
						<div>
							<label
								htmlFor="scheduleNotes"
								className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300"
							>
								Notes / Description
							</label>

							<textarea
								id="scheduleNotes"
								name="notes"
								value={form.notes}
								onChange={(event) =>
									updateField(
										"notes",
										event.target.value,
									)
								}
								placeholder="Add meeting agenda, notes, or pre-read links..."
								rows={3}
								className="min-h-[82px] w-full resize-none rounded-xl border border-gray-200 bg-white/85 px-4 py-3 text-sm leading-5 text-gray-800 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[#07594b] focus:ring-4 focus:ring-emerald-100/70 dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
							/>
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
							Schedule Meeting

							<ArrowRight
								size={18}
								className="transition-transform duration-300 group-hover:translate-x-1"
							/>
						</button>
					</form>

					<div className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs text-gray-500 sm:text-sm dark:text-slate-400">
						<span>Want to meet now?</span>

						<Link
							href="/create-meeting"
							className="font-semibold text-[#07594b] underline decoration-[#07594b]/50 underline-offset-4 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:decoration-emerald-400/50 dark:hover:text-emerald-300"
						>
							Start an instant meeting
						</Link>
					</div>
				</div>

				<footer className="mt-4 text-center text-[11px] text-gray-400 sm:text-xs dark:text-slate-500">
					© 2026 Bakawan Data Analytics · Professional Video
					Communication
				</footer>
			</section>
		</main>
	);
}