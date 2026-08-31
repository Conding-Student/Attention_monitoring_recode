// app/(public)/meeting/[roomname]/components/MeetingPage.tsx

"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useRouter } from "next/navigation";

interface MeetingPageProps {
  roomName: string;
  meetingName: string;
  role: string;
}

export default function MeetingPage({ roomName, meetingName, role }: MeetingPageProps) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const response = await fetch("/api/livekit-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
          participantName: `${role}-${crypto.randomUUID()}`,
        }),
      });

      const data = await response.json();

      setToken(data.token);
    };

    getToken();
  }, [roomName, role]);

  if (!token) {
    return <p>Connecting to meeting...</p>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      video
      audio
      data-lk-theme="default"
      style={{ height: "calc(100dvh - 72px)" }}
      onDisconnected={() => window.location.replace("/")}
    >
      {meetingName && <div className="absolute left-4 top-4 z-20 rounded-lg bg-black/60 px-3 py-2 text-sm font-semibold text-white">{meetingName}</div>}
      <VideoConference />
    </LiveKitRoom>
  );
}
