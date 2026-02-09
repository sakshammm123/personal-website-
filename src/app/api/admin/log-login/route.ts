// Log login attempt after authentication
import { NextRequest, NextResponse } from "next/server";
import { logLoginAttempt, getIpAddress } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, success } = body;

    if (!username || typeof success !== "boolean") {
      return NextResponse.json(
        { error: "Username and success status are required" },
        { status: 400 }
      );
    }

    // Get IP address and user agent
    const ipAddress = getIpAddress(request);
    const userAgent = request.headers.get("user-agent") || null;

    // Log the attempt
    await logLoginAttempt(username, ipAddress, userAgent, success);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error logging login attempt:", error);
    // Don't fail the request if logging fails
    return NextResponse.json({ success: true });
  }
}
