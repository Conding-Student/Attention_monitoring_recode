// app/(public)/join-meeting/components/JoinMeetingPage.tsx

"use client";

import Link from "next/link";
import { ArrowRight, Link2, Video } from "lucide-react";

import { useJoinMeeting } from "../hooks/useJoinMeeting";

interface JoinMeetingPageProps {
  initialMeetingValue?: string;
}

export default function JoinMeetingPage({
  initialMeetingValue = "",
}: JoinMeetingPageProps) {
  const { meetingValue, error, handleMeetingValueChange, joinMeeting } =
    useJoinMeeting({
      initialMeetingValue,
    });

  return (
<main className="relative min-h-[calc(100dvh-72px)] w-full bg-transparent">
	<section className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] w-full flex-col items-center justify-center px-4 py-5 sm:px-6 sm:py-7">
		 <div className="mx-auto w-full max-w-[760px] rounded-[24px] border border-white/70 bg-white/75 px-5 py-7 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-colors sm:px-8 sm:py-8 dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
          {" "}
          <header className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#07594b] dark:bg-emerald-950/60 dark:text-emerald-400">
              <Video size={22} strokeWidth={1.8} />
            </div>

            <h1 className="text-2xl font-black tracking-[-0.03em] text-[#303234] sm:text-3xl dark:text-slate-100">
              Join a Meeting
            </h1>

            <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">
              Enter a meeting code or link to join
            </p>
          </header>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              joinMeeting();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="meetingCodeOrLink"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-slate-300"
              >
                Meeting Code or Link
              </label>

              <div className="relative">
                <input
                  id="meetingCodeOrLink"
                  name="meetingCodeOrLink"
                  type="text"
                  value={meetingValue}
                  onChange={(event) =>
                    handleMeetingValueChange(event.target.value)
                  }
                  placeholder="e.g. ZTO-4927-V or your-domain.com/meeting/ZTO-4927-V"
                  autoComplete="off"
                  autoFocus
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white/85 px-4 pr-11 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[#07594b] focus:ring-4 focus:ring-emerald-100/70 dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
                />

                <Link2
                  aria-hidden="true"
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />
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
              Join Meeting
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />

            <span className="text-xs font-medium text-gray-400 dark:text-slate-500">
              or
            </span>

            <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs text-gray-500 sm:text-sm dark:text-slate-400">
            <span>Want to host?</span>

            <Link
              href="/create-meeting"
              className="font-semibold text-[#07594b] underline decoration-[#07594b]/50 underline-offset-4 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:decoration-emerald-400/50 dark:hover:text-emerald-300"
            >
              Create a meeting
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
          © 2026 Bakawan Data Analytics · Professional Video Communication
        </footer>
      </section>
    </main>
  );
}
