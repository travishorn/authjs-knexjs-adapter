import type { Adapter } from "next-auth/adapters";
import type { Knex } from "knex";

export { Adapter, Knex };

/**
 * An adapter for Auth.js/NextAuth.js to allow you to connect to any database
 * service via Knex.js.
 *
 * @param {Knex} knex - The Knex.js connection
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
    async getUserByAccount({ provider, providerAccountId }) {
      // Get a user row based on the associated account given the unique
      // provider account id and provider
      const dbUsers = await knex("User")
        .select("User.*")
        .join("Account", "Account.userId", "=", "User.id")
        .where({
          "Account.provider": provider,
          "Account.providerAccountId": providerAccountId,
        })
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
    async unlinkAccount({ provider, providerAccountId }) {
      // Delete an account row based on provider information
      await knex("Account").where({ provider, providerAccountId }).del();
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
