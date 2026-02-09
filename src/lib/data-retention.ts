// Data retention and cleanup utilities
import { db } from "./db";

const RETENTION_DAYS = 365; // Keep data for 1 year

/**
 * Clean up old page visits (older than retention period)
 */
export async function cleanupOldPageVisits(): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

    const result = await db.pageVisit.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`Cleaned up ${result.count} old page visits`);
    return result.count;
  } catch (error) {
    console.error("Error cleaning up old page visits:", error);
    return 0;
  }
}

/**
 * Clean up old login attempts (older than 30 days)
 */
export async function cleanupOldLoginAttempts(): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const result = await db.loginAttempt.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`Cleaned up ${result.count} old login attempts`);
    return result.count;
  } catch (error) {
    console.error("Error cleaning up old login attempts:", error);
    return 0;
  }
}

/**
 * Run all cleanup tasks
 */
export async function runDataRetentionCleanup(): Promise<void> {
  await Promise.all([
    cleanupOldPageVisits(),
    cleanupOldLoginAttempts(),
  ]);
}
