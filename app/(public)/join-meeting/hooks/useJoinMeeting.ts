// app/(public)/join-meeting/hooks/useJoinMeeting.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseJoinMeetingParameters {
  initialMeetingValue?: string;
}

export function useJoinMeeting({
  initialMeetingValue = "",
}: UseJoinMeetingParameters) {
  const router = useRouter();

  const [meetingValue, setMeetingValue] = useState(initialMeetingValue);
  const [error, setError] = useState<string | null>(null);

  const handleMeetingValueChange = (value: string) => {
    setMeetingValue(value);
    setError(null);
  };

  const joinMeeting = () => {
    const value = meetingValue.trim();

    if (!value) {
      setError("Please enter a meeting code or link.");
      return;
    }

    let meetingCode = value;
    let meetingName = "";

    if (value.startsWith("http")) {
      const url = new URL(value);

      meetingCode =
        url.pathname.split("/").filter(Boolean).at(-1) ?? "";

      meetingName = url.searchParams.get("meetingName") ?? "";
    }

    if (!/^[A-Z]{3}-\d{4}-[A-Z]$/i.test(meetingCode)) {
      setError("Please enter a valid meeting code or link.");
      return;
    }

    const params = new URLSearchParams({
      role: "participant",
    });

    if (meetingName) {
      params.set("meetingName", meetingName);
    }

    router.push(
      `/meeting/${meetingCode.toLowerCase()}?${params.toString()}`,
    );
  };

  return {
    meetingValue,
    error,
    handleMeetingValueChange,
    joinMeeting,
  };
}