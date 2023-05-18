import type { Adapter } from "next-auth/adapters";
import type { Knex } from "knex";

/*

Auth.js requires a specific database schema. Use the following Knex.js
migration to create it. Note: This migration is configured for MariaDB. It may
work out-of-the-box with other database engines, or you may need to modify it
according to your application.

export const up = (knex) => {
  return knex.schema
    .createTable("User", (table) => {
      table.uuid("id").defaultTo(knex.raw("(UUID())"));
      table.text("name");
      table.text("email").unique();
      table.timestamp("emailVerified");
      table.text("image");

      table.primary("id");
    })
    .createTable("Session", (table) => {
      table.uuid("id").defaultTo(knex.raw("(UUID())"));
      table.timestamp("expires");
      table.text("sessionToken").notNullable().unique();
      table.uuid("userId");

      table.primary("id");

      table.foreign("userId").references("id").on("User");
    })
    .createTable("Account", (table) => {
      table.uuid("id").defaultTo(knex.raw("(UUID())"));
      table.uuid("userId");
      table.text("type").notNullable();
      table.text("provider").notNullable();
      table.text("providerAccountId").notNullable();
      table.text("refresh_token");
      table.text("access_token");
      table.bigInteger("expires_at");
      table.text("token_type");
      table.text("scope");
      table.text("id_token");
      table.text("session_state");

      table.primary("id");

      table.unique(["provider", "providerAccountId"]);

      table.foreign("userId").references("id").on("User");
    })
    .createTable("VerificationToken", (table) => {
      table.text("identifier");
      table.string("token", 255);
      table.timestamp("expires").notNullable();

      table.primary("token");

      table.unique(["token", "identifier"]);
    });
};

export const down = (knex) => {
  return knex.schema
    .dropTable("VerificationToken")
    .dropTable("Account")
    .dropTable("Session")
    .dropTable("User");
};
*/

/**
 * A Next-Auth adapter for Knex.js
 *
 * @param knex - The Knex.js connection
 * @param options - Auth.js options
 * @returns {Adapter} - An Auth.js adapter for Knex.js
 */
export function KnexAdapter(knex: Knex): Adapter {
  return {
    async createUser(user) {
      // Insert user data into `User` table
      await knex("User").insert(user);

      // Get the full row that was just inserted
      const dbUsers = await knex("User")
        .select("*")
        .where({ email: user.email })
        .limit(1);

      // Return the newly inserted user data
      return dbUsers[0];
    },
    async getUser(id) {
      // Get a user row based on the id
      const dbUsers = await knex("User").select("*").where({ id }).limit(1);

      // If no user was found, return null
      if (dbUsers.length === 0) return null;

      // Return the user data
      return dbUsers[0];
    },
    async getUserByEmail(email) {
      // Get a user row based on the email
      const dbUsers = await knex("User").select("*").where({ email }).limit(1);

      // If no user was found, return null;
      if (dbUsers.length === 0) return null;

      // Return the user data
      return dbUsers[0];
    },
    async getUserByAccount({ providerAccountId, provider }) {
      // Get an account row based on the provider account information
      const dbAccounts = await knex("Account")
        .select("*")
        .where({ providerAccountId, provider })
        .limit(1);

      // If no account was found, return null
      if (dbAccounts.length === 0) return null;

      // If an account was found, get a user row based on the account
      const dbUsers = await knex("User")
        .select("*")
        .where({ id: dbAccounts[0].userId })
        .limit(1);

      // If no user was found, return null
      if (dbUsers.length === 0) return null;

      // Return the user data
      return dbUsers[0];
    },
    async updateUser(user) {
      // Update a user row based on id
      await knex("User").where({ id: user.id }).update(user);

      // Get the row that was just updated
      const dbUsers = await knex("User")
        .select("*")
        .where({ id: user.id })
        .limit(1);

      // Return the user data
      return dbUsers[0];
    },
    async deleteUser(userId) {
      // Delete session data for the given user
      await knex("Session").where({ userId }).del();

      // Delete account data for the given user
      await knex("Account").where({ userId }).del();

      // Delete user data for the given user
      await knex("User").where({ id: userId }).del();
    },
    async linkAccount(account) {
      // Insert account data into `Account` table
      await knex("Account").insert(account);

      // Get the row that was just inserted
      const dbAccounts = await knex("Account")
        .select("*")
        .where({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        })
        .limit(1);

      // Return the account data
      return dbAccounts[0];
    },
    async unlinkAccount({ providerAccountId, provider }) {
      // Delete an account row based on provider information
      await knex("Account").where({ providerAccountId, provider }).del();
    },
    async createSession(session) {
      // Insert a session row into the `Session` table
      await knex("Session").insert(session);

      // Get the row that was just inserted
      const dbSessions = await knex("Session")
        .select("*")
        .where({ sessionToken: session.sessionToken })
        .limit(1);

      // Return the session data
      return dbSessions[0];
    },
    async getSessionAndUser(sessionToken) {
      // Get a session row based on the given token
      const dbSessions = await knex("Session")
        .select("*")
        .where({ sessionToken })
        .limit(1);

      // If no session was found, return null
      if (dbSessions.length === 0) return null;

      // If session exists, get the user data for that session
      const dbUsers = await knex("User")
        .select("*")
        .where({ id: dbSessions[0].userId })
        .limit(1);

      // If no user was found, return null
      if (dbUsers.length === 0) return null;

      // Return the session and the user data
      return { session: dbSessions[0], user: dbUsers[0] };
    },
    async updateSession(session) {
      // Update a session row based on the given token
      await knex("Session")
        .where({ sessionToken: session.sessionToken })
        .update(session);

      // Get the session row that was just updated
      const dbSessions = await knex("Session")
        .select("*")
        .where({ sessionToken: session.sessionToken })
        .limit(1);

      // Return the session data
      return dbSessions[0];
    },
    async deleteSession(sessionToken) {
      // Get a session row based on the given token
      const dbSessions = await knex("Session")
        .select("*")
        .where({ sessionToken })
        .limit(1);

      // Delete a session row based on the given token
      await knex("Session").where({ sessionToken }).del();

      // Return the session data
      return dbSessions[0];
    },
    async createVerificationToken(verificationToken) {
      // Insert a new verification token row into the `VerificationToken` table
      await knex("VerificationToken").insert(verificationToken);

      // Get the verification token that was just inserted
      const dbVerificationTokens = await knex("VerificationToken")
        .select("*")
        .where({ token: verificationToken.token })
        .limit(1);

      // Return the verification token data
      return dbVerificationTokens[0];
    },
    async useVerificationToken({ identifier, token }) {
      // Get a verification token row based on id and token
      const dbVerificationTokens = await knex("VerificationToken")
        .select("*")
        .where({ identifier, token })
        .limit(1);

      // Delete that row
      await knex("VerificationToken").where({ identifier, token }).del();

      // Return the verification token data
      return dbVerificationTokens[0];
    },
  };
}
