import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  privacy: router({
    getScore: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPrivacyScore(ctx.user.id);
    }),
    getMetrics: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPrivacyMetrics(ctx.user.id, 30);
    }),
    getAlerts: protectedProcedure.query(async ({ ctx }) => {
      return await db.getActiveAlerts(ctx.user.id);
    }),
  }),

  messaging: router({
    getConversations: protectedProcedure.query(async ({ ctx }) => {
      return await db.getConversations(ctx.user.id);
    }),
    sendMessage: protectedProcedure
      .input(z.object({ recipientId: z.number(), content: z.string(), selfDestruct: z.boolean().optional() }))
      .mutation(async ({ ctx, input }) => {
        return await db.createMessage(ctx.user.id, input);
      }),
    toggleScreenshotDetection: protectedProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        return await db.updateUserPreference(ctx.user.id, 'screenshotDetection', input.enabled);
      }),
  }),

  browser: router({
    getTrackerStats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getTrackerBlockStats(ctx.user.id);
    }),
    toggleTrackerBlocking: protectedProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        return await db.updateUserPreference(ctx.user.id, 'trackerBlocking', input.enabled);
      }),
    toggleAdBlocking: protectedProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        return await db.updateUserPreference(ctx.user.id, 'adBlocking', input.enabled);
      }),
  }),

  vpn: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      return await db.getActiveVpnSession(ctx.user.id);
    }),
    toggleVpn: protectedProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        return await db.updateVpnStatus(ctx.user.id, input.enabled);
      }),
    getServers: protectedProcedure.query(async ({ ctx }) => {
      return await db.getVpnServers();
    }),
  }),

  email: router({
    getAliases: protectedProcedure.query(async ({ ctx }) => {
      return await db.getEmailAliases(ctx.user.id);
    }),
    getQuarantined: protectedProcedure.query(async ({ ctx }) => {
      return await db.getQuarantinedEmails(ctx.user.id);
    }),
    createAlias: protectedProcedure
      .input(z.object({ alias: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await db.createEmailAlias({ userId: ctx.user.id, alias: input.alias } as any);
      }),
    deleteAlias: protectedProcedure
      .input(z.object({ aliasId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.deleteEmailAlias(ctx.user.id, input.aliasId);
      }),
  }),

  vault: router({
    getPasswords: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPasswordEntries(ctx.user.id);
    }),
    getBreachedPasswords: protectedProcedure.query(async ({ ctx }) => {
      return await db.getBreachedPasswords(ctx.user.id);
    }),
    addPassword: protectedProcedure
      .input(z.object({ site: z.string(), username: z.string(), password: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await db.createPasswordEntry({ userId: ctx.user.id, ...input } as any);
      }),
    deletePassword: protectedProcedure
      .input(z.object({ passwordId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.deletePasswordEntry(ctx.user.id, input.passwordId);
      }),
  }),

  gamification: router({
    getStreak: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPrivacyStreak(ctx.user.id);
    }),
    getBadges: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserBadges(ctx.user.id);
    }),
    incrementStreak: protectedProcedure.mutation(async ({ ctx }) => {
      return await db.updatePrivacyStreak(ctx.user.id, { currentStreak: 1, lastCheckInDate: new Date() });
    }),
  }),

  settings: router({
    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserPreferences(ctx.user.id);
    }),
    updatePreferences: protectedProcedure
      .input(z.object({
        trackerBlocking: z.boolean().optional(),
        adBlocking: z.boolean().optional(),
        screenshotDetection: z.boolean().optional(),
        twoFactorAuth: z.boolean().optional(),
        biometricLogin: z.boolean().optional(),
        sessionTimeout: z.number().optional(),
        loginAlerts: z.boolean().optional(),
        analyticsEnabled: z.boolean().optional(),
        crashReports: z.boolean().optional(),
        criticalAlerts: z.boolean().optional(),
        highPriorityAlerts: z.boolean().optional(),
        mediumPriorityAlerts: z.boolean().optional(),
        lowPriorityAlerts: z.boolean().optional(),
        inAppNotifications: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.updateUserPreferences(ctx.user.id, input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
