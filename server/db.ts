import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  privacyScores,
  InsertPrivacyScore,
  privacyMetrics,
  alerts,
  InsertAlert,
  recommendations,
  InsertRecommendation,
  privacyStreaks,
  InsertPrivacyStreak,
  badges,
  InsertBadge,
  passwordEntries,
  InsertPasswordEntry,
  emailAliases,
  InsertEmailAlias,
  quarantinedEmails,
  InsertQuarantinedEmail,
  vpnSessions,
  InsertVpnSession,
  trackerBlocks,
  InsertTrackerBlock,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Privacy Metrics and Scoring
 */
export async function getPrivacyScore(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(privacyScores)
    .where(eq(privacyScores.userId, userId))
    .orderBy(desc(privacyScores.recordedAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createPrivacyScore(score: InsertPrivacyScore) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(privacyScores).values(score);
}

export async function getPrivacyMetrics(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(privacyMetrics)
    .where(eq(privacyMetrics.userId, userId))
    .orderBy(desc(privacyMetrics.recordedAt))
    .limit(limit);
}

/**
 * Alerts and Recommendations
 */
export async function getActiveAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(alerts)
    .where(and(eq(alerts.userId, userId), eq(alerts.isResolved, 0)))
    .orderBy(desc(alerts.createdAt));
}

export async function createAlert(alert: InsertAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(alerts).values(alert);
}

export async function resolveAlert(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(alerts)
    .set({ isResolved: 1, resolvedAt: new Date() })
    .where(eq(alerts.id, alertId));
}

export async function getRecommendations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(recommendations)
    .where(and(eq(recommendations.userId, userId), eq(recommendations.isCompleted, 0)))
    .orderBy(desc(recommendations.priority));
}

export async function createRecommendation(rec: InsertRecommendation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(recommendations).values(rec);
}

export async function completeRecommendation(recId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(recommendations)
    .set({ isCompleted: 1, completedAt: new Date() })
    .where(eq(recommendations.id, recId));
}

/**
 * Gamification
 */
export async function getPrivacyStreak(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(privacyStreaks)
    .where(eq(privacyStreaks.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updatePrivacyStreak(userId: number, streak: Omit<InsertPrivacyStreak, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .insert(privacyStreaks)
    .values({ userId, ...streak })
    .onDuplicateKeyUpdate({
      set: { currentStreak: streak.currentStreak, lastCheckInDate: new Date() },
    });
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(badges)
    .where(eq(badges.userId, userId))
    .orderBy(desc(badges.earnedAt));
}

export async function awardBadge(userId: number, badgeType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(badges).values({ userId, badgeType } as InsertBadge);
}

/**
 * Password Vault
 */
export async function getPasswordEntries(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(passwordEntries)
    .where(eq(passwordEntries.userId, userId))
    .orderBy(desc(passwordEntries.createdAt));
}

export async function createPasswordEntry(entry: InsertPasswordEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(passwordEntries).values(entry);
}

export async function getBreachedPasswords(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(passwordEntries)
    .where(and(eq(passwordEntries.userId, userId), eq(passwordEntries.isBreached, 1)));
}

/**
 * Email Aliases
 */
export async function getEmailAliases(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(emailAliases)
    .where(eq(emailAliases.userId, userId));
}

export async function createEmailAlias(alias: InsertEmailAlias) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(emailAliases).values(alias);
}

/**
 * Quarantined Emails
 */
export async function getQuarantinedEmails(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(quarantinedEmails)
    .where(eq(quarantinedEmails.userId, userId))
    .orderBy(desc(quarantinedEmails.createdAt));
}

export async function createQuarantinedEmail(email: InsertQuarantinedEmail) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(quarantinedEmails).values(email);
}

/**
 * VPN Sessions
 */
export async function getActiveVpnSession(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(vpnSessions)
    .where(and(eq(vpnSessions.userId, userId), eq(vpnSessions.isActive, 1)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createVpnSession(session: InsertVpnSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(vpnSessions).values(session);
}

/**
 * Tracker Blocks
 */
export async function getTrackerBlockStats(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(trackerBlocks)
    .where(eq(trackerBlocks.userId, userId))
    .orderBy(desc(trackerBlocks.blockCount));
}

export async function recordTrackerBlock(block: InsertTrackerBlock) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(trackerBlocks).values(block);
}

// TODO: add feature queries here as your schema grows.


/**
 * Conversations and Messages
 */
export async function getConversations(userId: number) {
  // Mock implementation - returns empty array for now
  return [];
}

export async function createMessage(userId: number, input: any) {
  // Mock implementation
  return { success: true, messageId: Math.random() };
}

/**
 * User Preferences
 */
export async function getUserPreferences(userId: number) {
  // Mock implementation - returns default preferences
  return {
    trackerBlocking: true,
    adBlocking: true,
    screenshotDetection: true,
    twoFactorAuth: false,
    biometricLogin: false,
    sessionTimeout: 30,
    loginAlerts: true,
    analyticsEnabled: false,
    crashReports: true,
    criticalAlerts: true,
    highPriorityAlerts: true,
    mediumPriorityAlerts: true,
    lowPriorityAlerts: false,
    inAppNotifications: true,
    emailNotifications: true,
    pushNotifications: false,
  };
}

export async function updateUserPreference(userId: number, key: string, value: any) {
  // Mock implementation
  return { success: true };
}

export async function updateUserPreferences(userId: number, preferences: any) {
  // Mock implementation
  return { success: true };
}

/**
 * VPN Operations
 */
export async function updateVpnStatus(userId: number, enabled: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (enabled) {
    await db.insert(vpnSessions).values({
      userId,
      isActive: 1,
      connectedAt: new Date(),
      serverLocation: 'US-East',
      dataUsed: 0,
    } as InsertVpnSession);
  } else {
    await db.update(vpnSessions)
      .set({ isActive: 0, disconnectedAt: new Date() })
      .where(and(eq(vpnSessions.userId, userId), eq(vpnSessions.isActive, 1)));
  }
  return { success: true };
}

export async function getVpnServers() {
  // Mock implementation - returns list of VPN servers
  return [
    { id: 1, name: 'US-East', country: 'United States', speed: 'Fast' },
    { id: 2, name: 'US-West', country: 'United States', speed: 'Fast' },
    { id: 3, name: 'EU-London', country: 'United Kingdom', speed: 'Very Fast' },
    { id: 4, name: 'EU-Amsterdam', country: 'Netherlands', speed: 'Very Fast' },
    { id: 5, name: 'APAC-Singapore', country: 'Singapore', speed: 'Fast' },
  ];
}

/**
 * Email Alias Operations
 */
export async function deleteEmailAlias(userId: number, aliasId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(emailAliases)
    .where(and(eq(emailAliases.userId, userId), eq(emailAliases.id, aliasId)));
  
  return { success: true };
}

/**
 * Password Operations
 */
export async function deletePasswordEntry(userId: number, passwordId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(passwordEntries)
    .where(and(eq(passwordEntries.userId, userId), eq(passwordEntries.id, passwordId)));
  
  return { success: true };
}
