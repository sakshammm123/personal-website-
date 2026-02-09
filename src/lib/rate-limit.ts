// Rate limiting utility for login attempts
import { db } from "./db";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check if an IP address has exceeded rate limit for login attempts
 * @param ipAddress - IP address to check
 * @returns Rate limit status
 */
export async function checkLoginRateLimit(
  ipAddress: string
): Promise<RateLimitResult> {
  try {
    const windowStart = new Date(Date.now() - WINDOW_MS);

    // Count failed attempts in the last 15 minutes
    // Gracefully handle if LoginAttempt table doesn't exist yet
    const recentAttempts = await db.loginAttempt.count({
      where: {
        ipAddress,
        success: false,
        createdAt: {
          gte: windowStart,
        },
      },
    });

    const remaining = Math.max(0, MAX_ATTEMPTS - recentAttempts);
    const resetAt = new Date(Date.now() + WINDOW_MS);

    return {
      allowed: recentAttempts < MAX_ATTEMPTS,
      remaining,
      resetAt,
    };
  } catch (error: any) {
    // If table doesn't exist or there's an error, allow the request
    // This prevents blocking login if migrations haven't been run
    console.warn("Rate limit check failed (table may not exist):", error.message);
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS,
      resetAt: new Date(Date.now() + WINDOW_MS),
    };
  }
}

/**
 * Log a login attempt
 * @param username - Username attempted
 * @param ipAddress - IP address
 * @param userAgent - User agent string
 * @param success - Whether login was successful
 */
export async function logLoginAttempt(
  username: string,
  ipAddress: string,
  userAgent: string | null,
  success: boolean
): Promise<void> {
  try {
    // Gracefully handle if LoginAttempt table doesn't exist yet
    await db.loginAttempt.create({
      data: {
        username,
        ipAddress,
        userAgent: userAgent || null,
        success,
      },
    });

    // Clean up old attempts (older than 24 hours)
    try {
      const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await db.loginAttempt.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });
    } catch (cleanupError) {
      // Ignore cleanup errors
      console.warn("Failed to cleanup old login attempts:", cleanupError);
    }
  } catch (error: any) {
    // Don't fail login if logging fails (table may not exist yet)
    console.warn("Failed to log login attempt (table may not exist):", error.message);
  }
}

/**
 * Get IP address from request headers
 */
export function getIpAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  return "unknown";
}
