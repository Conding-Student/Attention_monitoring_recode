// app/(public)/meeting/[roomname]/page.tsx

import MeetingPage from "./components/MeetingPage";

interface MeetingRouteProps {
  params: Promise<{
    roomname: string;
  }>;

  searchParams: Promise<{
    meetingName?: string;
    role?: string;
  }>;
}

export default async function MeetingRoute({
  params,
  searchParams,
}: MeetingRouteProps) {
  const { roomname } = await params;
  const { meetingName = "", role = "participant" } = await searchParams;

  return (
    <MeetingPage
      roomName={roomname}
      meetingName={meetingName}
      role={role}
    />
  );
}