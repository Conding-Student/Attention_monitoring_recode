// app/(public)/meeting/[roomname]/components/MeetingPage.tsx

"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";

interface MeetingPageProps {
  roomName: string;
  meetingName: string;
  role: string;
}

export default function MeetingPage({
  roomName,
  meetingName,
  role,
}: MeetingPageProps) {
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
    >
    <VideoConference/>
    </LiveKitRoom>
  );
}