// Rate limiting for contact form submissions
import { db } from "./db";

const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check rate limit for contact form submissions
 */
export async function checkRateLimit(
  ipAddress: string,
  type: 'contact' | 'lead' = 'contact'
): Promise<RateLimitResult> {
  try {
    const windowStart = new Date(Date.now() - WINDOW_MS);

    // Count submissions in the last hour
    const recentSubmissions = await db.contactSubmission.count({
      where: {
        ipAddress: {
          contains: ipAddress.split('.').slice(0, 3).join('.'), // Match anonymized IP prefix
        },
        createdAt: {
          gte: windowStart,
        },
      },
    });

    const remaining = Math.max(0, MAX_SUBMISSIONS - recentSubmissions);
    const resetAt = new Date(Date.now() + WINDOW_MS);

    return {
      allowed: recentSubmissions < MAX_SUBMISSIONS,
      remaining,
      resetAt,
    };
  } catch (error: any) {
    // If table doesn't exist, allow the request
    console.warn("Rate limit check failed:", error.message);
    return {
      allowed: true,
      remaining: MAX_SUBMISSIONS,
      resetAt: new Date(Date.now() + WINDOW_MS),
    };
  }
}
