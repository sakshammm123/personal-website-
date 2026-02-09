// Pre-validation route for rate limiting (called before NextAuth)
import { NextRequest, NextResponse } from "next/server";
import { checkLoginRateLimit, logLoginAttempt, getIpAddress } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting
    const ipAddress = getIpAddress(request);
    const userAgent = request.headers.get("user-agent") || null;

    // Check rate limit
    const rateLimit = await checkLoginRateLimit(ipAddress);
    if (!rateLimit.allowed) {
      // Log failed attempt due to rate limit
      await logLoginAttempt(username, ipAddress, userAgent, false);
      
      const minutesUntilReset = Math.ceil(
        (rateLimit.resetAt.getTime() - Date.now()) / 1000 / 60
      );
      
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again after ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ allowed: true });
  } catch (error: any) {
    console.error("Login validation error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
