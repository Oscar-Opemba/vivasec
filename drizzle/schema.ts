import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Privacy Modules Tables

/**
 * Secure Messaging Module (VivaChat)
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  encryptedContent: text("encryptedContent").notNull(),
  messageType: mysqlEnum("messageType", ["text", "voice", "video"]).default("text").notNull(),
  selfDestructTimer: int("selfDestructTimer"), // in seconds
  isRevoked: int("isRevoked").default(0).notNull(),
  screenshotDetected: int("screenshotDetected").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Privacy Metrics - tracks metrics from all modules
 */
export const privacyMetrics = mysqlTable("privacyMetrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  metricType: mysqlEnum("metricType", [
    "e2eeMessages",
    "selfDestructMessages",
    "trackersBlocked",
    "adsBlocked",
    "fingerprintingBlocked",
    "vpnConnected",
    "e2eeEmails",
    "phishingDetected",
    "weakPasswords",
    "breachesDetected",
  ]).notNull(),
  value: int("value").default(0).notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type PrivacyMetric = typeof privacyMetrics.$inferSelect;
export type InsertPrivacyMetric = typeof privacyMetrics.$inferInsert;

/**
 * Privacy Score - aggregated daily score
 */
export const privacyScores = mysqlTable("privacyScores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  score: int("score").notNull(), // 0-100
  messagingScore: int("messagingScore").default(0).notNull(),
  browsingScore: int("browsingScore").default(0).notNull(),
  vpnScore: int("vpnScore").default(0).notNull(),
  emailScore: int("emailScore").default(0).notNull(),
  passwordScore: int("passwordScore").default(0).notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type PrivacyScore = typeof privacyScores.$inferSelect;
export type InsertPrivacyScore = typeof privacyScores.$inferInsert;

/**
 * Alerts and Recommendations
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  alertType: mysqlEnum("alertType", [
    "weakPassword",
    "dataLeak",
    "phishingEmail",
    "maliciousTracker",
    "unencryptedConnection",
    "vpnDisconnected",
    "suspiciousApp",
  ]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isResolved: int("isResolved").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

export const recommendations = mysqlTable("recommendations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  recommendationType: mysqlEnum("recommendationType", [
    "updatePassword",
    "enableVPN",
    "reviewQuarantinedEmails",
    "enableE2EE",
    "blockTrackers",
    "auditPasswords",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  actionUrl: varchar("actionUrl", { length: 512 }),
  priority: int("priority").default(0).notNull(),
  isCompleted: int("isCompleted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = typeof recommendations.$inferInsert;

/**
 * Gamification - Streaks, Badges, and Progress
 */
export const privacyStreaks = mysqlTable("privacyStreaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastCheckInDate: timestamp("lastCheckInDate"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PrivacyStreak = typeof privacyStreaks.$inferSelect;
export type InsertPrivacyStreak = typeof privacyStreaks.$inferInsert;

export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeType: mysqlEnum("badgeType", [
    "e2eeMaster",
    "fingerprintGhost",
    "vpnGuardian",
    "phishingDefender",
    "passwordPro",
    "privacyChampion",
    "sevenDayStreak",
    "thirtyDayStreak",
  ]).notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * Password Vault
 */
export const passwordEntries = mysqlTable("passwordEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  websiteUrl: varchar("websiteUrl", { length: 512 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  encryptedPassword: text("encryptedPassword").notNull(),
  passwordStrength: mysqlEnum("passwordStrength", ["weak", "fair", "good", "strong"]).default("fair").notNull(),
  isBreached: int("isBreached").default(0).notNull(),
  lastModified: timestamp("lastModified").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordEntry = typeof passwordEntries.$inferSelect;
export type InsertPasswordEntry = typeof passwordEntries.$inferInsert;

/**
 * Email Module
 */
export const emailAliases = mysqlTable("emailAliases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  aliasEmail: varchar("aliasEmail", { length: 320 }).notNull().unique(),
  forwardingEmail: varchar("forwardingEmail", { length: 320 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailAlias = typeof emailAliases.$inferSelect;
export type InsertEmailAlias = typeof emailAliases.$inferInsert;

export const quarantinedEmails = mysqlTable("quarantinedEmails", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 512 }),
  threatType: mysqlEnum("threatType", ["phishing", "spam", "malware", "suspicious"]).notNull(),
  encryptedContent: text("encryptedContent"),
  isReviewed: int("isReviewed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuarantinedEmail = typeof quarantinedEmails.$inferSelect;
export type InsertQuarantinedEmail = typeof quarantinedEmails.$inferInsert;

/**
 * VPN and Browser Tracking
 */
export const vpnSessions = mysqlTable("vpnSessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  serverLocation: varchar("serverLocation", { length: 255 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
  dataUsedMB: int("dataUsedMB").default(0).notNull(),
  connectedAt: timestamp("connectedAt").defaultNow().notNull(),
  disconnectedAt: timestamp("disconnectedAt"),
});

export type VpnSession = typeof vpnSessions.$inferSelect;
export type InsertVpnSession = typeof vpnSessions.$inferInsert;

export const trackerBlocks = mysqlTable("trackerBlocks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  trackerDomain: varchar("trackerDomain", { length: 512 }).notNull(),
  trackerType: mysqlEnum("trackerType", ["analytics", "advertising", "social", "fingerprinting"]).notNull(),
  blockCount: int("blockCount").default(1).notNull(),
  lastBlockedAt: timestamp("lastBlockedAt").defaultNow().notNull(),
});

export type TrackerBlock = typeof trackerBlocks.$inferSelect;
export type InsertTrackerBlock = typeof trackerBlocks.$inferInsert;