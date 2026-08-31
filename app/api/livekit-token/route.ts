// app/api/livekit-token/route.ts

import { AccessToken } from "livekit-server-sdk";

export async function POST(request: Request) {
  const { roomName, participantName } = await request.json();

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
    },
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
  });

  return Response.json({
    token: await token.toJwt(),
  });
}