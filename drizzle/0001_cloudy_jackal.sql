CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`alertType` enum('weakPassword','dataLeak','phishingEmail','maliciousTracker','unencryptedConnection','vpnDisconnected','suspiciousApp') NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`title` varchar(255) NOT NULL,
	`description` text,
	`isResolved` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`resolvedAt` timestamp,
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeType` enum('e2eeMaster','fingerprintGhost','vpnGuardian','phishingDefender','passwordPro','privacyChampion','sevenDayStreak','thirtyDayStreak') NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailAliases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`aliasEmail` varchar(320) NOT NULL,
	`forwardingEmail` varchar(320) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailAliases_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailAliases_aliasEmail_unique` UNIQUE(`aliasEmail`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`encryptedContent` text NOT NULL,
	`messageType` enum('text','voice','video') NOT NULL DEFAULT 'text',
	`selfDestructTimer` int,
	`isRevoked` int NOT NULL DEFAULT 0,
	`screenshotDetected` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passwordEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`websiteUrl` varchar(512) NOT NULL,
	`username` varchar(255) NOT NULL,
	`encryptedPassword` text NOT NULL,
	`passwordStrength` enum('weak','fair','good','strong') NOT NULL DEFAULT 'fair',
	`isBreached` int NOT NULL DEFAULT 0,
	`lastModified` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passwordEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `privacyMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`metricType` enum('e2eeMessages','selfDestructMessages','trackersBlocked','adsBlocked','fingerprintingBlocked','vpnConnected','e2eeEmails','phishingDetected','weakPasswords','breachesDetected') NOT NULL,
	`value` int NOT NULL DEFAULT 0,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `privacyMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `privacyScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`score` int NOT NULL,
	`messagingScore` int NOT NULL DEFAULT 0,
	`browsingScore` int NOT NULL DEFAULT 0,
	`vpnScore` int NOT NULL DEFAULT 0,
	`emailScore` int NOT NULL DEFAULT 0,
	`passwordScore` int NOT NULL DEFAULT 0,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `privacyScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `privacyStreaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastCheckInDate` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `privacyStreaks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quarantinedEmails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`senderEmail` varchar(320) NOT NULL,
	`subject` varchar(512),
	`threatType` enum('phishing','spam','malware','suspicious') NOT NULL,
	`encryptedContent` text,
	`isReviewed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quarantinedEmails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recommendationType` enum('updatePassword','enableVPN','reviewQuarantinedEmails','enableE2EE','blockTrackers','auditPasswords') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`actionUrl` varchar(512),
	`priority` int NOT NULL DEFAULT 0,
	`isCompleted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trackerBlocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trackerDomain` varchar(512) NOT NULL,
	`trackerType` enum('analytics','advertising','social','fingerprinting') NOT NULL,
	`blockCount` int NOT NULL DEFAULT 1,
	`lastBlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trackerBlocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vpnSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`serverLocation` varchar(255) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`dataUsedMB` int NOT NULL DEFAULT 0,
	`connectedAt` timestamp NOT NULL DEFAULT (now()),
	`disconnectedAt` timestamp,
	CONSTRAINT `vpnSessions_id` PRIMARY KEY(`id`)
);
