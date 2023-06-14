CREATE TABLE `Account` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `userId` char(36) DEFAULT NULL,
  `type` text NOT NULL,
  `provider` text NOT NULL,
  `providerAccountId` text NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` bigint(20) DEFAULT NULL,
  `token_type` text DEFAULT NULL,
  `scope` text DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_provider_provideraccountid_unique` (`provider`,`providerAccountId`) USING HASH,
  KEY `account_userid_foreign` (`userId`),
  CONSTRAINT `account_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
);

CREATE TABLE `Session` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `expires` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sessionToken` text NOT NULL,
  `userId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_sessiontoken_unique` (`sessionToken`) USING HASH,
  KEY `session_userid_foreign` (`userId`),
  KEY `session_sessiontoken_index` (`sessionToken`(768)),
  CONSTRAINT `session_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
);

CREATE TABLE `User` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `emailVerified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image` text DEFAULT NULL,
  `siteAdmin` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`) USING HASH
);

CREATE TABLE `VerificationToken` (
  `identifier` text DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`token`),
  UNIQUE KEY `verificationtoken_token_identifier_unique` (`token`,`identifier`) USING HASH
);
